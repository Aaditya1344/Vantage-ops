// Firestore database operations
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let db = null;
let useLocalDb = true;

const LOCAL_DB_PATH = path.join(__dirname, '../local_db.json');

const DEFAULT_DB = {
  liveData: { type: 'empty', timestamp: null, data: [] },
  history: []
};

function readLocalDb() {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
      return DEFAULT_DB;
    }
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
  } catch (err) {
    console.warn('local_db.json unreadable, resetting:', err.message);
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
    return { ...DEFAULT_DB };
  }
}

function writeLocalDb(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
}

// In-memory cache — avoids disk reads on every request
let memoryCache = null;

function readLocalDb() {
  if (memoryCache) return memoryCache; // return cache if available
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      memoryCache = { ...DEFAULT_DB };
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(memoryCache, null, 2));
      return memoryCache;
    }
    memoryCache = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
    return memoryCache;
  } catch (err) {
    console.warn('local_db.json unreadable, resetting:', err.message);
    memoryCache = { ...DEFAULT_DB };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(memoryCache, null, 2));
    return memoryCache;
  }
}

function writeLocalDb(data) {
  memoryCache = data; // update cache
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
}

/**
 * Initializes Firebase Admin SDK using service account credentials
 * Supports both file-based (local) and env var (Render) credential loading
 */
function initFirestore() {
  try {
    let serviceAccount = null;

    // Option 1: JSON string in env var (for Render)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      console.log('🔑 Firebase: Using credentials from environment variable.');
    }
    // Option 2: File path (for local development)
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const filePath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      if (fs.existsSync(filePath)) {
        serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log('🔑 Firebase: Using credentials from file.');
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      db = admin.firestore();
      db.settings({ ignoreUndefinedProperties: true });
      useLocalDb = false;
      console.log('✅ Firebase Firestore connected successfully.');
    } else {
      console.log('⚠️ No Firebase credentials found. Using local fallback mode.');
    }
  } catch (err) {
    console.error('❌ Firebase init failed, using local fallback:', err.message);
  }
}

async function getLiveData() {
  if (useLocalDb) {
    const data = readLocalDb();
    return data.liveData;
  }
  const doc = await db.collection('stadium_state').doc('live').get();
  return doc.exists ? doc.data() : { type: 'empty', timestamp: null, data: [] };
}

async function setLiveData(liveData) {
  if (useLocalDb) {
    const data = readLocalDb();
    data.liveData = liveData;
    writeLocalDb(data);
  } else {
    await db.collection('stadium_state').doc('live').set(liveData, { merge: true });
  }
}

/**
 * Adds a history entry to local display cache and archives to Firestore
 * Local cache keeps last 6 entries for fast display
 * Firestore keeps permanent record for post-match review
 * @param {Object} entry - History entry object
 */

async function addHistoryEntry(entry) {
  entry.timestamp = entry.timestamp || new Date().toISOString();
  entry.resolved = false;

  if (useLocalDb) {
    const data = readLocalDb();    data.history.unshift(entry);
    if (data.history.length > 6) data.history = data.history.slice(0, 6);
    writeLocalDb(data);
  } else {
    // Keep last 6 in memory
    const data = readLocalDb();
    data.history.unshift(entry);
    if (data.history.length > 6) data.history = data.history.slice(0, 6);
    writeLocalDb(data);
    // Archive to Firestore
    try {
      await db.collection('history').add(entry);
      console.log('[Firestore] History entry archived.');
    } catch (err) {
      console.error('[Firestore] Failed to archive:', err.message);
    }
  }
}

async function getHistory() {
  const data = readLocalDb();
  return data.history;
}

async function getArchive({ urgency, limit = 50 } = {}) {
  if (useLocalDb || !db) {
    const data = readLocalDb();
    return data.history;
  }
  try {
    let query = db.collection('history')
      .orderBy('timestamp', 'desc')
      .limit(limit);
    if (urgency) {
      query = db.collection('history')
        .where('urgency', '==', urgency)
        .orderBy('timestamp', 'desc')
        .limit(limit);
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('[Firestore] getArchive failed:', err.message);
    const data = readLocalDb();
    return data.history;
  }
}

async function clearDatabase() {
  const emptyData = { type: 'empty', timestamp: null, data: [] };
  const data = readLocalDb();
  data.liveData = emptyData;
  data.history = [];
  writeLocalDb(data);
  console.log('[Local] Display data cleared. Firestore archive preserved.');
}

async function clearHistory() {
  // Clear local display
  const data = readLocalDb();
  data.history = [];
  writeLocalDb(data);

  // Clear Firestore history for this deployment
  if (!useLocalDb && db) {
    try {
      const snapshot = await db.collection('history').get();
      if (!snapshot.empty) {
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log('[Firestore] History cleared on new upload.');
      }
    } catch (err) {
      console.error('[Firestore] Failed to clear history:', err.message);
    }
  }
}

module.exports = {
  initFirestore,
  getLiveData,
  setLiveData,
  addHistoryEntry,
  getHistory,
  getArchive,
  clearDatabase,
  clearHistory,
  getDb: () => db,
  isUsingLocalDb: () => useLocalDb
};

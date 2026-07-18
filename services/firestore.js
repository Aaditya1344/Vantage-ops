// Firestore database operations
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let db = null;
let useLocalDb = true;

// Initialize Firestore
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
    const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '../local_db.json'), 'utf8'));
    return data.liveData;
  }
  const doc = await db.collection('stadium_state').doc('live').get();
  return doc.exists ? doc.data() : { type: 'empty', timestamp: null, data: [] };
}

async function setLiveData(liveData) {
  if (useLocalDb) {
    const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '../local_db.json'), 'utf8'));
    data.liveData = liveData;
    fs.writeFileSync(require('path').join(__dirname, '../local_db.json'), JSON.stringify(data, null, 2));
  } else {
    await db.collection('stadium_state').doc('live').set(liveData, { merge: true });
  }
}

async function addHistoryEntry(entry) {
  entry.timestamp = entry.timestamp || new Date().toISOString();
  entry.resolved = false;

  if (useLocalDb) {
    const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '../local_db.json'), 'utf8'));
    data.history.unshift(entry);
    if (data.history.length > 6) data.history = data.history.slice(0, 6);
    fs.writeFileSync(require('path').join(__dirname, '../local_db.json'), JSON.stringify(data, null, 2));
  } else {
    // Keep last 6 in memory
    const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '../local_db.json'), 'utf8'));
    data.history.unshift(entry);
    if (data.history.length > 6) data.history = data.history.slice(0, 6);
    fs.writeFileSync(require('path').join(__dirname, '../local_db.json'), JSON.stringify(data, null, 2));

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
  const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '../local_db.json'), 'utf8'));
  return data.history;
}

async function getArchive({ urgency, limit = 50 } = {}) {
  if (useLocalDb || !db) {
    const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '../local_db.json'), 'utf8'));
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
    const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '../local_db.json'), 'utf8'));
    return data.history;
  }
}

async function clearDatabase() {
  const emptyData = { type: 'empty', timestamp: null, data: [] };
  const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '../local_db.json'), 'utf8'));
  data.liveData = emptyData;
  data.history = [];
  fs.writeFileSync(require('path').join(__dirname, '../local_db.json'), JSON.stringify(data, null, 2));
  console.log('[Local] Display data cleared. Firestore archive preserved.');
}

module.exports = {
  initFirestore,
  getLiveData,
  setLiveData,
  addHistoryEntry,
  getHistory,
  getArchive,
  clearDatabase,
  getDb: () => db,
  isUsingLocalDb: () => useLocalDb
};
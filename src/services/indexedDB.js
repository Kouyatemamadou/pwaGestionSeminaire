const DB_NAME = 'SeminaristeDB';
const DB_VERSION = 1;
const STORE_NAME = 'seminaristes';

export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('synced', 'synced', { unique: false });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

export const saveSeminaristeOffline = async (data) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.put({
      ...data,
      synced: false,
      timestamp: Date.now()
    });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getSeminaristeOffline = async (id) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getUnsyncedData = async () => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('synced');
    const request = index.getAll(false);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const markAsSynced = async (id) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const data = request.result;
      if (data) {
        data.synced = true;
        const updateRequest = store.put(data);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        resolve();
      }
    };

    request.onerror = () => reject(request.error);
  });
};

export const syncOfflineData = async () => {
  const unsyncedData = await getUnsyncedData();
  
  for (const data of unsyncedData) {
    try {
      await updateSeminariste(data.id, data);
      await markAsSynced(data.id);
      console.log(`Séminariste ${data.id} synchronisé`);
    } catch (error) {
      console.error(`Erreur lors de la sync de ${data.id}:`, error);
    }
  }
};

// Écouter le retour de connexion
window.addEventListener('online', () => {
  console.log('Connexion rétablie, synchronisation...');
  syncOfflineData();
});

const indexedDB = window.indexedDB || window.mozIndexedDB
let db;
const requestObject = indexedDB.open("budget-tracker", 1)

requestObject.onsuccess = (target) => {
    db = target.result;
    console.log(db.result);
}

export function useIndexedDb(databaseName, storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, 1);
    let db, tx, store;

    request.onupgradeneeded = function (e) {
      const db = request.result;
      db.createObjectStore(storeName, { keyPath: "_id" });
    };

    request.onerror = function (e) {
      console.log("There was an error");
    };
  });
}
export function checkForIndexedDb() {
  if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB.");
    return false;
  }
  return true;
}

const indexedDB = window.indexedDB || window.mozIndexedDB;
let db;
const requestObject = indexedDB.open("budget-tracker", 1);

requestObject.onsuccess = ({target}) => {
  let db = target.result;
  console.log(db.result);

  if (navigator.onLine) {
    checkForIndexedDb();
  }
};

requestObject.onupgradeneeded = ({target}) => {
  let db = target.result;
  db.createObjectStore("pending", {
    autoIncrement: true,
  });
};

requestObject.onerror = function (e) {
  console.log("There was an error" + e.target.errorCode);
};

function saveRecord(recordToBeSaved) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  store.add(recordToBeSaved);
}

function checkForIndexedDb() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAllData = store.getAll();

  getAllData.onsuccess = function () {
    if (getAllData > 0) {
      fetch("/api/transaction/bulk", {
        method: "post",
        body: JSON.stringify(getAllData.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((dataResponse) => {
          return dataResponse.json();
        })
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");

          store.clear()
        });
    }
  };
}

window.addEventListener("online", checkForIndexedDb);

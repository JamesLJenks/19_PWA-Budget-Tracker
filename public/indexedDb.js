import { json, response } from "express";

const indexedDB = window.indexedDB || window.mozIndexedDB;
let db;
const requestObject = indexedDB.open("budget-tracker", 1);

requestObject.onsuccess = (target) => {
  db = target.result;
  console.log(db.result);

  if (navigator.onLine) {
    checkForIndexedDb();
  }
};

requestObject.onupgradeneeded = (target) => {
  db = target.result;
  console.log("On upgrade needed" + db.result);
  db.createObjectStore("Pending", {
    autoIncrement: true,
  });
};

requestObject.onerror = function (e) {
  console.log("There was an error" + e.target.errorCode);
};

function saveRecord(recordToBeSaved) {
  const transaction = db.transaction(["Pending"], "readwrite");
  const store = transaction.objectStore("Pending");
  store.add(recordToBeSaved);
}

export function checkForIndexedDb() {
  const checkBudget = db.transaction(["Pending"], "readwrite");
  const store = checkBudget.objectStore("Pending");
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
          const checkBudget = db.transaction(["Pending"], "readwrite");
          const store = checkBudget.objectStore("Pending");

          store.clear()
        });
    }
  };
}

window.addEventListener("online", checkForIndexedDb);

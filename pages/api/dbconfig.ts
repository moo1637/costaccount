import { resolve } from "path";

const DBVERSION = 1;
const INGREDSTORE = "ingredient";
let db: IDBDatabase;

export function doDatabaseStuff() {
  try {
    return new Promise<void>((resolve, reject) => {
      if (!indexedDB) {
        alert("지원하지 않는 브라우저 입니다.");
        reject();
      } else {
        const dbReq = indexedDB.open("shop", DBVERSION);

        dbReq.onerror = (Event) => {
          console.error("error", Event);
          reject();
        };

        dbReq.onsuccess = (Event) => {
          console.log("onsuccess", Event);
          if (Event.target !== null) {
            if (Event.target instanceof IDBOpenDBRequest) {
              db = Event.target.result;
              resolve();
            }
          }
        };

        dbReq.onupgradeneeded = (Event: IDBVersionChangeEvent) => {
          console.log("onupgradeneeded", Event);
          if (Event.target !== null) {
            if (Event.target instanceof IDBOpenDBRequest) {
              db = Event.target.result;
              if (Event.oldVersion < 1) {
                db.createObjectStore(INGREDSTORE, {
                  keyPath: "name",
                });
                db.createObjectStore("recipe", {
                  keyPath: "name",
                });
              }
            }
          }
        };
      }
    });
  } catch (e) {
    return false;
  }
}

const pageLimit = 10;

export async function getIngredientList(
  pageNumber: number = 1
): Promise<any[]> {
  await doDatabaseStuff();

  return new Promise((resolve, reject) => {
    const store = db
      .transaction(INGREDSTORE, "readonly")
      .objectStore(INGREDSTORE);

    const cursorReq = store.openCursor();
    let retArr: any[] = [];
    let cursorPosition = 0;
    cursorReq.onsuccess = (event) => {
      let cursor = event.target.result;
      console.log("cursor", cursor);
      if (cursor) {
        if (cursorPosition < (pageNumber - 1) * pageLimit) {
          // 이전 페이지 데이터는 skip
          cursor.advance((pageNumber - 1) * pageLimit - cursorPosition);
          cursorPosition = (pageNumber - 1) * pageLimit;
        } else if (cursorPosition >= pageNumber * pageLimit) {
          // 다음 페이지 데이터는 없음
          return;
        } else {
          // 현재 페이지 데이터 보여주기
          // do something with the data
          retArr.push(cursor.value);
          cursorPosition++;
          cursor.continue();
        }
      } else {
        resolve(retArr);
      }
    };
    cursorReq.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function getIngredient(
  key: string
): Promise<{ name: string; price: string; weight: string }> {
  await doDatabaseStuff();

  return new Promise((resolve, reject) => {
    const store = db
      .transaction(INGREDSTORE, "readonly")
      .objectStore(INGREDSTORE);
    const getReq = store.get(key);
    getReq.onerror = (Event) => {
      console.error(Event);
      reject();
    };
    getReq.onsuccess = (Event) => {
      console.log("Event", Event);
      if (Event.target instanceof IDBRequest) {
        resolve(Event.target.result);
      }
    };
  });
}

export async function addIngredient(obj: Object) {
  await doDatabaseStuff();

  const store = db
    .transaction(INGREDSTORE, "readwrite")
    .objectStore(INGREDSTORE);
  const addReq = store.add(obj);
  addReq.onerror = (Event) => console.error(Event);
  addReq.onsuccess = (Event) => console.log(Event);
}

export async function getDatabaseWrite() {
  await doDatabaseStuff();
}
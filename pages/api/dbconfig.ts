import { GridRowId } from "@mui/x-data-grid";

const DBVERSION = 1;
const INGREDSTORE = "ingredient";
let db: IDBDatabase;

export type Ingredient = {
  name: string;
  price: number;
  weight: number;
};
type response = {
  success: boolean;
  message: string;
};
export function doDatabaseStuff(): Promise<{
  response: boolean;
  message?: "string";
}> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve({ response: true });
      return;
    }
    if (!indexedDB) {
      reject({ response: false, message: "지원하지 않는 브라우저 입니다." });
    } else {
      const dbReq = indexedDB.open("shop", DBVERSION);

      dbReq.onerror = (event) => {
        reject({
          response: false,
          message: handleError((event.target as IDBRequest).error),
        });
      };

      dbReq.onsuccess = (event) => {
        if (event.target instanceof IDBOpenDBRequest) {
          db = event.target.result;
          resolve({ response: true });
        }
      };

      dbReq.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        if (event.target instanceof IDBOpenDBRequest) {
          db = event.target.result;
          if (event.oldVersion < 1) {
            db.createObjectStore(INGREDSTORE, {
              keyPath: "id",
              autoIncrement: true,
            });
            db.createObjectStore("recipe", {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        }
      };
    }
  });
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
      if (event.target instanceof IDBRequest) {
        let cursor = event.target?.result;
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
      }
    };
    cursorReq.onerror = (event) => {
      reject(event);
    };
  });
}

export async function getIngredient(key: number): Promise<Ingredient> {
  await doDatabaseStuff();

  return new Promise((resolve, reject) => {
    const store = db
      .transaction(INGREDSTORE, "readonly")
      .objectStore(INGREDSTORE);
    const getReq = store.get(key);
    getReq.onerror = (event) => {
      console.error(event);
      reject();
    };
    getReq.onsuccess = (event) => {
      if (event.target instanceof IDBRequest) {
        resolve(event.target.result);
      }
    };
  });
}

export async function addIngredient(
  obj: Ingredient,
  callback: (success: boolean, message: any) => void
) {
  await doDatabaseStuff();

  const store = db
    .transaction(INGREDSTORE, "readwrite")
    .objectStore(INGREDSTORE);
  const addReq = store.add(obj);
  addReq.onerror = (event) => {
    console.log("event", event);
    callback(false, handleError((event.target as IDBRequest).error));
  };
  addReq.onsuccess = (event) =>
    callback(true, (event.target as IDBRequest).result);
}

export async function deleteIngredient(target: GridRowId[]): Promise<response> {
  await doDatabaseStuff();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(INGREDSTORE, "readwrite");
    const store = tx.objectStore(INGREDSTORE);

    target.forEach((key) => {
      store.delete(key);
    });

    tx.oncomplete = (event) =>
      resolve({ success: true, message: "완료되었습니다." });
    tx.onerror = (event) =>
      reject({
        success: false,
        message: handleError((event.target as IDBRequest).error),
      });
  });
}

function handleError(error: DOMException | null): string {
  let message: string = "알 수 없는 오류가 발생하였습니다.";

  switch (error?.name) {
    case "ConstraintError":
      message = "해당 키는 이미 존재합니다.";
      break;
    case "VersionError":
      message = "인덱스 버전을 업그레이드하는 도중 에러가 발생하였습니다.";
      break;
    case "AbortError":
      message = "트랜잭션이 중단되었습니다.";
      break;
    default:
      break;
  }

  return message;
}

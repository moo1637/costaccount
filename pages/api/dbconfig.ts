import { GridRowId } from "@mui/x-data-grid";

const DBVERSION = 1;
export enum StoreType {
  INGREDIENT = "ingredient",
  RECIPE = "recipe",
}
let db: IDBDatabase;
type AllowedStoreType = StoreType.INGREDIENT | StoreType.RECIPE;

export type Ingredient = {
  id?: number; // 자동생성 값으로 있을수도/없을수도 있음
  name: string;
  price: number;
  weight: number;
};
export type Step = {
  stepNo: number;
  id: number; // 재료 id
  weight: number;
  description: string;
};
export type Recipe = {
  name: string;
  description: string;
  cnt: number;
  step: Step[];
};
type response = {
  success: boolean;
  message: string;
};
export function doDatabaseStuff(): Promise<response> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve({
        success: true,
        message: "데이터베이스가 이미 연결되어있습니다.",
      });
      return;
    }
    if (!indexedDB) {
      reject({ success: false, message: "지원하지 않는 브라우저 입니다." });
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
          resolve({
            success: true,
            message: "데이터베이스 연결을 성공하였습니다.",
          });
        }
      };

      dbReq.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        if (event.target instanceof IDBOpenDBRequest) {
          db = event.target.result;
          if (event.oldVersion < 1) {
            db.createObjectStore(StoreType.INGREDIENT, {
              keyPath: "id",
              autoIncrement: true,
            });
            db.createObjectStore(StoreType.RECIPE, {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        }
      };
    }
  });
}

const pageLimit = 1000;

export async function getDBDataList(
  objStore: AllowedStoreType,
  pageNumber: number = 1
): Promise<Ingredient[] | Recipe[]> {
  await doDatabaseStuff();

  return new Promise((resolve, reject) => {
    const store = db.transaction(objStore, "readonly").objectStore(objStore);

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

export async function getDBDataObject(
  objStore: AllowedStoreType,
  key: number
): Promise<Ingredient | Recipe> {
  await doDatabaseStuff();

  return new Promise((resolve, reject) => {
    const store = db.transaction(objStore, "readonly").objectStore(objStore);
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

//재료 등록
export async function addDBDataObject(
  objStore: AllowedStoreType,
  obj: Ingredient | Recipe
): Promise<response> {
  await doDatabaseStuff();

  return new Promise((resolve, reject) => {
    const store = db.transaction(objStore, "readwrite").objectStore(objStore);
    const addReq = store.add(obj);
    addReq.onerror = (event) =>
      reject({
        success: false,
        message: handleError((event.target as IDBRequest).error),
      });
    addReq.onsuccess = (event) =>
      resolve({ success: true, message: "완료되었습니다." });
  });
}

//재료 수정
export async function modifyDBDataObject(
  objStore: AllowedStoreType,
  obj: Ingredient | Recipe,
  key: number
): Promise<response> {
  await doDatabaseStuff();
  return new Promise((resolve, reject) => {
    const store = db.transaction(objStore, "readwrite").objectStore(objStore);
    console.log(obj, key);
    const putReq = store.put({ ...obj, id: key });

    putReq.onerror = (event) =>
      reject({
        success: false,
        message: handleError((event.target as IDBRequest).error),
      });

    putReq.onsuccess = (event) =>
      resolve({ success: true, message: "완료되었습니다." });
  });
}

export async function deleteDBDataList(
  objStore: AllowedStoreType,
  target: GridRowId[]
): Promise<response> {
  await doDatabaseStuff();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(objStore, "readwrite");
    const store = tx.objectStore(objStore);

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

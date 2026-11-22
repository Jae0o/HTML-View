import type { FolderRecord } from "../types";

// 폴더 연결(핸들)은 브라우저 저장소 중 IndexedDB 에만 담을 수 있다
const DB_NAME = "0docs";
const STORE_NAME = "folders";

/** 이 브라우저에서 폴더를 골라 열 수 있는지 */
export const isFolderPickerSupported = (): boolean => "showDirectoryPicker" in window;

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

/** 기기에 저장된 등록 폴더 — 등록한 순서 */
export const readFolderRecords = async (): Promise<FolderRecord[]> => {
  const db = await openDb();

  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME).objectStore(STORE_NAME).getAll();

      request.onsuccess = () => resolve((request.result as FolderRecord[]).toSorted((a, b) => a.addedAt - b.addedAt));
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
};

export const writeFolderRecord = async (record: FolderRecord): Promise<void> => {
  const db = await openDb();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");

      transaction.objectStore(STORE_NAME).put(record);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
};

/** 등록 폴더 기록의 보이는 이름만 바꾼다 — 같은 기록을 읽고 고쳐 쓰는 것을 한 번에 한다 */
export const renameFolderRecord = async (id: string, name: string): Promise<void> => {
  const db = await openDb();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) store.put({ ...(request.result as FolderRecord), name });
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
};

/** 등록 폴더 기록의 숨긴 경로만 바꾼다 — 같은 기록을 읽고 고쳐 쓰는 것을 한 번에 한다 */
export const writeHiddenPaths = async (id: string, hiddenPaths: string[]): Promise<void> => {
  const db = await openDb();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) store.put({ ...(request.result as FolderRecord), hiddenPaths });
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
};

export const deleteFolderRecord = async (id: string): Promise<void> => {
  const db = await openDb();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");

      transaction.objectStore(STORE_NAME).delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
};

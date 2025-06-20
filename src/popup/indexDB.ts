// db.ts
import { openDB } from 'idb';

const DB_NAME = 'mock-db';
const STORE_NAME = 'mocks';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' });
      }
    },
  });
}

export async function saveMock(
  url: string,
  response: string,
  enabled: boolean
) {
  const db = await getDB();
  await db.put(STORE_NAME, {
    url,
    response,
    enabled,
  });
}

export async function getMock(url: string): Promise<object | null> {
  const db = await getDB();
  const entry = await db.get(STORE_NAME, url);
  return entry ? { response: entry.response, enabled: entry.enabled } : null;
}

export async function getAllMocks(): Promise<
  { url: string; response: object; enabled: boolean }[]
> {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function deleteMock(url: string) {
  const db = await getDB();
  const tx = db.transaction('mocks', 'readwrite');
  await tx.objectStore('mocks').delete(url);
  await tx.done;
}

export async function updateMock(
  oldUrl: string,
  update: Partial<{ url: string; response: object; enabled: boolean }>
) {
  const db = await getDB();
  const tx = db.transaction('mocks', 'readwrite');
  const store = tx.objectStore('mocks');

  // const mock = await store.get(url);
  // if (mock) {
  //   const updated = { ...mock, ...update };
  //   await store.put(updated);
  // }
  // await tx.done;
  const existing = await store.get(oldUrl);

  const newUrl = update.url ?? oldUrl;

  if (newUrl !== oldUrl) {
    // удаляем старую запись
    await store.delete(oldUrl);
  }

  const updated = {
    ...existing,
    ...update,
    url: newUrl,
  };

  await store.put(updated);
  await tx.done;
}

export async function toggleMock(url: string, enabled: boolean) {
  const db = await getDB();
  const tx = db.transaction('mocks', 'readwrite');
  const store = tx.objectStore('mocks');
  const mock = await store.get(url);

  if (!mock) return;

  mock.enabled = enabled;
  await store.put(mock);
  await tx.done;
}

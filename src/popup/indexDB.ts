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

export async function saveMock(url: string, response: string) {
  const db = await getDB();
  await db.put(STORE_NAME, { url, response });
}

export async function getMock(url: string): Promise<object | null> {
  const db = await getDB();
  return (await db.get(STORE_NAME, url))?.response || null;
}

export async function getAllMocks(): Promise<
  { url: string; response: object }[]
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
  url: string,
  update: Partial<{ response: object }>
) {
  const db = await getDB();
  const tx = db.transaction('mocks', 'readwrite');
  const store = tx.objectStore('mocks');
  const mock = await store.get(url);
  if (mock) {
    const updated = { ...mock, ...update };
    await store.put(updated);
  }
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

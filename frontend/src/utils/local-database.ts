export interface LocalDatabase {
  get(key: string): Promise<any>;
  put(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

export class IndexedDBDatabase implements LocalDatabase {
  private dbName: string;
  private db: IDBDatabase | null = null;

  constructor(dbName: string) {
    this.dbName = dbName;
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('keyvaluepairs');
      };
    });
  }

  async get(key: string): Promise<any> {
    await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['keyvaluepairs'], 'readonly');
      const store = transaction.objectStore('keyvaluepairs');
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async put(key: string, value: any): Promise<void> {
    await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['keyvaluepairs'], 'readwrite');
      const store = transaction.objectStore('keyvaluepairs');
      const request = store.put(value, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async delete(key: string): Promise<void> {
    await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['keyvaluepairs'], 'readwrite');
      const store = transaction.objectStore('keyvaluepairs');
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['keyvaluepairs'], 'readwrite');
      const store = transaction.objectStore('keyvaluepairs');
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async has(key: string): Promise<boolean> {
    await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['keyvaluepairs'], 'readonly');
      const store = transaction.objectStore('keyvaluepairs');
      const request = store.count(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result > 0);
    });
  }

  private async waitForDB(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }
}

// 创建数据库实例工厂
export const createDatabase = (name: string): LocalDatabase => {
  return new IndexedDBDatabase(name);
}; 
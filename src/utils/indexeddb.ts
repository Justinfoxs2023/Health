export class IndexedDB {
  private db: IDBDatabase;

  constructor(private dbName: string, private version: number) {}

  async createStores(storeNames: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        storeNames.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          }
        });
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
    });
  }

  async add(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getAll(storeName: string, query?: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        let results = request.result;
        if (query) {
          results = results.filter(item => 
            Object.entries(query).every(([key, value]) => item[key] === value)
          );
        }
        resolve(results);
      };
    });
  }

  async delete(storeName: string, key: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteOlderThan(storeName: string, timestamp: number): Promise<void> {
    const items = await this.getAll(storeName);
    const deletePromises = items
      .filter(item => item.timestamp < timestamp)
      .map(item => this.delete(storeName, item.id));
    
    await Promise.all(deletePromises);
  }

  async getSize(): Promise<number> {
    return new Promise((resolve, reject) => {
      const sizes: number[] = [];
      const transaction = this.db.transaction(this.db.objectStoreNames, 'readonly');
      
      Array.from(this.db.objectStoreNames).forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const request = store.count();
        request.onsuccess = () => sizes.push(request.result);
      });

      transaction.oncomplete = () => resolve(sizes.reduce((a, b) => a + b, 0));
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
} 
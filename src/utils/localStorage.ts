export class LocalStorage {
  private prefix: string = 'health_';

  constructor(prefix?: string) {
    if (prefix) {
      this.prefix = prefix;
    }
  }

  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  }

  get(key: string): any {
    try {
      const serializedValue = localStorage.getItem(this.prefix + key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  getSize(): number {
    let size = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    });

    return size;
  }

  getAll(): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const value = this.get(key.slice(this.prefix.length));
        if (value !== null) {
          result[key.slice(this.prefix.length)] = value;
        }
      }
    });

    return result;
  }

  has(key: string): boolean {
    return localStorage.getItem(this.prefix + key) !== null;
  }

  setWithExpiry(key: string, value: any, ttl: number): void {
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    this.set(key, item);
  }

  getWithExpiry(key: string): any {
    const item = this.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.remove(key);
      return null;
    }

    return item.value;
  }

  cleanup(): void {
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const item = this.get(key.slice(this.prefix.length));
        if (item && item.expiry && Date.now() > item.expiry) {
          this.remove(key.slice(this.prefix.length));
        }
      }
    });
  }
} 
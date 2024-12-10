declare module 'mongoose' {
  import { Connection, ConnectOptions } from 'mongodb';
  
  export interface Document {
    _id: any;
    id?: string;
    save(): Promise<this>;
  }

  export interface Model<T extends Document> {
    new(doc?: Partial<T>): T;
    create(doc: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(conditions: any): Promise<T | null>;
    find(conditions: any): Promise<T[]>;
    updateOne(conditions: any, doc: any): Promise<any>;
    deleteOne(conditions: any): Promise<any>;
  }

  export function model<T extends Document>(
    name: string,
    schema: Schema,
    collection?: string
  ): Model<T>;

  export function connect(
    uri: string,
    options?: ConnectOptions
  ): Promise<typeof mongoose>;

  export class Schema {
    constructor(definition: any, options?: any);
    index(fields: any, options?: any): this;
  }

  export const Types: {
    ObjectId: {
      new(id?: string | number): any;
    };
  };
} 
/**
 * @fileoverview TS 文件 interfaces.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IDatabaseConfig {
  /** uri 的描述 */
    uri: string;
  /** database 的描述 */
    database: string;
  /** options 的描述 */
    options: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    maxPoolSize: number;
    minPoolSize: number;
    connectTimeoutMS: number;
    socketTimeoutMS: number;
  };
}

export interface IShardingConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** collections 的描述 */
    collections: Record
    /** string 的描述 */
    string,
    {
      shardKey: string;
      shardCount: number;
      shardingStrategy: hash  range;
      indexes: Array{
        keys: Recordstring, number;
        options: Recordstring, any;
      }>;
    }
  >;
}

export interface IReplicationConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** replicas 的描述 */
    replicas: Array{
    host: string;
    port: number;
    priority: number;
  }>;
}

export interface IQueryOptions {
  /** limit 的描述 */
    limit: number;
  /** skip 的描述 */
    skip: number;
  /** sort 的描述 */
    sort: Recordstring, 1  1;
  projection: Recordstring, 1  0;
  timeout: number;
}

export interface IBulkWriteOperation {
  /** type 的描述 */
    type: insert  update  delete;
  document: any;
  filter: Recordstring, any;
  update: Recordstring, any;
  options: Recordstring, any;
}

export interface IDatabaseStats {
  /** collections 的描述 */
    collections: number;
  /** objects 的描述 */
    objects: number;
  /** avgObjSize 的描述 */
    avgObjSize: number;
  /** dataSize 的描述 */
    dataSize: number;
  /** storageSize 的描述 */
    storageSize: number;
  /** indexes 的描述 */
    indexes: number;
  /** indexSize 的描述 */
    indexSize: number;
  /** fsUsedSize 的描述 */
    fsUsedSize: number;
  /** fsTotalSize 的描述 */
    fsTotalSize: number;
}

export interface ICollectionStats {
  /** ns 的描述 */
    ns: string;
  /** size 的描述 */
    size: number;
  /** count 的描述 */
    count: number;
  /** avgObjSize 的描述 */
    avgObjSize: number;
  /** storageSize 的描述 */
    storageSize: number;
  /** capped 的描述 */
    capped: false | true;
  /** nindexes 的描述 */
    nindexes: number;
  /** totalIndexSize 的描述 */
    totalIndexSize: number;
  /** indexSizes 的描述 */
    indexSizes: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number;
}

export interface IndexStats {
  /** name 的描述 */
    name: string;
  /** size 的描述 */
    size: number;
  /** accesses 的描述 */
    accesses: {
    ops: number;
    since: Date;
  };
  /** ops 的描述 */
    ops: {
    insert: number;
    query: number;
    update: number;
    remove: number;
  };
}

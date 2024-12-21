/**
 * @fileoverview TS 文件 database.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const databaseConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB || 'health_platform',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

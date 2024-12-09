export const databaseConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB || 'health_platform',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
}; 
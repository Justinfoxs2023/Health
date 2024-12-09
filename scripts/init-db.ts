import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { join } from 'path';

async function initializeCollections() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.DB_NAME);
  
  const script = readFileSync(
    join(__dirname, '../../database/mongodb/init/collections.mongo.js'),
    'utf8'
  );
  
  await db.eval(script);
  await client.close();
}

initializeCollections().catch(console.error); 
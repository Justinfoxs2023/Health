import { MongoClient } from 'mongodb';
import { join } from 'path';
import { readFileSync } from 'fs';

async function initializeCollections(): Promise<void> {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.DB_NAME);

    const script = readFileSync(
      join(__dirname, '../../database/mongodb/init/collections.mongo.js'),
      'utf8',
    );

    await db.eval(script);
    await client.close();
  } catch (error) {
    console.error('Error in initializeCollections:', error);
    throw error;
  }
}

initializeCollections().catch(console.error);

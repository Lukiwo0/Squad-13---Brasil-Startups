import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

config() 

const client = new MongoClient(process.env.MONGO_URI)
let db

export async function connectDB() {
  if (!db) {
    await client.connect()
    db = client.db(process.env.DB_NAME)
    console.log('✅ Conectado ao MongoDB')
  }
  return db
}

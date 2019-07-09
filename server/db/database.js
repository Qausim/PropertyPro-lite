import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

const dbConnection = {
  dbConnect(query, data) {
    return pool.connect()
      .then(client => client.query(query, data)
        .finally(() => client.release()));
  },
};

export default dbConnection;

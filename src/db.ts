import {drizzle} from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";
import connectionString from "./db_config.js";
import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
    connectionString: connectionString,
    max: 20, // maximum number of connections in the pool
    idleTimeoutMillis: 30000, // close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // return an error after 2 seconds if a connection cannot be established
});


export const db = drizzle(pool, {schema, logger: true});

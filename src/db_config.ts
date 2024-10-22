import * as dotenv from 'dotenv';
//import * as path from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleDir = path.dirname(path.dirname(__filename));
const envLocation = path.join(moduleDir, '..', '.env');

dotenv.config({path: envLocation});

const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`;

export default connectionString;


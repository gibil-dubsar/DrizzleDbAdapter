import {defineConfig} from "drizzle-kit";
import * as dotenv from 'dotenv';
import connectionString from "./db_config.js";

dotenv.config();
export default defineConfig({
    schema:"./schema.ts",
    out:'./migrations',
    dbCredentials: {
        url: connectionString
    },
    dialect:"postgresql",
    verbose:true,
    strict:true,
})

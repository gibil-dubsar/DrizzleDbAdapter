"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var node_postgres_1 = require("drizzle-orm/node-postgres");
var schema = require("./schema.js");
var db_config_js_1 = require("./db_config.js");
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    connectionString: db_config_js_1.default,
    max: 20, // maximum number of connections in the pool
    idleTimeoutMillis: 30000, // close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // return an error after 2 seconds if a connection cannot be established
});
exports.db = (0, node_postgres_1.drizzle)(pool, { schema: schema, logger: true });

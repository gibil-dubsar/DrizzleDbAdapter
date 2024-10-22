"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var path = require("path");
var envLocation = path.join(__dirname, '..', '.env');
dotenv.config({ path: envLocation });
var connectionString = "postgresql://".concat(process.env.POSTGRES_USER, ":").concat(process.env.POSTGRES_PASSWORD, "@localhost:").concat(process.env.DB_PORT, "/").concat(process.env.POSTGRES_DB);
exports.default = connectionString;

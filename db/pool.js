const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("node:path");
dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

const DATABASE_URL = process.env.DATABASE_PROD;

module.exports = new Pool({ connectionString: DATABASE_URL });

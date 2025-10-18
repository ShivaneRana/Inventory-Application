const {Client} = require("pg");
const dotenv = require("dotenv");
const { argv } = require("node:process");
const path = require("node:path");

dotenv.config({path: path.resolve(__dirname,"../.env"), quiet:true});

let DATABASE_URL;

if (argv[2] === "dev") {
  DATABASE_URL = process.env.DATABASE_DEV;
  console.log("deleted development database");
} else if (argv[2] === "prod") {
  DATABASE_URL = process.env.DATABASE_PROD;
  console.log("deleted production database");
}

const delete_all_table = `
    DROP TABLE authors;
    DROP TABLE genres;
    DROP TABLE inventories;
    DROP TABLE languages;
    DROP TABLE manga_authors;
    DROP TABLE manga_genres;
    DROP TABLE manga_languages;
    DROP TABLE manga_publishers;
    DROP TABLE mangas;
    DROP TABLE publishers;
`;

async function main() {
    const client = new Client({ connectionString: DATABASE_URL });

    try {
        console.log("starting script........");
        await client.connect();
        await client.query(delete_all_table);
        console.log("done...........");
    } catch (err) {
        console.error(err);
    } finally {
        client.end();
    }
}
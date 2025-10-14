#! /usr/bin/env node
const { Client } = require("pg");

const dotenv = require("dotenv");
const { argv } = require("node:process");
const path = require("node:path");
dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

let DATABASE;

let create_table_command = `
    CREATE TABLE IF NOT EXISTS mangas(
       id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
       name varchar(300) NOT NULL,
       rating NUMERIC(3,1) NOT NULL CHECK (rating BETWEEN 0 AND 10),
       description TEXT DEFAULT 'No description added',
       chapter_number INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS publishers(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name varchar(200) NOT NULL UNIQUE,
        country varchar(200) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS manga_publishers (
        manga_id INTEGER NOT NULL,
        publisher_id INTEGER NOT NULL,
        PRIMARY KEY (manga_id,publisher_id),

        FOREIGN KEY (manga_id)
        REFERENCES mangas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

        FOREIGN KEY (publisher_id) REFERENCES publishers(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS authors(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name varchar(200) NOT NULL,
        middle_name varchar(200) NOT NULL DEFAULT '',
        last_name varchar(200) NOT NULL,
        gender varchar(200) NOT NULL CHECK (gender IN ('male','female','other')),
        age INTEGER NOT NULL CHECK (age > 0),
        country_of_origin varchar(200) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS manga_authors (
        manga_id INTEGER NOT NULL,
        author_id INTEGER NOT NULL,
        PRIMARY KEY (manga_id,author_id),

        FOREIGN KEY (manga_id)
        REFERENCES mangas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

        FOREIGN KEY (author_id)
        REFERENCES authors(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inventories(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        price NUMERIC(5,2) NOT NULL CHECK (price > 0),
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        manga_id INTEGER NOT NULL UNIQUE,
        
        FOREIGN KEY (manga_id)
        REFERENCES mangas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS languages(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name varchar(200) NOT NULL UNIQUE DEFAULT 'japanese'
    );

    CREATE TABLE IF NOT EXISTS manga_languages(
        manga_id INTEGER NOT NULL,
        language_id INTEGER NOT NULL,
        PRIMARY KEY (manga_id,language_id),

        FOREIGN KEY (manga_id)
        REFERENCES mangas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

        FOREIGN KEY (language_id)
        REFERENCES languages(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS genres(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name varchar(200) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS manga_genres(
        manga_id INTEGER NOT NULL,
        genre_id INTEGER NOT NULL,
        PRIMARY KEY (manga_id,genre_id),

        FOREIGN KEY (manga_id)
        REFERENCES mangas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

        FOREIGN KEY (genre_id)
        REFERENCES genres(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );
`;

if (argv[2] === "dev") {
  DATABASE = process.env.DATABASE_DEV;
  console.log("populate development database");
} else if (argv[2] === "prod") {
  DATABASE = process.env.DATABASE_PROD;
  console.log("populate production database");
}

async function main() {
  const client = new Client({ connectionString: DATABASE });

  try {
    console.log("starting script........");
    await client.connect();
    await client.query(create_table_command);
    console.log("done...........");
  } catch (err) {
    console.error(err);
  } finally {
    client.end();
  }
}

main();
module.exports = main;

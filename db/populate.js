#! /usr/bin/env node
const { Client } = require("pg");

const dotenv = require("dotenv");
const { argv } = require("node:process");
const path = require("node:path");
dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

let DATABASE_URL;

let create_table = `
    CREATE TABLE IF NOT EXISTS mangas(
       id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
       name varchar(300) NOT NULL,
       rating NUMERIC(3,1) NOT NULL CHECK (rating BETWEEN 0 AND 10),
       description TEXT DEFAULT 'No description',
       chapter_number INTEGER NOT NULL DEFAULT 0,
       volume_number INTEGER NOT NULL DEFAULT 1,
       status VARCHAR(50) NOT NULL DEFAULT 'Unknown',
       manga_image_url text DEFAULT '/default-cover.svg'
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
        quantity INTEGER NOT NULL CHECK (quantity >= 0),
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

//this data was generated via ai because it will pain to do it manually.

let insert_data = `
    -- Insert publishers
    INSERT INTO publishers (name, country)
    VALUES
        ('Shueisha', 'Japan'),
        ('Kodansha', 'Japan'),
        ('VIZ Media', 'United States'),
        ('Square Enix', 'Japan'),
        ('Shogakukan', 'Japan')
    ON CONFLICT DO NOTHING;

    -- Insert authors
    INSERT INTO authors (first_name, middle_name, last_name, gender, age, country_of_origin)
    VALUES
        ('Eiichiro', '', 'Oda', 'male', 49, 'Japan'),
        ('Hajime', '', 'Isayama', 'male', 38, 'Japan'),
        ('Koyoharu', '', 'Gotouge', 'female', 35, 'Japan'),
        ('Hiromu', '', 'Arakawa', 'female', 52, 'Japan'),
        ('Akira', '', 'Toriyama', 'male', 68, 'Japan')
    ON CONFLICT DO NOTHING;

    -- Insert languages
    INSERT INTO languages (name)
    VALUES
        ('Japanese'),
        ('English'),
        ('Spanish'),
        ('French')
    ON CONFLICT DO NOTHING;

    -- Insert genres
    INSERT INTO genres (name)
    VALUES
        ('Action'),
        ('Adventure'),
        ('Fantasy'),
        ('Shonen'),
        ('Drama'),
        ('Comedy'),
        ('Horror')
    ON CONFLICT DO NOTHING;

    -- Insert mangas
    INSERT INTO mangas (name, rating, description, chapter_number,volume_number,status,manga_image_url)
    VALUES
        ('One Piece', 9.5, 'A young pirate, Monkey D. Luffy, sets out to become the Pirate King.', 1110,105,'Ongoing','https://comicvine.gamespot.com/a/uploads/scale_large/11158/111586527/9779847-0520978124-97840.jpg'),
        ('Attack on Titan', 9.4, 'Humanity fights for survival against giant humanoid Titans.', 139,34,'Completed','https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/3506326-01.jpg'),
        ('Demon Slayer: Kimetsu no Yaiba', 9.2, 'Tanjiro Kamado becomes a demon slayer to avenge his family.', 205, 23, 'Completed','https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/7696708-23.jpg'),
        ('Fullmetal Alchemist', 9.3, 'Two brothers use alchemy to restore what they lost.', 116, 27, 'Completed','https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/3023786-27.jpg'),
        ('Dragon Ball', 9.0, 'The adventures of Goku as he searches for the Dragon Balls.', 519, 42, 'Completed','https://comicvine.gamespot.com/a/uploads/scale_large/0/4/45048-7104-52108-1-dragon-ball.jpg')
    ON CONFLICT DO NOTHING;

    -- Link mangas to publishers
    INSERT INTO manga_publishers (manga_id, publisher_id)
    VALUES
        (1, 1), -- One Piece → Shueisha
        (2, 2), -- Attack on Titan → Kodansha
        (3, 1), -- Demon Slayer → Shueisha
        (4, 4), -- Fullmetal Alchemist → Square Enix
        (5, 5)  -- Dragon Ball → Shogakukan
    ON CONFLICT DO NOTHING;

    -- Link mangas to authors
    INSERT INTO manga_authors (manga_id, author_id)
    VALUES
        (1, 1), -- Oda → One Piece
        (2, 2), -- Isayama → Attack on Titan
        (3, 3), -- Gotouge → Demon Slayer
        (4, 4), -- Arakawa → Fullmetal Alchemist
        (5, 5)  -- Toriyama → Dragon Ball
    ON CONFLICT DO NOTHING;

    -- Link mangas to genres
    INSERT INTO manga_genres (manga_id, genre_id)
    VALUES
        (1, 1), (1, 2), (1, 4),       -- One Piece: Action, Adventure, Shonen
        (2, 1), (2, 5), (2, 7),       -- Attack on Titan: Action, Drama, Horror
        (3, 1), (3, 3), (3, 4),       -- Demon Slayer: Action, Fantasy, Shonen
        (4, 3), (4, 5), (4, 4),       -- Fullmetal Alchemist: Fantasy, Drama, Shonen
        (5, 1), (5, 2), (5, 4)        -- Dragon Ball: Action, Adventure, Shonen
    ON CONFLICT DO NOTHING;

    -- Link mangas to languages
    INSERT INTO manga_languages (manga_id, language_id)
    VALUES
        (1, 1), (1, 2),
        (2, 1), (2, 2), (2, 3),
        (3, 1), (3, 2),
        (4, 1), (4, 2),
        (5, 1), (5, 2), (5, 4)
    ON CONFLICT DO NOTHING;

    -- Insert inventories
    INSERT INTO inventories (price, quantity, manga_id)
    VALUES
        (9.99, 500, 1),
        (8.49, 300, 2),
        (10.99, 400, 3),
        (7.99, 250, 4),
        (6.49, 600, 5)
    ON CONFLICT DO NOTHING;
`;

if (argv[2] === "dev") {
    DATABASE_URL = process.env.DATABASE_DEV;
    console.log("populated development database");
} else if (argv[2] === "prod") {
    DATABASE_URL = process.env.DATABASE_PROD;
    console.log("populated production database");
}

async function main() {
    const client = new Client({ connectionString: DATABASE_URL });

    try {
        console.log("starting script........");
        await client.connect();
        await client.query(create_table);
        await client.query(insert_data);
        console.log("done...........");
    } catch (err) {
        console.error(err);
    } finally {
        client.end();
    }
}

main();
module.exports = main;

const pool = require("./pool.js");

// return all mangas and also inventories
exports.getAllMangas = async () => {
    const { rows } = await pool.query(
        `
SELECT
    m.manga_id,
    m.manga_name,
    m.manga_chapter_number,
    m.manga_volume_number,
    m.manga_status,
    m.manga_rating,
    m.manga_image_url,
    m.manga_description,
    i.inventory_id,
    i.inventory_price,
    i.inventory_quantity,
    STRING_AGG(DISTINCT g.genre_name, ', ' ORDER BY g.genre_name) AS genre_name,
    STRING_AGG(DISTINCT p.publisher_name, ', ' ORDER BY p.publisher_name) AS publisher_name,
    STRING_AGG(DISTINCT l.language_name, ', ' ORDER BY l.language_name) AS language_name,
    STRING_AGG(DISTINCT a.author_fullname, ', ' ORDER BY a.author_fullname) AS author_fullname
FROM mangas m
LEFT JOIN inventories i ON m.manga_id = i.manga_id
LEFT JOIN manga_publishers mp ON m.manga_id = mp.manga_id
LEFT JOIN publishers p ON mp.publisher_id = p.publisher_id
LEFT JOIN manga_genres mg ON m.manga_id = mg.manga_id
LEFT JOIN genres g ON mg.genre_id = g.genre_id
LEFT JOIN manga_languages ml ON m.manga_id = ml.manga_id
LEFT JOIN languages l ON ml.language_id = l.language_id
LEFT JOIN manga_authors ma ON m.manga_id = ma.manga_id
LEFT JOIN authors a ON ma.author_id = a.author_id
GROUP BY 
    m.manga_id,
    m.manga_name,
    m.manga_chapter_number,
    m.manga_volume_number,
    m.manga_status,
    m.manga_rating,
    m.manga_image_url,
    i.inventory_id,
    i.inventory_price,
    i.inventory_quantity
ORDER BY m.manga_name;
        `
    );
    return rows;
};

exports.getAllLanguages = async () => {
    const { rows } = await pool.query(
        "SELECT * FROM languages ORDER BY language_name"
    );
    return rows;
};

exports.getAllPublishers = async () => {
    const { rows } = await pool.query(
        "SELECT * FROM publishers ORDER BY publisher_name"
    );
    return rows;
};

exports.getAllAuthors = async () => {
    const { rows } = await pool.query(
        "SELECT * FROM authors ORDER BY author_fullname"
    );
    return rows;
};

exports.getAllGenres = async () => {
    const { rows } = await pool.query(
        "SELECT * FROM genres ORDER BY genre_name"
    );
    return rows;
};

exports.addGenre = async (genre_name) => {
    await pool.query("INSERT INTO genres (genre_name) VALUES ($1)", [
        genre_name,
    ]);
};

exports.deleteGenre = async (genre_id) => {
    await pool.query("DELETE FROM genres WHERE genre_id = $1", [genre_id]);
};

exports.updateGenre = async (id, value) => {
    await pool.query("UPDATE genres SET genre_name = $1 WHERE genre_id = $2", [
        value,
        id,
    ]);
};

exports.addLanguage = async (language_name) => {
    await pool.query("INSERT INTO languages (language_name) VALUES ($1)", [
        language_name,
    ]);
};

exports.deleteLanguage = async (id) => {
    await pool.query("DELETE FROM languages WHERE language_id = $1", [id]);
};

exports.updateLanguages = async (id, value) => {
    await pool.query(
        "UPDATE languages SET language_name = $1 WHERE language_id = $2",
        [value, id]
    );
};

exports.addPublisher = async (publisher_name, publisher_country) => {
    await pool.query(
        "INSERT INTO publishers (publisher_name,publisher_country) VALUES ($1,$2)",
        [publisher_name, publisher_country]
    );
};

exports.deletePublisher = async (id) => {
    await pool.query("DELETE FROM publishers WHERE publisher_id = $1", [id]);
};

exports.updatePublisher = async (id, name, country) => {
    await pool.query(
        "UPDATE publishers SET publisher_name = $1,publisher_country = $2 WHERE publisher_id = $3",
        [name, country, id]
    );
};

exports.addAuthor = async (
    author_fullname,
    author_gender,
    author_age,
    author_country_of_origin
) => {
    await pool.query(
        "INSERT INTO authors (author_fullname,author_gender,author_age,author_country_of_origin) VALUES ($1,$2,$3,$4)",
        [author_fullname, author_gender, author_age, author_country_of_origin]
    );
};

exports.deleteAuthor = async (id) => {
    await pool.query("DELETE FROM authors WHERE author_id = $1", [id]);
};

exports.updateAuthor = async (id, fullname, gender, age, country) => {
    await pool.query(
        "UPDATE authors SET author_fullname = $1,author_gender = $2,author_age = $3,author_country_of_origin = $4 WHERE author_id = $5",
        [fullname, gender, age, country, id]
    );
};

exports.deleteManga = async (id) => {
    await pool.query("DELETE FROM mangas WHERE mangas.manga_id = $1", [id]);
};

exports.addManga = async (
    manga_name,
    manga_rating,
    manga_description,
    manga_chapter_number,
    manga_volume_number,
    manga_status,
    manga_image_url,
    manga_price,
    manga_quantity,
    manga_author,
    manga_publisher,
    manga_genre,
    manga_language
) => {
    const { rows } = await pool.query(
        "INSERT INTO mangas (manga_name,manga_rating,manga_description,manga_chapter_number,manga_volume_number,manga_status,manga_image_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING manga_id",
        [
            manga_name,
            manga_rating,
            manga_description,
            manga_chapter_number,
            manga_volume_number,
            manga_status,
            manga_image_url,
        ]
    );

    const manga_id = rows[0].manga_id;
    await exports.addManga_authors(manga_id, manga_author);
    await exports.addManga_genres(manga_id, manga_genre);
    await exports.addManga_languages(manga_id, manga_language);
    await exports.addManga_publishers(manga_id, manga_publisher);
    await exports.addInventory(manga_price, manga_quantity, manga_id);
};

exports.updateManga = async (
    manga_id,
    manga_name,
    manga_rating,
    manga_description,
    manga_chapter_number,
    manga_volume_number,
    manga_status,
    manga_image_url,
    manga_price,
    manga_quantity,
    manga_author,
    manga_publisher,
    manga_genre,
    manga_language,
) => {
        await pool.query(
        `UPDATE  mangas SET manga_name = $1,
            manga_rating = $2,
            manga_description = $3,
            manga_chapter_number = $4,
            manga_volume_number = $5,
            manga_status = $6,
            manga_image_url = $7

            WHERE mangas.manga_id = $8;
        ` ,
        [
            manga_name,
            manga_rating,
            manga_description,
            manga_chapter_number,
            manga_volume_number,
            manga_status,
            manga_image_url,
            manga_id
        ]
    );

    // console.log(manga_author);
    // console.log(manga_genre);
    // console.log(manga_publisher);
    // console.log(manga_language);

    await exports.UpdateManga_authors(manga_id, manga_author);
    await exports.UpdateManga_genres(manga_id, manga_genre);
    await exports.UpdateManga_languages(manga_id, manga_language);
    await exports.UpdateManga_publishers(manga_id, manga_publisher);
    await exports.updateInventory(manga_price, manga_quantity, manga_id);
}

// helper function used to insert value into inventories for respective manga
exports.addInventory = async (
    inventory_price,
    inventory_quantity,
    manga_id
) => {
    await pool.query(
        "INSERT INTO inventories (inventory_price,inventory_quantity,manga_id) VALUES ($1,$2,$3)",
        [inventory_price, inventory_quantity, manga_id]
    );
};

exports.updateInventory = async (
    inventory_price,
    inventory_quantity,
    manga_id,
) => {
    await pool.query(
        "UPDATE inventories SET inventory_price = $1, inventory_quantity = $2 WHERE inventories.manga_id = $3;",
        [inventory_price, inventory_quantity, manga_id]
    );
};

exports.addManga_authors = async (manga_id, author_array) => {
    const rows = await this.getAllAuthors();

    if (typeof author_array === "string") {
        author_array = [author_array];
    }

    const authorSet = new Set(author_array);
    const promises = rows
        .filter((item) => authorSet.has(item.author_fullname))
        .map(async (item) => {
            await pool.query(
                "INSERT INTO manga_authors (manga_id,author_id) VALUES ($1,$2)",
                [manga_id, item.author_id]
            );
        });
    await Promise.all(promises);
};

exports.UpdateManga_authors = async (manga_id, author_array) => {
    const {rows} = await pool.query("SELECT * FROM manga_authors WHERE manga_id = $1",[manga_id]);
    
    if(rows.length === 0){
        await exports.addManga_authors(manga_id,author_array);
    }else{

        await pool.query(
            "DELETE FROM manga_authors WHERE manga_id= $1",
            [manga_id]
        );
        await exports.addManga_authors(manga_id,author_array);
    }
};

exports.addManga_genres = async (manga_id, genre_array) => {
    const rows = await this.getAllGenres();

    if (typeof genre_array === "string") {
        author_array = [genre_array];
    }

    const genreSet = new Set(genre_array);
    const promises = rows
        .filter((item) => genreSet.has(item.genre_name))
        .map(async (item) => {
            await pool.query(
                "INSERT INTO manga_genres (manga_id,genre_id) VALUES ($1,$2)",
                [manga_id, item.genre_id]
            );
        });

    await Promise.all(promises);
};

exports.UpdateManga_genres = async (manga_id, genre_array) => {
    const {rows} = await pool.query("SELECT * FROM manga_genres WHERE manga_id = $1",[manga_id]);
    
    if(rows.length === 0){
        await exports.addManga_genres(manga_id,genre_array);
    }else{

        await pool.query(
            "DELETE FROM manga_genres WHERE manga_id= $1",
            [manga_id]
        );

        await exports.addManga_genres(manga_id,genre_array);
    }
};

exports.addManga_languages = async (manga_id, language_array) => {
    const rows = await this.getAllLanguages();

    if (typeof language_array === "string") {
        language_array = [language_array];
    }

    const languageSet = new Set(language_array);
    const promises = rows
        .filter((item) => languageSet.has(item.language_name))
        .map(async (item) => {
            await pool.query(
                "INSERT INTO manga_languages (manga_id,language_id) VALUES ($1,$2)",
                [manga_id, item.language_id]
            );
        });

    await Promise.all(promises);
};

exports.UpdateManga_languages = async (manga_id, genre_array) => {
    const {rows} = await pool.query("SELECT * FROM manga_languages WHERE manga_id = $1",[manga_id]);
    
    if(rows.length === 0){
        await exports.addManga_languages(manga_id,genre_array);
    }else{

        await pool.query(
            "DELETE FROM manga_languages WHERE manga_id= $1",
            [manga_id]
        );

        await exports.addManga_languages(manga_id,genre_array);
    }
};

exports.addManga_publishers = async (manga_id, publisher_array) => {
    const rows = await this.getAllPublishers();

    if (typeof publisher_array === "string") {
        publisher_array = [publisher_array];
    }

    const publisherSet = new Set(publisher_array);
    const promises = rows
        .filter((item) => publisherSet.has(item.publisher_name))
        .map(async (item) => {
            await pool.query(
                "INSERT INTO manga_publishers (manga_id,publisher_id) VALUES ($1,$2)",
                [manga_id, item.publisher_id]
            );
        });

    await Promise.all(promises);
};

exports.UpdateManga_publishers = async (manga_id, genre_array) => {
    const {rows} = await pool.query("SELECT * FROM manga_publishers WHERE manga_id = $1",[manga_id]);
    
    if(rows.length === 0){
        await exports.addManga_publishers(manga_id,genre_array);
    }else{

        await pool.query(
            "DELETE FROM manga_publishers WHERE manga_id= $1",
            [manga_id]
        );

        await exports.addManga_publishers(manga_id,genre_array);
    }
};
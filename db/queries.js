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

exports.addLanguage = async (language_name) => {
    await pool.query("INSERT INTO languages (language_name) VALUES ($1)", [
        language_name,
    ]);
};

exports.deleteLanguage = async (id) => {
    await pool.query("DELETE FROM languages WHERE language_id = $1", [id]);
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
    manga_quantity
) => {
    await pool.query(
        "INSERT INTO mangas (manga_name,manga_rating,manga_description,manga_chapter_number,manga_volume_number,manga_status,manga_image_url) VALUES ($1,$2,$3,$4,$5,$6,$7)",
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

    const { rows } = await pool.query(
        "SELECT manga_id FROM mangas WHERE manga_name = $1",
        [manga_name]
    );
    const manga_id = rows[0].manga_id;
    await this.addInventory(manga_price, manga_quantity, manga_id);
};

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

exports.updateLanguages = async (id, value) => {
    await pool.query(
        "UPDATE languages SET language_name = $1 WHERE language_id = $2",
        [value, id]
    );
};

exports.updateGenre = async (id, value) => {
    await pool.query("UPDATE genres SET genre_name = $1 WHERE genre_id = $2", [
        value,
        id,
    ]);
};

exports.updatePublisher = async (id, name, country) => {
    await pool.query(
        "UPDATE publishers SET publisher_name = $1,publisher_country = $2 WHERE publisher_id = $3",
        [name, country, id]
    );
};

exports.updateAuthor = async (id, fullname, gender, age, country) => {
    await pool.query(
        "UPDATE authors SET author_fullname = $1,author_gender = $2,author_age = $3,author_country_of_origin = $4 WHERE author_id = $5",
        [fullname, gender, age, country, id]
    );
};

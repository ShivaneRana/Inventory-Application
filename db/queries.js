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
    i.inventory_price,
    i.inventory_quantity,
    STRING_AGG(DISTINCT g.genre_name, ', ' ORDER BY g.genre_name) AS genre_name,
    STRING_AGG(DISTINCT p.publisher_name, ', ' ORDER BY p.publisher_name) AS publisher_name,
    STRING_AGG(DISTINCT l.language_name, ', ' ORDER BY l.language_name) AS language_name,
    STRING_AGG(DISTINCT a.author_fullname, ', ' ORDER BY a.author_fullname) AS author_fullname
FROM mangas m
JOIN inventories i ON m.manga_id = i.manga_id
JOIN manga_publishers mp ON m.manga_id = mp.manga_id
JOIN publishers p ON mp.publisher_id = p.publisher_id
JOIN manga_genres mg ON m.manga_id = mg.manga_id
JOIN genres g ON mg.genre_id = g.genre_id
JOIN manga_languages ml ON m.manga_id = ml.manga_id
JOIN languages l ON ml.language_id = l.language_id
JOIN manga_authors ma ON m.manga_id = ma.manga_id
JOIN authors a ON ma.author_id = a.author_id
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

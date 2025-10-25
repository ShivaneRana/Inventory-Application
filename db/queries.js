const pool = require("./pool.js");

// return all mangas and also inventories
exports.getAllMangas = async () => {
    const { rows } = await pool.query(
        "SELECT * FROM mangas as m JOIN inventories as i ON m.manga_id = i.inventory_id ORDER BY m.manga_name"
    );
    return rows;
};

exports.getAllLanguages = async () => {
    const { rows } = await pool.query("SELECT * FROM languages ORDER BY language_name");
    return rows;
};

exports.getAllPublishers = async () => {
    const { rows } = await pool.query("SELECT * FROM publishers ORDER BY publisher_name");
    return rows;
};

exports.getAllAuthors = async () => {
    const { rows } = await pool.query(
        "SELECT * FROM authors ORDER BY author_first_name"
    );
    return rows;
};

exports.getAllGenres = async () => {
    const { rows } = await pool.query("SELECT * FROM genres ORDER BY genre_name");
    return rows;
};

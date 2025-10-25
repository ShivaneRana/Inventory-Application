const pool = require("./pool.js");

// return all mangas and also inventories
exports.getAllMangas = async () => {
    const { rows } = await pool.query("SELECT * FROM mangas as m JOIN inventories as i ON m.id = i.id ORDER BY m.name");
    return rows;
};

exports.getAllLanguages = async () => {
    const { rows } = await pool.query("SELECT * FROM languages ORDER BY name");
    return rows;
};

exports.getAllPublishers = async () => {
    const { rows } = await pool.query("SELECT * FROM publishers ORDER BY name");
    return rows;
};

exports.getAllAuthors = async () => {
    const { rows } = await pool.query("SELECT * FROM authors ORDER BY first_name");
    return rows;
};

exports.getAllGenres = async () => {
    const { rows } = await pool.query("SELECT * FROM genres ORDER BY name");
    return rows;
};

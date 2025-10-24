const pool = require("./pool.js");

exports.getAllMangas = async () => {
    const { rows } = await pool.query("SELECT * FROM mangas");
    return rows;
};

exports.getAllLanguages = async () => {
    const { rows } = await pool.query("SELECT * FROM languages");
    return rows;
};

exports.getAllPublishers = async () => {
    const { rows } = await pool.query("SELECT * FROM publishers");
    return rows;
};

exports.getAllAuthors = async () => {
    const { rows } = await pool.query("SELECT * FROM authors");
    return rows;
};

exports.getAllGenres = async () => {
    const { rows } = await pool.query("SELECT * FROM genres");
    return rows;
};

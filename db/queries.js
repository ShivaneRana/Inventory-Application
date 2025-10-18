const pool = require("pool.js");

exports.getAllMangas = async () => {
   const {rows} = await pool.query("SELECT * FROM mangas");
   return rows;
}
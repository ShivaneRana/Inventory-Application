const { body, param, validationResult } = require("express-validator");
const db = require("../db/queries.js");

exports.getMangasList = async (req, res) => {
    const rows = await db.getAllMangas();
    return res.status(200).render("mangas", { rows: rows, flag: false });
};

exports.getAddManga = async (req, res) => {
    const rows = await db.getAllMangas();
    return res.status(200).render("mangas", { rows: rows, flag: true });
};

exports.postAddManga = async (req, res) => {
    const {
        manga_name,
        manga_image_url,
        manga_rating,
        manga_price,
        manga_quantity,
        manga_status,
        manga_description,
        manga_chapter_number,
        manga_volume_number,
    } = req.body;

    await db.addManga(
        manga_name,
        manga_rating,
        manga_description,
        manga_chapter_number,
        manga_volume_number,
        manga_status,
        manga_image_url,
        manga_price,
        manga_quantity
    );





    return res.status(200).redirect("/mangas");
};

exports.postDeleteManga = async (req, res) => {
    const { id } = req.params;
    await db.deleteManga(id);
    return res.status(200).redirect("/mangas");
};

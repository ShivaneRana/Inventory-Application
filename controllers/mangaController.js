const {
    body,
    param,
    validationResult,
    matchedData,
} = require("express-validator");
const db = require("../db/queries.js");

const validationObject = [
    body("manga_name").trim().notEmpty().withMessage("Name cannot be empty"),
    body("manga_rating")
        .trim()
        .isFloat({ min: 0, max: 10 })
        .withMessage(
            "Rating can only contain numerical or floating value between 0.1 or 10"
        ),
    body("manga_price")
        .trim()
        .isFloat({ min: 0.1 })
        .withMessage("Price can only contain numerical or floating value."),
    body("manga_chapter_number")
        .trim()
        .isInt({ min: 1 })
        .withMessage("Chapter number can only contain numerical value"),
    body("manga_volume_number")
        .trim()
        .isInt({ min: 1 })
        .withMessage("Volume number can only contain numerical value"),
    body("manga_quantity")
        .trim()
        .isInt({ min: 1 })
        .withMessage("Quantity can only contain numerical value"),
];

exports.getMangasList = async (req, res) => {
    const rows = await db.getAllMangas();
    return res.status(200).render("mangas", { rows: rows, flag: false });
};

exports.getAddManga = async (req, res) => {
    const rows = await db.getAllMangas();
    return res.status(200).render("mangas", { rows: rows, flag: true });
};

exports.postAddManga = [
    validationObject,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const rows = await db.getAllMangas();
            return res
                .status(400)
                .render("mangas", {
                    rows: rows,
                    flag: true,
                    errors: errors.array(),
                });
        }

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
    },
];

exports.postDeleteManga = async (req, res) => {
    const { id } = req.params;
    await db.deleteManga(id);
    return res.status(200).redirect("/mangas");
};

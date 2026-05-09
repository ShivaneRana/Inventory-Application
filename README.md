# Manga Inventory

A full-stack inventory management app for manga. Add, update, and delete manga entries along with their authors, genres, publishers, and languages — all backed by a relational PostgreSQL database.

---

## Screenshots

![screenshot](screenshots/1.png)

![screenshot](screenshots/2.png)

![screenshot](screenshots/3.png)

---

## Features

- Full CRUD for manga entries, authors, genres, publishers, and languages
- Each manga tracks name, rating, description, chapter count, volume count, status, cover image URL, price, and stock quantity
- Many-to-many relationships between manga and authors, genres, publishers, and languages
- Server-side form validation with inline error messages
- Inventory table linked to each manga (price and quantity)
- Default cover image fallback when no URL is provided
- Separate populate and delete scripts for dev and production databases

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Templating | EJS |
| Database | PostgreSQL (via `pg` pool) |
| Validation | express-validator |
| Environment | dotenv |
| Formatting | Prettier |

---

## Project Structure

```
.
├── app.js                      # Entry point, middleware and route setup
├── routers/
│   ├── indexRouter.js
│   ├── mangaRouter.js
│   ├── authorRouter.js
│   ├── genreRouter.js
│   ├── publisherRouter.js
│   └── languageRouter.js
├── controllers/
│   ├── indexController.js
│   ├── mangaController.js      # Full CRUD + validation
│   ├── authorController.js
│   ├── genreController.js
│   ├── publisherController.js
│   └── languageController.js
├── db/
│   ├── pool.js                 # PostgreSQL connection pool
│   ├── queries.js              # All database query functions
│   ├── populate.js             # Create tables and seed data
│   └── delete.js               # Drop tables
├── views/
│   ├── partials/
│   │   ├── navbar.ejs
│   │   ├── errors.ejs
│   │   ├── mangaForm.ejs
│   │   ├── authorForm.ejs
│   │   ├── genreForm.ejs
│   │   ├── publisherForm.ejs
│   │   └── languageForm.ejs
│   ├── index.ejs
│   ├── mangas.ejs
│   ├── authors.ejs
│   ├── genres.ejs
│   ├── publishers.ejs
│   ├── languages.ejs
│   └── 404.ejs
└── public/
    ├── css/
    ├── jss/
    ├── default-cover.svg
    └── favicon.svg
```

---

## Database Schema

### `mangas`
| Column | Type | Notes |
|---|---|---|
| manga_id | INTEGER | Primary key, auto-generated |
| manga_name | VARCHAR(300) | Unique, required |
| manga_rating | NUMERIC(3,1) | 0–10, required |
| manga_description | TEXT | Defaults to 'No description' |
| manga_chapter_number | INTEGER | Defaults to 0 |
| manga_volume_number | INTEGER | Defaults to 1 |
| manga_status | VARCHAR(50) | Defaults to 'Unknown' |
| manga_image_url | TEXT | Defaults to `/default-cover.svg` |

### `authors`
| Column | Type | Notes |
|---|---|---|
| author_id | INTEGER | Primary key |
| author_fullname | VARCHAR(200) | Unique |
| author_gender | VARCHAR(200) | Male / Female / Other |
| author_age | INTEGER | Must be > 0 |
| author_country_of_origin | VARCHAR(200) | Required |

### `publishers`
| Column | Type | Notes |
|---|---|---|
| publisher_id | INTEGER | Primary key |
| publisher_name | VARCHAR(200) | Unique |
| publisher_country | VARCHAR(200) | Required |

### `genres` / `languages`
Simple lookup tables with an `id` and `name` column each.

### `inventories`
| Column | Type | Notes |
|---|---|---|
| inventory_id | INTEGER | Primary key |
| inventory_price | NUMERIC(5,2) | Must be > 0 |
| inventory_quantity | INTEGER | Must be >= 0 |
| manga_id | INTEGER | Foreign key, unique (one inventory per manga) |

### Junction Tables
`manga_authors`, `manga_genres`, `manga_languages`, `manga_publishers` — all use composite primary keys and cascade on delete/update.

---

## Routes

| Method | Path | Description |
|---|---|---|
| GET | `/` | Dashboard / home |
| GET | `/mangas` | List all manga |
| GET | `/mangas/add` | Add manga form |
| POST | `/mangas/add` | Submit new manga |
| GET | `/mangas/update/:id` | Edit manga form |
| POST | `/mangas/update/:id` | Submit manga update |
| POST | `/mangas/delete/:id` | Delete manga |

The same GET/POST pattern applies to `/authors`, `/genres`, `/publishers`, and `/languages`.

---

## Getting Started

### Prerequisites

- Node.js
- A PostgreSQL database (local or hosted, e.g. Neon)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ShivaneRana/Inventory-Application.git
   cd Inventory-Application
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   DATABASE_URL_DEV=postgres://user:password@localhost:5432/your_db
   DATABASE_URL_PROD=your_production_connection_string
   PORT=5000
   ```

4. Set up the database:

   ```bash
   npm run populate_dev    # development
   npm run populate_prod   # production
   ```

5. Start the server:

   ```bash
   npm run dev       # development (watch mode)
   npm start         # production
   ```

   The app runs on `http://localhost:5000`.

### Other Commands

```bash
npm run delete_dev    # Drop all tables (dev)
npm run delete_prod   # Drop all tables (prod)
npm run lint          # Run ESLint
npm run pwrite        # Format all files with Prettier
```

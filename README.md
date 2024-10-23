# Drizzle based DB adapter

## Structure
This codebase provides a database adapter for interacting with a PostgreSQL database. It uses the following key components:

- `schema.ts`: Defines the database schema using Drizzle ORM. It includes tables for Author, Publisher, Genre, Tag, Novel, Chapter, and join tables for many-to-many relationships between Novel and Genre, and Novel and Tag.
- `db.ts`: Establishes a connection pool to the PostgreSQL database using the pg library and initializes a Drizzle ORM instance with the defined schema.
- `db_config.ts`: Reads database connection parameters from a `.env` file and exports the constructed connection string.
- `drizzle.config.ts`: Configuration file for Drizzle ORM, specifying the schema location, migration output directory, and database credentials.
- `index.ts`: Contains the main database adapter logic, including functions for inserting, updating, and retrieving data from the database.


## Use
The index.ts file exports the following functions:

- `getOrInsertNovel`: Inserts a new novel or retrieves an existing one based on its slug.
- `getNovelBySlug`: Retrieves a novel and its related information (author, publisher, genres, tags) by its slug.
- `insertChapter`: Inserts a new chapter for a novel.
- `getChapter`: Retrieves a chapter for a novel by its issue number.
- `getChapterCount`: Returns the total number of chapters for a novel.
- `deleteAllData`: Deletes all data from all tables.
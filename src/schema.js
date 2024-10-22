"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRelations = exports.GenreRelations = exports.PublisherRelations = exports.AuthorRelations = exports.ChapterRelations = exports.NovelRelations = exports.NovelTagTable = exports.NovelGenreTable = exports.ChapterTable = exports.NovelTable = exports.TagTable = exports.GenreTable = exports.PublisherTable = exports.AuthorTable = void 0;
exports.generateShortId = generateShortId;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_orm_1 = require("drizzle-orm");
var crypto_1 = require("crypto");
// Custom function for generating short IDs
function generateShortId() {
    return crypto_1.default.randomBytes(9).toString('base64').replace(/\W/g, '').substring(0, 12);
}
// Table: Authors
exports.AuthorTable = (0, pg_core_1.pgTable)("Author", {
    id: (0, pg_core_1.varchar)("id", { length: 12 }).$default(function () { return generateShortId(); }).primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
}, function (table) {
    return {
        uniqueAuthor: (0, pg_core_1.uniqueIndex)("uniqueAuthor").on(table.name),
    };
});
// Table: Publishers
exports.PublisherTable = (0, pg_core_1.pgTable)("Publisher", {
    id: (0, pg_core_1.varchar)("id", { length: 12 }).$default(function () { return generateShortId(); }).primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
}, function (table) {
    return {
        uniquePublisher: (0, pg_core_1.uniqueIndex)("uniquePublisher").on(table.name),
    };
});
// Table: Genres
exports.GenreTable = (0, pg_core_1.pgTable)("Genre", {
    id: (0, pg_core_1.varchar)("id", { length: 12 }).$default(function () { return generateShortId(); }).primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
}, function (table) {
    return {
        uniqueGenre: (0, pg_core_1.uniqueIndex)("uniqueGenre").on(table.name),
    };
});
// Table: Tags
exports.TagTable = (0, pg_core_1.pgTable)("Tag", {
    id: (0, pg_core_1.varchar)("id", { length: 12 }).$default(function () { return generateShortId(); }).primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
}, function (table) {
    return {
        uniqueTag: (0, pg_core_1.uniqueIndex)("uniqueTag").on(table.name),
    };
});
// Table: Novels
exports.NovelTable = (0, pg_core_1.pgTable)("Novel", {
    id: (0, pg_core_1.varchar)("id", { length: 12 }).$default(function () { return generateShortId(); }).primaryKey(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    novel_slug: (0, pg_core_1.varchar)("novel_slug", { length: 255 }).notNull(),
    rating: (0, pg_core_1.real)("rating").default(0),
    ratingCount: (0, pg_core_1.integer)("ratingCount").default(0),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull(),
    yearOfPublication: (0, pg_core_1.varchar)("yearOfPublication", { length: 4 }).default(""),
    description: (0, pg_core_1.text)("description").default(""),
    imageUrl: (0, pg_core_1.varchar)("imageUrl", { length: 255 }),
    authorId: (0, pg_core_1.varchar)("authorId", { length: 12 }).references(function () { return exports.AuthorTable.id; }).notNull(),
    publisherId: (0, pg_core_1.varchar)("publisherId", { length: 12 }).references(function () { return exports.PublisherTable.id; }),
}, function (table) {
    return {
        uniqueNovel: (0, pg_core_1.uniqueIndex)("uniqueNovel").on(table.novel_slug),
    };
});
// Table: Chapters
exports.ChapterTable = (0, pg_core_1.pgTable)("Chapter", {
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 50 }).notNull(),
    issue: (0, pg_core_1.numeric)("issue", { precision: 6, scale: 1 }).notNull(),
    location: (0, pg_core_1.varchar)("location", { length: 255 }).notNull(),
    novelId: (0, pg_core_1.varchar)("novelId", { length: 12 }).references(function () { return exports.NovelTable.id; }).notNull(),
}, function (table) {
    return {
        //pk: primaryKey("novel_genre_pk").on(table.novelId, table.genreId),
        pk: (0, pg_core_1.primaryKey)({ name: 'novel_issue_chapter_pk', columns: [table.novelId, table.issue] })
    };
});
// Join Table: Novel Genres
exports.NovelGenreTable = (0, pg_core_1.pgTable)("NovelGenre", {
    novelId: (0, pg_core_1.varchar)("novelId", { length: 12 }).references(function () { return exports.NovelTable.id; }).notNull(),
    genreId: (0, pg_core_1.varchar)("genreId", { length: 12 }).references(function () { return exports.GenreTable.id; }).notNull(),
}, function (table) {
    return {
        //pk: primaryKey("novel_genre_pk").on(table.novelId, table.genreId),
        pk: (0, pg_core_1.primaryKey)({ name: 'novel_genre_pk', columns: [table.novelId, table.genreId] })
    };
});
// Join Table: Novel Tags
exports.NovelTagTable = (0, pg_core_1.pgTable)("NovelTag", {
    novelId: (0, pg_core_1.varchar)("novelId", { length: 12 }).references(function () { return exports.NovelTable.id; }).notNull(),
    tagId: (0, pg_core_1.varchar)("tagId", { length: 12 }).references(function () { return exports.TagTable.id; }).notNull(),
}, function (table) {
    return {
        //pk: primaryKey("novel_tag_pk").on(table.novelId, table.tagId),
        pk: (0, pg_core_1.primaryKey)({ name: 'novel_tag_pk', columns: [table.novelId, table.tagId] })
    };
});
// Relations for the tables
exports.NovelRelations = (0, drizzle_orm_1.relations)(exports.NovelTable, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        author: one(exports.AuthorTable, { fields: [exports.NovelTable.authorId], references: [exports.AuthorTable.id] }),
        publisher: one(exports.PublisherTable, { fields: [exports.NovelTable.publisherId], references: [exports.PublisherTable.id] }),
        chapters: many(exports.ChapterTable),
        genres: many(exports.NovelGenreTable),
        tags: many(exports.NovelTagTable)
    });
});
exports.ChapterRelations = (0, drizzle_orm_1.relations)(exports.ChapterTable, function (_a) {
    var one = _a.one;
    return ({
        novel: one(exports.NovelTable, { fields: [exports.ChapterTable.novelId], references: [exports.NovelTable.id] })
    });
});
exports.AuthorRelations = (0, drizzle_orm_1.relations)(exports.AuthorTable, function (_a) {
    var many = _a.many;
    return ({
        novels: many(exports.NovelTable)
    });
});
exports.PublisherRelations = (0, drizzle_orm_1.relations)(exports.PublisherTable, function (_a) {
    var many = _a.many;
    return ({
        novels: many(exports.NovelTable)
    });
});
exports.GenreRelations = (0, drizzle_orm_1.relations)(exports.GenreTable, function (_a) {
    var many = _a.many;
    return ({
        novels: many(exports.NovelGenreTable)
    });
});
exports.TagRelations = (0, drizzle_orm_1.relations)(exports.TagTable, function (_a) {
    var many = _a.many;
    return ({
        novels: many(exports.NovelTagTable)
    });
});

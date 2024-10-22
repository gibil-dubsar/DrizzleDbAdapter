import {
    varchar,
    integer,
    real,
    pgTable,
    text,
    boolean,
    timestamp,
    primaryKey,
    uniqueIndex, numeric
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import crypto from "crypto";

// Custom function for generating short IDs
export function generateShortId(): string {
    return crypto.randomBytes(9).toString('base64').replace(/\W/g, '').substring(0, 12);
}

// Table: Authors
export const AuthorTable = pgTable("Author", {
    id: varchar("id", {length: 12}).$default(() => generateShortId()).primaryKey(),
    name: varchar("name", {length: 255}).notNull(),
}, table => {
    return {
        uniqueAuthor: uniqueIndex("uniqueAuthor").on(table.name),
    };
});

// Table: Publishers
export const PublisherTable = pgTable("Publisher", {
    id: varchar("id", {length: 12}).$default(() => generateShortId()).primaryKey(),
    name: varchar("name", {length: 255}).notNull(),
}, table => {
    return {
        uniquePublisher: uniqueIndex("uniquePublisher").on(table.name),
    };
});

// Table: Genres
export const GenreTable = pgTable("Genre", {
    id: varchar("id", {length: 12}).$default(() => generateShortId()).primaryKey(),
    name: varchar("name", {length: 255}).notNull(),
}, table => {
    return {
        uniqueGenre: uniqueIndex("uniqueGenre").on(table.name),
    };
});

// Table: Tags
export const TagTable = pgTable("Tag", {
    id: varchar("id", {length: 12}).$default(() => generateShortId()).primaryKey(),
    name: varchar("name", {length: 255}).notNull(),
}, table => {
    return {
        uniqueTag: uniqueIndex("uniqueTag").on(table.name),
    };
});

// Table: Novels
export const NovelTable = pgTable("Novel", {
    id: varchar("id", {length: 12}).$default(() => generateShortId()).primaryKey(),
    title: varchar("title", {length: 255}).notNull(),
    novel_slug: varchar("novel_slug", {length: 255}).notNull(),
    rating: real("rating").default(0),
    ratingCount: integer("ratingCount").default(0),
    status: varchar("status", {length: 50}).notNull(),
    yearOfPublication: varchar("yearOfPublication", {length: 4}).default(""),
    description: text("description").default(""),
    imageUrl: varchar("imageUrl", {length: 255}),
    authorId: varchar("authorId", {length: 12}).references(() => AuthorTable.id).notNull(),
    publisherId: varchar("publisherId", {length: 12}).references(() => PublisherTable.id),
}, table => {
    return {
        uniqueNovel: uniqueIndex("uniqueNovel").on(table.novel_slug),
    };
});

// Table: Chapters
export const ChapterTable = pgTable("Chapter", {
    title: varchar("title", {length: 255}).notNull(),
    slug: varchar("slug", {length: 50}).notNull(),
    issue: numeric("issue", {precision: 6, scale: 1}).notNull(),
    location: varchar("location", {length: 255}).notNull(),
    novelId: varchar("novelId", {length: 12}).references(() => NovelTable.id).notNull(),
}, table => {
    return {
        //pk: primaryKey("novel_genre_pk").on(table.novelId, table.genreId),
        pk: primaryKey({name: 'novel_issue_chapter_pk', columns: [table.novelId, table.issue]})
    };
});

// Join Table: Novel Genres
export const NovelGenreTable = pgTable("NovelGenre", {
    novelId: varchar("novelId", {length: 12}).references(() => NovelTable.id).notNull(),
    genreId: varchar("genreId", {length: 12}).references(() => GenreTable.id).notNull(),
}, table => {
    return {
        //pk: primaryKey("novel_genre_pk").on(table.novelId, table.genreId),
        pk: primaryKey({name: 'novel_genre_pk', columns: [table.novelId, table.genreId]})
    };
});

// Join Table: Novel Tags
export const NovelTagTable = pgTable("NovelTag", {
    novelId: varchar("novelId", {length: 12}).references(() => NovelTable.id).notNull(),
    tagId: varchar("tagId", {length: 12}).references(() => TagTable.id).notNull(),
}, table => {
    return {
        //pk: primaryKey("novel_tag_pk").on(table.novelId, table.tagId),
        pk: primaryKey({name: 'novel_tag_pk', columns: [table.novelId, table.tagId]})
    };
});

// Relations for the tables
export const NovelRelations = relations(NovelTable, ({one, many}) => ({
    author: one(AuthorTable, {fields: [NovelTable.authorId], references: [AuthorTable.id]}),
    publisher: one(PublisherTable, {fields: [NovelTable.publisherId], references: [PublisherTable.id]}),
    chapters: many(ChapterTable),
    genres: many(NovelGenreTable),
    tags: many(NovelTagTable)
}));

export const ChapterRelations = relations(ChapterTable, ({one}) => ({
    novel: one(NovelTable, {fields: [ChapterTable.novelId], references: [NovelTable.id]})
}));

export const AuthorRelations = relations(AuthorTable, ({many}) => ({
    novels: many(NovelTable)
}));

export const PublisherRelations = relations(PublisherTable, ({many}) => ({
    novels: many(NovelTable)
}));

export const GenreRelations = relations(GenreTable, ({many}) => ({
    novels: many(NovelGenreTable)
}));

export const TagRelations = relations(TagTable, ({many}) => ({
    novels: many(NovelTagTable)
}));

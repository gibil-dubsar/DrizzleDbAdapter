import {db} from './db.js'; // Assumed database instance
import {
    NovelTable,
    AuthorTable,
    PublisherTable,
    GenreTable,
    TagTable,
    NovelGenreTable,
    NovelTagTable,
    ChapterTable,
    generateShortId
} from './schema.js'; // Import your schema
import {and, count, eq, sql} from 'drizzle-orm';

class InsertError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InsertError";
    }
}

//const tableCache = new Map<string {preparedStatement: }>

// Generalized function to insert data into any table
async function ensureNameInTableAndFetchId<T>(
    table: any,
    item_name: string,
    conflictTarget: any = 'name',
    returningField: any = 'id',
): Promise<string> {
    try {
        const newId = generateShortId()

        const result = await db
            .insert(table)
            .values({id: newId, name: item_name})
            .onConflictDoUpdate({target: table[conflictTarget], set: {id: sql<string>`${table}.id`}})
            .returning({id: table[returningField]});


        if (result.length !== 1) {
            throw new InsertError(`Insert failed for ${table.name}: ${item_name}`);
        }

        return result[0].id;
    } catch (error) {
        console.error(`Error during insert for ${table.name}:`, error);
        throw error;
    }
}

export function getAuthorId(authorName: string) {
    return ensureNameInTableAndFetchId(AuthorTable, authorName)
}

export function getPublisherId(publisherName: string) {
    return ensureNameInTableAndFetchId(PublisherTable, publisherName)
}

export function getGenreId(GenreName: string) {
    return ensureNameInTableAndFetchId(GenreTable, GenreName)
}

export function getTagId(TagName: string) {
    return ensureNameInTableAndFetchId(TagTable, TagName)
}


export async function updateTagLookUps(novelId: string, tagId: string) {
    return await db.insert(NovelTagTable).values({novelId: novelId, tagId: tagId}).onConflictDoNothing().execute();
}

export async function updateGenreLookUps(novelId: string, genreId: string) {
    return await db.insert(NovelGenreTable).values({
        novelId: novelId,
        genreId: genreId
    }).onConflictDoNothing().execute();
}

async function insertTagsForNovel(novelId: string, tags: string[]) {
    let status = true
    await Promise.allSettled(tags.map(tagName =>
        getTagId(tagName).then(tagId => updateTagLookUps(novelId, tagId))
    )).catch(error => {
        console.error(error);
        status = false;
    });
    return status
}

async function insertGenresForNovel(novelId: string, genres: string[]) {
    let status = true
    await Promise.allSettled(genres.map(genreName =>
        getGenreId(genreName).then(genreId => {
            console.log("Received genreId:", genreId)
            updateGenreLookUps(novelId, genreId)
        })
    )).catch(error => {
        console.error(error);
        status = false;
    });
    return status
}

export async function insertChapter(novelId: string, title: string, slug:string,
                                    issue: number, location: string) {
    try {
        await db.insert(ChapterTable).values({
            title: title,
            slug: slug,
            issue: issue.toFixed(1),
            location: location,
            novelId: novelId
        })
        console.log("Chapter Inserted Successfully");
    } catch (error) {
        console.error("Error during chapter insertion", error);
    }
}

export async function getChapter(novelId: string, issue:number) {
    const chapters = await db.select({slug:ChapterTable.slug})
        .from(ChapterTable)
        .where(and(eq(ChapterTable.novelId, novelId), eq(ChapterTable.issue, issue.toFixed(1))));
    return chapters;
}

export async function getChapterCount(novelId: string):Promise<number> {
    const chaptersCount = await db.select({ count: count() })
        .from(ChapterTable)
        .where(eq(ChapterTable.novelId, novelId));
    return chaptersCount[0].count;
}

// Main function to insert a novel and all its related data
export async function getOrInsertNovel(novelData: {
    title: string;
    novel_slug: string;
    rating: number;
    ratingCount: number;
    status: string;
    yearOfPublication: string;
    description: string;
    imageUrl: string;
    author: string;
    publisher: string;
    genres: string[];
    tags: string[];
}) {
    const {
        title,
        novel_slug,
        rating,
        ratingCount,
        status,
        yearOfPublication,
        description,
        imageUrl,
        author,
        publisher,
        genres,
        tags
    } = novelData;

    const novelcheck = await db.select({id: NovelTable.id}).from(NovelTable).where(eq(NovelTable.novel_slug, novel_slug));
    if (novelcheck.length > 0) {
        const novelId = novelcheck[0].id
        return novelId;
    } else {

        const authorId = await getAuthorId(author);
        const publisherId = await getPublisherId(publisher);

        const novelId = generateShortId();

        await db.insert(NovelTable).values({
            id: novelId,
            title,
            novel_slug,
            rating,
            ratingCount,
            status,
            yearOfPublication,
            description,
            imageUrl,
            authorId,
            publisherId
        }).execute();

        await insertGenresForNovel(novelId, genres);
        await insertTagsForNovel(novelId, tags);

        return novelId;

    }
}

// Helper function to get a novel by its slug and return the structured data
export async function getNovelBySlug(novel_slug: string) {
    try {
        // Fetch the novel info
        const novel = await db
            .select({
                id: NovelTable.id,
                title: NovelTable.title,
                rating: NovelTable.rating,
                ratingCount: NovelTable.ratingCount,
                status: NovelTable.status,
                yearOfPublication: NovelTable.yearOfPublication,
                description: NovelTable.description,
                imageUrl: NovelTable.imageUrl,
                authorId: NovelTable.authorId,
                publisherId: NovelTable.publisherId
            })
            .from(NovelTable)
            .where(eq(NovelTable.novel_slug, novel_slug))
            .then(result => result[0]);

        if (!novel) {
            throw new Error(`Novel with slug ${novel_slug} not found`);
        }

        // Fetch author, publisher, genres, and tags
        const [author, publisher, genres, tags] = await Promise.all([
            db.select({name: AuthorTable.name}).from(AuthorTable).where(eq(AuthorTable.id, novel.authorId)).then(result => result[0]?.name),
            // @ts-ignore
            db.select({name: PublisherTable.name}).from(PublisherTable).where(eq(PublisherTable.id, novel.publisherId)).then(result => result[0]?.name),
            db.select({name: GenreTable.name}).from(GenreTable).innerJoin(NovelGenreTable, eq(NovelGenreTable.genreId, GenreTable.id)).where(eq(NovelGenreTable.novelId, novel.id)),
            db.select({name: TagTable.name}).from(TagTable).innerJoin(NovelTagTable, eq(NovelTagTable.tagId, TagTable.id)).where(eq(NovelTagTable.novelId, novel.id)),
        ]);

        // Extract genre names and tag names from the results
        const genreNames = genres.map((genre: any) => genre.name);
        const tagNames = tags.map((tag: any) => tag.name);

        // Construct the result in the desired JSON format
        return {
            title: novel.title,
            novel_slug,
            rating: novel.rating,
            ratingCount: novel.ratingCount,
            status: novel.status,
            yearOfPublication: novel.yearOfPublication,
            description: novel.description,
            imageUrl: novel.imageUrl,
            author: author || null,
            publisher: publisher || null,
            genres: genreNames,
            tags: tagNames,
        };
    } catch (error) {
        console.error("Error fetching novel by slug:", error);
        throw error;
    }
}


export async function deleteAllData() {
    await db.delete(NovelGenreTable);
    await db.delete(NovelTagTable);
    await db.delete(GenreTable);
    await db.delete(TagTable);
    await db.delete(ChapterTable);
    await db.delete(NovelTable);
    await db.delete(AuthorTable);
    await db.delete(PublisherTable);
    console.log("All data deleted!");
}

// Call the function to delete all rows



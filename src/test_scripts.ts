//import {getAuthorId, getPublisherId, getGenreId, getTagId, updateGenreLookUps, updateTagLookUps, insertNovel, insertChapter, getNovelBySlug, deleteAllData} from "./index";
import {
    getAuthorId,
    getPublisherId,
    getGenreId,
    getTagId,
    updateGenreLookUps,
    updateTagLookUps,
    getOrInsertNovel,
    insertChapter,
    getNovelBySlug,
    deleteAllData
} from "./index.js";
import {generateShortId} from "./schema";


function test_shortIdGeneration(){
    for (let i = 0; i < 10; i++) {

        console.log( generateShortId());
    }
}

//Test  the above functions
(async function () {

    try {

        const novel = {
            "title": "Peculiar Soul",
            "novel_slug": "peculiar-soul-1",
            "rating": 9.0,
            "ratingCount": 6,
            "status": "Ongoing",
            "yearOfPublication": "2008",
            "description": "",
            "imageUrl": "https://novelbin.com/media/novel/peculiar-soul.jpg",
            "author": "TMarkos",
            "publisher": "RoyalRoad",
            "genres": ["Fantasy", "Sesame", "Drama", "Supernatural", "Adventure", "Action"],
            "tags": ["Grimdark", "Loco", "High fantasy", "Magic", "Male protagonist", "Urban", "Weak to strong"]
        }

        const novelId = await getOrInsertNovel(novel);
        await insertChapter(novelId, 'title1', "slug", 1.2, "this/isthe/path/tos3/file");
        console.log("First Attempt: Inserted Author ID:", novelId);

        const retrievedNoveInfo = await getNovelBySlug("peculiar-soul-1");
        console.log("Retreived Novel Info", retrievedNoveInfo);

    } catch (error) {
        console.error("Error during author upsert:", error);
    }
    await deleteAllData().catch(console.error);
    // try {
    //     const authorId = await getTagId("Test2");
    //     console.log("Second Attempt: Inserted Author ID:", authorId);
    // } catch (error) {
    //     console.error("Error during author upsert:", error);
    // }
})();

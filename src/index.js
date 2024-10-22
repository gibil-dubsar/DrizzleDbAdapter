"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorId = getAuthorId;
exports.getPublisherId = getPublisherId;
exports.getGenreId = getGenreId;
exports.getTagId = getTagId;
exports.updateTagLookUps = updateTagLookUps;
exports.updateGenreLookUps = updateGenreLookUps;
exports.insertChapter = insertChapter;
exports.getChapter = getChapter;
exports.getOrInsertNovel = getOrInsertNovel;
exports.getNovelBySlug = getNovelBySlug;
exports.deleteAllData = deleteAllData;
var db_js_1 = require("./db.js"); // Assumed database instance
var schema_js_1 = require("./schema.js"); // Import your schema
var drizzle_orm_1 = require("drizzle-orm");
var InsertError = /** @class */ (function (_super) {
    __extends(InsertError, _super);
    function InsertError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "InsertError";
        return _this;
    }
    return InsertError;
}(Error));
//const tableCache = new Map<string {preparedStatement: }>
// Generalized function to insert data into any table
function ensureNameInTableAndFetchId(table_1, item_name_1) {
    return __awaiter(this, arguments, void 0, function (table, item_name, conflictTarget, returningField) {
        var newId, result, error_1;
        if (conflictTarget === void 0) { conflictTarget = 'name'; }
        if (returningField === void 0) { returningField = 'id'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    newId = (0, schema_js_1.generateShortId)();
                    return [4 /*yield*/, db_js_1.db
                            .insert(table)
                            .values({ id: newId, name: item_name })
                            .onConflictDoUpdate({ target: table[conflictTarget], set: { id: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ".id"], ["", ".id"])), table) } })
                            .returning({ id: table[returningField] })];
                case 1:
                    result = _a.sent();
                    if (result.length !== 1) {
                        throw new InsertError("Insert failed for ".concat(table.name, ": ").concat(item_name));
                    }
                    return [2 /*return*/, result[0].id];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error during insert for ".concat(table.name, ":"), error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getAuthorId(authorName) {
    return ensureNameInTableAndFetchId(schema_js_1.AuthorTable, authorName);
}
function getPublisherId(publisherName) {
    return ensureNameInTableAndFetchId(schema_js_1.PublisherTable, publisherName);
}
function getGenreId(GenreName) {
    return ensureNameInTableAndFetchId(schema_js_1.GenreTable, GenreName);
}
function getTagId(TagName) {
    return ensureNameInTableAndFetchId(schema_js_1.TagTable, TagName);
}
function updateTagLookUps(novelId, tagId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_js_1.db.insert(schema_js_1.NovelTagTable).values({ novelId: novelId, tagId: tagId }).onConflictDoNothing().execute()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function updateGenreLookUps(novelId, genreId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_js_1.db.insert(schema_js_1.NovelGenreTable).values({
                        novelId: novelId,
                        genreId: genreId
                    }).onConflictDoNothing().execute()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function insertTagsForNovel(novelId, tags) {
    return __awaiter(this, void 0, void 0, function () {
        var status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = true;
                    return [4 /*yield*/, Promise.allSettled(tags.map(function (tagName) {
                            return getTagId(tagName).then(function (tagId) { return updateTagLookUps(novelId, tagId); });
                        })).catch(function (error) {
                            console.error(error);
                            status = false;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, status];
            }
        });
    });
}
function insertGenresForNovel(novelId, genres) {
    return __awaiter(this, void 0, void 0, function () {
        var status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = true;
                    return [4 /*yield*/, Promise.allSettled(genres.map(function (genreName) {
                            return getGenreId(genreName).then(function (genreId) {
                                console.log("Received genreId:", genreId);
                                updateGenreLookUps(novelId, genreId);
                            });
                        })).catch(function (error) {
                            console.error(error);
                            status = false;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, status];
            }
        });
    });
}
function insertChapter(novelId, title, slug, issue, location) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_js_1.db.insert(schema_js_1.ChapterTable).values({
                            title: title,
                            slug: slug,
                            issue: issue.toFixed(1),
                            location: location,
                            novelId: novelId
                        })];
                case 1:
                    _a.sent();
                    console.log("Chapter Inserted Successfully");
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error during chapter insertion", error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getChapter(novelId, issue) {
    return __awaiter(this, void 0, void 0, function () {
        var chapters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_js_1.db.select({ slug: schema_js_1.ChapterTable.slug })
                        .from(schema_js_1.ChapterTable)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.ChapterTable.novelId, novelId), (0, drizzle_orm_1.eq)(schema_js_1.ChapterTable.issue, issue.toFixed(1))))];
                case 1:
                    chapters = _a.sent();
                    return [2 /*return*/, chapters];
            }
        });
    });
}
// Main function to insert a novel and all its related data
function getOrInsertNovel(novelData) {
    return __awaiter(this, void 0, void 0, function () {
        var title, novel_slug, rating, ratingCount, status, yearOfPublication, description, imageUrl, author, publisher, genres, tags, novelcheck, novelId, authorId, publisherId, novelId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    title = novelData.title, novel_slug = novelData.novel_slug, rating = novelData.rating, ratingCount = novelData.ratingCount, status = novelData.status, yearOfPublication = novelData.yearOfPublication, description = novelData.description, imageUrl = novelData.imageUrl, author = novelData.author, publisher = novelData.publisher, genres = novelData.genres, tags = novelData.tags;
                    return [4 /*yield*/, db_js_1.db.select({ id: schema_js_1.NovelTable.id }).from(schema_js_1.NovelTable).where((0, drizzle_orm_1.eq)(schema_js_1.NovelTable.novel_slug, novel_slug))];
                case 1:
                    novelcheck = _a.sent();
                    if (!(novelcheck.length > 0)) return [3 /*break*/, 2];
                    novelId = novelcheck[0].id;
                    return [2 /*return*/, novelId];
                case 2: return [4 /*yield*/, getAuthorId(author)];
                case 3:
                    authorId = _a.sent();
                    return [4 /*yield*/, getPublisherId(publisher)];
                case 4:
                    publisherId = _a.sent();
                    novelId = (0, schema_js_1.generateShortId)();
                    return [4 /*yield*/, db_js_1.db.insert(schema_js_1.NovelTable).values({
                            id: novelId,
                            title: title,
                            novel_slug: novel_slug,
                            rating: rating,
                            ratingCount: ratingCount,
                            status: status,
                            yearOfPublication: yearOfPublication,
                            description: description,
                            imageUrl: imageUrl,
                            authorId: authorId,
                            publisherId: publisherId
                        }).execute()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, insertGenresForNovel(novelId, genres)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, insertTagsForNovel(novelId, tags)];
                case 7:
                    _a.sent();
                    return [2 /*return*/, novelId];
            }
        });
    });
}
// Helper function to get a novel by its slug and return the structured data
function getNovelBySlug(novel_slug) {
    return __awaiter(this, void 0, void 0, function () {
        var novel, _a, author, publisher, genres, tags, genreNames, tagNames, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, db_js_1.db
                            .select({
                            id: schema_js_1.NovelTable.id,
                            title: schema_js_1.NovelTable.title,
                            rating: schema_js_1.NovelTable.rating,
                            ratingCount: schema_js_1.NovelTable.ratingCount,
                            status: schema_js_1.NovelTable.status,
                            yearOfPublication: schema_js_1.NovelTable.yearOfPublication,
                            description: schema_js_1.NovelTable.description,
                            imageUrl: schema_js_1.NovelTable.imageUrl,
                            authorId: schema_js_1.NovelTable.authorId,
                            publisherId: schema_js_1.NovelTable.publisherId
                        })
                            .from(schema_js_1.NovelTable)
                            .where((0, drizzle_orm_1.eq)(schema_js_1.NovelTable.novel_slug, novel_slug))
                            .then(function (result) { return result[0]; })];
                case 1:
                    novel = _b.sent();
                    if (!novel) {
                        throw new Error("Novel with slug ".concat(novel_slug, " not found"));
                    }
                    return [4 /*yield*/, Promise.all([
                            db_js_1.db.select({ name: schema_js_1.AuthorTable.name }).from(schema_js_1.AuthorTable).where((0, drizzle_orm_1.eq)(schema_js_1.AuthorTable.id, novel.authorId)).then(function (result) { var _a; return (_a = result[0]) === null || _a === void 0 ? void 0 : _a.name; }),
                            // @ts-ignore
                            db_js_1.db.select({ name: schema_js_1.PublisherTable.name }).from(schema_js_1.PublisherTable).where((0, drizzle_orm_1.eq)(schema_js_1.PublisherTable.id, novel.publisherId)).then(function (result) { var _a; return (_a = result[0]) === null || _a === void 0 ? void 0 : _a.name; }),
                            db_js_1.db.select({ name: schema_js_1.GenreTable.name }).from(schema_js_1.GenreTable).innerJoin(schema_js_1.NovelGenreTable, (0, drizzle_orm_1.eq)(schema_js_1.NovelGenreTable.genreId, schema_js_1.GenreTable.id)).where((0, drizzle_orm_1.eq)(schema_js_1.NovelGenreTable.novelId, novel.id)),
                            db_js_1.db.select({ name: schema_js_1.TagTable.name }).from(schema_js_1.TagTable).innerJoin(schema_js_1.NovelTagTable, (0, drizzle_orm_1.eq)(schema_js_1.NovelTagTable.tagId, schema_js_1.TagTable.id)).where((0, drizzle_orm_1.eq)(schema_js_1.NovelTagTable.novelId, novel.id)),
                        ])];
                case 2:
                    _a = _b.sent(), author = _a[0], publisher = _a[1], genres = _a[2], tags = _a[3];
                    genreNames = genres.map(function (genre) { return genre.name; });
                    tagNames = tags.map(function (tag) { return tag.name; });
                    // Construct the result in the desired JSON format
                    return [2 /*return*/, {
                            title: novel.title,
                            novel_slug: novel_slug,
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
                        }];
                case 3:
                    error_3 = _b.sent();
                    console.error("Error fetching novel by slug:", error_3);
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_js_1.db.delete(schema_js_1.NovelGenreTable)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_js_1.db.delete(schema_js_1.NovelTagTable)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_js_1.db.delete(schema_js_1.GenreTable)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db_js_1.db.delete(schema_js_1.TagTable)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db_js_1.db.delete(schema_js_1.ChapterTable)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db_js_1.db.delete(schema_js_1.NovelTable)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db_js_1.db.delete(schema_js_1.AuthorTable)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db_js_1.db.delete(schema_js_1.PublisherTable)];
                case 8:
                    _a.sent();
                    console.log("All data deleted!");
                    return [2 /*return*/];
            }
        });
    });
}
var templateObject_1;
// Call the function to delete all rows

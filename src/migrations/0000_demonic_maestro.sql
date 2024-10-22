CREATE TABLE IF NOT EXISTS "Author" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Chapter" (
	"title" varchar(255) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"issue" numeric(6, 1) NOT NULL,
	"location" varchar(255) NOT NULL,
	"novelId" varchar(12) NOT NULL,
	CONSTRAINT "novel_issue_chapter_pk" PRIMARY KEY("novelId","issue")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Genre" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NovelGenre" (
	"novelId" varchar(12) NOT NULL,
	"genreId" varchar(12) NOT NULL,
	CONSTRAINT "novel_genre_pk" PRIMARY KEY("novelId","genreId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Novel" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"novel_slug" varchar(255) NOT NULL,
	"rating" real DEFAULT 0,
	"ratingCount" integer DEFAULT 0,
	"status" varchar(50) NOT NULL,
	"yearOfPublication" varchar(4) DEFAULT '',
	"description" text DEFAULT '',
	"imageUrl" varchar(255),
	"authorId" varchar(12) NOT NULL,
	"publisherId" varchar(12)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NovelTag" (
	"novelId" varchar(12) NOT NULL,
	"tagId" varchar(12) NOT NULL,
	CONSTRAINT "novel_tag_pk" PRIMARY KEY("novelId","tagId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Publisher" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tag" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_novelId_Novel_id_fk" FOREIGN KEY ("novelId") REFERENCES "public"."Novel"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NovelGenre" ADD CONSTRAINT "NovelGenre_novelId_Novel_id_fk" FOREIGN KEY ("novelId") REFERENCES "public"."Novel"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NovelGenre" ADD CONSTRAINT "NovelGenre_genreId_Genre_id_fk" FOREIGN KEY ("genreId") REFERENCES "public"."Genre"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Novel" ADD CONSTRAINT "Novel_authorId_Author_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."Author"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Novel" ADD CONSTRAINT "Novel_publisherId_Publisher_id_fk" FOREIGN KEY ("publisherId") REFERENCES "public"."Publisher"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NovelTag" ADD CONSTRAINT "NovelTag_novelId_Novel_id_fk" FOREIGN KEY ("novelId") REFERENCES "public"."Novel"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NovelTag" ADD CONSTRAINT "NovelTag_tagId_Tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniqueAuthor" ON "Author" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniqueGenre" ON "Genre" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniqueNovel" ON "Novel" USING btree ("novel_slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniquePublisher" ON "Publisher" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniqueTag" ON "Tag" USING btree ("name");
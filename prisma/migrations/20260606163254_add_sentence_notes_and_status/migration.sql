-- CreateTable
CREATE TABLE "words" (
    "id" TEXT NOT NULL,
    "english" VARCHAR(255) NOT NULL,
    "turkish" VARCHAR(255) NOT NULL,
    "isLearned" BOOLEAN NOT NULL DEFAULT false,
    "sentence" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'unlearned',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

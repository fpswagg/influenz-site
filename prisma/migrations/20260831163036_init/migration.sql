-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('fr', 'en');

-- CreateEnum
CREATE TYPE "CopyFieldKind" AS ENUM ('TEXT', 'TEXTAREA', 'LIST');

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO', 'FILE');

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL DEFAULT 'site',
    "siteName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "textLogoUrl" TEXT,
    "faviconUrl" TEXT,
    "heroBannerUrl" TEXT,
    "seoTitleFr" TEXT NOT NULL,
    "seoTitleEn" TEXT NOT NULL,
    "seoDescriptionFr" TEXT NOT NULL,
    "seoDescriptionEn" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneSecondary" TEXT,
    "address" TEXT NOT NULL,
    "postalBox" TEXT,
    "legalForm" TEXT,
    "niu" TEXT,
    "rccm" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "instagramUrl" TEXT,
    "mapsEmbedUrl" TEXT,
    "contactIntroFr" TEXT,
    "contactIntroEn" TEXT,
    "locationBlurbFr" TEXT,
    "locationBlurbEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CopyEntry" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "kind" "CopyFieldKind" NOT NULL DEFAULT 'TEXT',
    "label" TEXT NOT NULL,
    "hint" TEXT,
    "valueFr" TEXT NOT NULL,
    "valueEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CopyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeSection" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "showInNav" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL,
    "labelFr" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "eyebrowFr" TEXT,
    "eyebrowEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "labelFr" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "isAll" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectService" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "labelFr" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "linkUrl" TEXT,
    "linkLabelFr" TEXT,
    "linkLabelEn" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTranslation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "results" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMedia" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL DEFAULT 'IMAGE',
    "altFr" TEXT,
    "altEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectServiceOnProject" (
    "projectId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectServiceOnProject_pkey" PRIMARY KEY ("projectId","serviceId")
);

-- CreateTable
CREATE TABLE "SolutionCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "labelFr" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "isAll" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolutionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "coverUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionTranslation" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "approach" TEXT NOT NULL,
    "callToAction" TEXT NOT NULL,
    "steps" TEXT[],
    "results" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolutionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionMedia" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL DEFAULT 'IMAGE',
    "altFr" TEXT,
    "altEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolutionMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionLink" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "labelFr" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolutionLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoLetters" TEXT NOT NULL,
    "imageUrl" TEXT,
    "descriptionFr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutService" (
    "id" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CopyEntry_key_key" ON "CopyEntry"("key");

-- CreateIndex
CREATE INDEX "CopyEntry_group_sortOrder_idx" ON "CopyEntry"("group", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "HomeSection_key_key" ON "HomeSection"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCategory_slug_key" ON "ProjectCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectService_slug_key" ON "ProjectService"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_categoryId_idx" ON "Project"("categoryId");

-- CreateIndex
CREATE INDEX "Project_published_featured_sortOrder_idx" ON "Project"("published", "featured", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTranslation_projectId_locale_key" ON "ProjectTranslation"("projectId", "locale");

-- CreateIndex
CREATE INDEX "ProjectMedia_projectId_sortOrder_idx" ON "ProjectMedia"("projectId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SolutionCategory_slug_key" ON "SolutionCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Solution_slug_key" ON "Solution"("slug");

-- CreateIndex
CREATE INDEX "Solution_categoryId_idx" ON "Solution"("categoryId");

-- CreateIndex
CREATE INDEX "Solution_published_featured_sortOrder_idx" ON "Solution"("published", "featured", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SolutionTranslation_solutionId_locale_key" ON "SolutionTranslation"("solutionId", "locale");

-- CreateIndex
CREATE INDEX "SolutionMedia_solutionId_sortOrder_idx" ON "SolutionMedia"("solutionId", "sortOrder");

-- CreateIndex
CREATE INDEX "SolutionLink_solutionId_sortOrder_idx" ON "SolutionLink"("solutionId", "sortOrder");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProjectCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTranslation" ADD CONSTRAINT "ProjectTranslation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMedia" ADD CONSTRAINT "ProjectMedia_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectServiceOnProject" ADD CONSTRAINT "ProjectServiceOnProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectServiceOnProject" ADD CONSTRAINT "ProjectServiceOnProject_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ProjectService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SolutionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionTranslation" ADD CONSTRAINT "SolutionTranslation_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionMedia" ADD CONSTRAINT "SolutionMedia_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionLink" ADD CONSTRAINT "SolutionLink_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

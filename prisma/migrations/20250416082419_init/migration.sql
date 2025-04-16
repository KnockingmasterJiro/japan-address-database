-- CreateTable
CREATE TABLE "prefectures" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "prefectures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefCode" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "prefCode" TEXT NOT NULL,
    "cityCode" TEXT NOT NULL,
    "townCode" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "koaza" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prefectures_code_key" ON "prefectures"("code");

-- CreateIndex
CREATE INDEX "prefectures_code_idx" ON "prefectures"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cities_code_key" ON "cities"("code");

-- CreateIndex
CREATE INDEX "cities_code_idx" ON "cities"("code");

-- CreateIndex
CREATE INDEX "cities_prefCode_idx" ON "cities"("prefCode");

-- CreateIndex
CREATE INDEX "addresses_prefCode_idx" ON "addresses"("prefCode");

-- CreateIndex
CREATE INDEX "addresses_cityCode_idx" ON "addresses"("cityCode");

-- CreateIndex
CREATE INDEX "addresses_townCode_idx" ON "addresses"("townCode");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_townCode_key" ON "addresses"("townCode");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_prefCode_fkey" FOREIGN KEY ("prefCode") REFERENCES "prefectures"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_cityCode_fkey" FOREIGN KEY ("cityCode") REFERENCES "cities"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

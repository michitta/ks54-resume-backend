-- CreateTable
CREATE TABLE "Users" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Students" (
    "uuid" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telegram" TEXT,
    "driverLicence" TEXT,
    "educationForm" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "endYear" TEXT NOT NULL,
    "launguages" TEXT NOT NULL,
    "professionalSkills" TEXT NOT NULL,
    "socialSkills" TEXT NOT NULL,
    "additionalSkills" TEXT NOT NULL,
    "additionalInfo" TEXT NOT NULL,
    "workExperience" TEXT NOT NULL,
    "educations" TEXT NOT NULL,
    "courses" TEXT NOT NULL,
    "awards" TEXT NOT NULL,
    "practiceName" TEXT,
    "practiceTime" TEXT,
    "practiceByProfession" TEXT,
    "practiceFunctions" TEXT,
    "workName" TEXT,
    "workTime" TEXT,
    "workByProfession" TEXT,
    "workFunctions" TEXT,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageHash" TEXT,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_fullName_key" ON "Users"("fullName");

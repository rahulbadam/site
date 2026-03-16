-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "bannedAt" TIMESTAMP(3),
    "bannedReason" TEXT,
    "fraudScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "heightCm" INTEGER,
    "religion" TEXT,
    "caste" TEXT,
    "casteConsent" BOOLEAN NOT NULL DEFAULT false,
    "casteConsentAt" TIMESTAMP(3),
    "subCaste" TEXT,
    "education" TEXT,
    "occupation" TEXT,
    "incomeRange" TEXT,
    "locationCity" TEXT,
    "locationState" TEXT,
    "locationCountry" TEXT NOT NULL DEFAULT 'India',
    "locationPincode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "maritalStatus" TEXT,
    "diet" TEXT,
    "smoking" TEXT,
    "drinking" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aboutMe" TEXT,
    "profileCompletionPercentage" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationLevel" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3),
    "profileViewsCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredUntil" TIMESTAMP(3),
    "isBoosted" BOOLEAN NOT NULL DEFAULT false,
    "boostUntil" TIMESTAMP(3),
    "astrologyEnabled" BOOLEAN NOT NULL DEFAULT false,
    "birthTime" TEXT,
    "birthPlace" TEXT,
    "manglik" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "cdnUrl" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "moderationStatus" TEXT NOT NULL DEFAULT 'pending',
    "moderationNotes" TEXT,
    "photoOrder" INTEGER NOT NULL DEFAULT 0,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredAgeMin" INTEGER NOT NULL DEFAULT 21,
    "preferredAgeMax" INTEGER NOT NULL DEFAULT 40,
    "preferredHeightMin" INTEGER,
    "preferredHeightMax" INTEGER,
    "preferredReligions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredCastes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredEducations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredOccupations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredLocations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredMaritalStatus" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredDiet" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredSmoking" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredDrinking" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredLanguages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredIncomeMin" INTEGER,
    "preferredIncomeMax" INTEGER,
    "maxDistanceKm" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "compatibilityScore" DOUBLE PRECISION,
    "matchSource" TEXT NOT NULL DEFAULT 'mutual_interest',
    "astrologyScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "matchId" TEXT,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "content" TEXT,
    "templateId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shortlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedUserId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "adminNotes" TEXT,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verificationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "documentType" TEXT,
    "verificationData" JSONB,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoCall" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "callerId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "roomId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoCall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_isActive_isBanned_idx" ON "User"("isActive", "isBanned");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_gender_idx" ON "Profile"("gender");

-- CreateIndex
CREATE INDEX "Profile_religion_idx" ON "Profile"("religion");

-- CreateIndex
CREATE INDEX "Profile_locationCity_idx" ON "Profile"("locationCity");

-- CreateIndex
CREATE INDEX "Profile_locationState_idx" ON "Profile"("locationState");

-- CreateIndex
CREATE INDEX "Profile_isVerified_idx" ON "Profile"("isVerified");

-- CreateIndex
CREATE INDEX "Photo_profileId_idx" ON "Photo"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_userId_key" ON "Preferences"("userId");

-- CreateIndex
CREATE INDEX "Interest_senderId_idx" ON "Interest"("senderId");

-- CreateIndex
CREATE INDEX "Interest_receiverId_idx" ON "Interest"("receiverId");

-- CreateIndex
CREATE INDEX "Interest_status_idx" ON "Interest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_senderId_receiverId_key" ON "Interest"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Match_user1Id_idx" ON "Match"("user1Id");

-- CreateIndex
CREATE INDEX "Match_user2Id_idx" ON "Match"("user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_user1Id_user2Id_key" ON "Match"("user1Id", "user2Id");

-- CreateIndex
CREATE INDEX "Message_matchId_idx" ON "Message"("matchId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "Shortlist_userId_idx" ON "Shortlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Shortlist_userId_profileId_key" ON "Shortlist"("userId", "profileId");

-- CreateIndex
CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId");

-- CreateIndex
CREATE INDEX "Report_reportedUserId_idx" ON "Report"("reportedUserId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Verification_userId_idx" ON "Verification"("userId");

-- CreateIndex
CREATE INDEX "Verification_status_idx" ON "Verification"("status");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "VideoCall_matchId_idx" ON "VideoCall"("matchId");

-- CreateIndex
CREATE INDEX "VideoCall_callerId_idx" ON "VideoCall"("callerId");

-- CreateIndex
CREATE INDEX "VideoCall_receiverId_idx" ON "VideoCall"("receiverId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoCall" ADD CONSTRAINT "VideoCall_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoCall" ADD CONSTRAINT "VideoCall_callerId_fkey" FOREIGN KEY ("callerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoCall" ADD CONSTRAINT "VideoCall_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FriendshipRequest" (
    "requesterId" INTEGER NOT NULL,
    "requestedId" INTEGER NOT NULL,
    "declined" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("requesterId", "requestedId"),
    CONSTRAINT "FriendshipRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FriendshipRequest_requestedId_fkey" FOREIGN KEY ("requestedId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FriendshipRequest" ("createdAt", "declined", "requestedId", "requesterId") SELECT "createdAt", "declined", "requestedId", "requesterId" FROM "FriendshipRequest";
DROP TABLE "FriendshipRequest";
ALTER TABLE "new_FriendshipRequest" RENAME TO "FriendshipRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

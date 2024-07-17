import { SQLiteDatabase } from "expo-sqlite";
import { UserObj } from "@/app/app.types";
import * as SQLite from "expo-sqlite";

const createDataBase = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE user (id INTEGER PRIMARY KEY NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL);
`);
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};

const getUser = async (db) => {
  return await db.getAllAsync<UserObj>("SELECT * FROM user");
};

const storeUserData = async (email, password) => {
  const db = await SQLite.openDatabaseAsync("test.db");
  await db.runAsync(
    "INSERT INTO user (email, password) VALUES (?, ?)",
    email,
    password,
  );
};

const deleteUserWhileLogout = async () => {
  const db = await SQLite.openDatabaseAsync("test.db");
  try {
    await db.runAsync("DELETE FROM user WHERE id = $id", {
      $id: 1,
    });
  } catch (error) {
    console.error(`Error deleting todo with id ${1}:`, error);
  }
};

export { createDataBase, getUser, storeUserData, deleteUserWhileLogout };

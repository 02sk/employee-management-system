const mongoose = require("mongoose");
require("dotenv").config();

const localUri = "mongodb://127.0.0.1:27017/employee_management";
const atlasUri = process.env.MONGO_URI;

async function migrate() {
  let localDB;
  let atlasDB;

  try {
    console.log("Connecting to local MongoDB...");
    localDB = await mongoose.createConnection(localUri).asPromise();
    console.log("Local MongoDB connected.");

    console.log("Connecting to MongoDB Atlas...");
    atlasDB = await mongoose.createConnection(atlasUri).asPromise();
    console.log("MongoDB Atlas connected.");

    const collections = await localDB.db.listCollections().toArray();

    for (const collection of collections) {
      const name = collection.name;

      if (name.startsWith("system.")) continue;

      const documents = await localDB.db.collection(name).find({}).toArray();

      if (documents.length === 0) {
        console.log(`${name}: 0 documents`);
        continue;
      }

      await atlasDB.db.collection(name).deleteMany({});
      await atlasDB.db.collection(name).insertMany(documents);

      console.log(`${name}: ${documents.length} documents copied`);
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    if (localDB) await localDB.close();
    if (atlasDB) await atlasDB.close();
  }
}

migrate();

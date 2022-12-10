// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import * as dotenv from "dotenv"; dotenv.config();
import mongoose from "mongoose";
import {faker} from "@faker-js/faker";

// I M P O R T:  M O D E L
import UserModel from "../models/userModel.js";

// C O N N E C T   W I T H   M O N G O O S E  D B
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING || "mongodb://localhost:27017/recordshop")
.then(() => console.log('Connect with MongoDB: SUCCESS '))
.catch((err) => console.log('Connect with MongoDB: FAILED ', err))
mongoose.connection.on('error', console.log);

// S E E D I N G   P R O C E S S
seed()

async function seed() {
  try {
    const fakeUserData= []
    for(let i = 0; i < 50; i++) {
      fakeUserData.push({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.exampleEmail(),
        password: faker.internet.password()
      })
    }
    const userPromise = UserModel.insertMany(fakeUserData);
    const values = await Promise.all([
      userPromise
    ])
    console.log("Seeding complete", values);
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.disconnect()
  }
}

// npm run seed
// to the db & seed (fill it with fake data)
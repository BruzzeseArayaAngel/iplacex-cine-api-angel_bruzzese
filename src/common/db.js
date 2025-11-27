import { MongoClient } from "mongodb";

const uri = "mongodb+srv://ev3_express:express1234@cluster-express.bruj0lq.mongodb.net/?appName=cluster-express";

export const client = new MongoClient(uri);

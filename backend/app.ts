import express from "express";
import dotenv from "dotenv";
import postgres from "postgres";
import {drizzle} from "drizzle-orm/postgres-js"
import * as schema from "./drizzle/schema.js"

dotenv.config();

const port = process.env.PORT || 8500

const app = express();
app.use(express.json());

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("Missing connection string");
}

const sql = postgres(connectionString);
export const db = drizzle(sql, {schema})

import session from "./route/session.js";

app.use("/session", session);

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(port, () => {
    console.log("Server running on port "+port);
})
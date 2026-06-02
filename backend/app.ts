import express from "express";

const app = express();
app.use(express.json());

const port = process.env.PORT || 8500

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(port, () => {
    console.log("Server running on port "+port);
})
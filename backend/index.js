require('dotenv').config();

const express = require("express");
const cors = require("cors");

const rootRouter = require("./routes/index");

const app = express();

// Port Number
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // To parse JSON bodies
app.use(cors()); // To allow cross-origin requests

app.use("/api/v1",rootRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

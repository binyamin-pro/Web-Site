const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// route
app.post("/contact", (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    console.log("NEW CONTACT:");
    console.log(name, email, phone, subject, message);

    res.json({
        message: "Message received successfully!"
    });
});

// start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
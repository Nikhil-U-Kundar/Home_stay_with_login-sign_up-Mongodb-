require('dotenv').config();
const mongoose = require("mongoose");

// Connect to the database using async/await for better readability and error handling
(async () => {
    try {
        const connect = await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
    }
})();

// Create a schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create a model and export it
const User = mongoose.model("User", userSchema);
module.exports = User;

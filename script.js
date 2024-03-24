const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require('./config');

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get("/", (req, res) => {
    res.render("home.ejs");
});

// Login route
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// Signup route
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

// Signup POST route
app.post("/signup", async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    };

    try {
        // Check if the user data is already present in the database
        const existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            console.log('User already exists');
            return res.send('User already exists');
        }

        // Hashing the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        // Insert the new user data into the database
        const userData = await User.create(data);
        console.log(userData);
        res.render('home');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Error during signup');
    }
});

// Login POST route
app.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ username: req.body.username });
        if (!check) {
            res.render('home');
        } else {
            // Compare the hashed password from the database
            const isPasswordValid = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordValid) {
                res.render('home');
            } else {
                res.send('Wrong details');
            }
        }
    } catch {
        res.send('Entered wrong details');
    }
});

// Server listening
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware to serve static files (e.g., HTML, CSS)
app.use(express.static(__dirname));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/LoginPageDB', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB successfully!");
});

// User Schema Definition
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// User Model
const User = mongoose.model('User', userSchema);

// Route to serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'LoginPage.html'));  // Assume you have a LoginPage.html file
});

// Route to handle login form submission
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ username });
        let pass = await User.findOne({ password });
        let bio = await User.findOne({ bio });
        if (user) {
            if (pass){
            // Redirect to registration page if user already exists
            return res.redirect('/home.html');
            }
            else{
                return res.send('Password is Incorrect');
            }
        }
        else{
            return res.send('User is not registered');
        }
        
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('An error occurred during registration.');
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, bio } = req.body;

        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            // Redirect to registration page if user already exists
            return res.send("User already exists");
        }

        // Save new user to the database
        user = new User({ username, password, bio});
        await user.save();

        console.log('User saved:', user);
        res.redirect('/LoginPage.html');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('An error occurred during registration.');
    }
});


// Route to serve the registration page
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));  // Ensure RegisterPage.html exists
});

// Start the server
app.listen(4325, () => {
    console.log('Server is running on port 4325');
});




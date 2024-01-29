// app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();





// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a simple schema for user activity
const userActivitySchema = new mongoose.Schema({
    userId: String,
    page: String,
    duration: Number,
    timestamp: { type: Date, default: Date.now }
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

// Middleware to log user activity
app.use((req, res, next) => {
    const startTime = new Date();

    res.on('finish', () => {
        const endTime = new Date();
        const duration = endTime - startTime;

        const userActivity = new UserActivity({
            userId: req.headers['user-id'], // You may need to implement user authentication to get the user ID
            page: req.path,
            duration: duration
        });

        userActivity.save()
            .then(() => console.log('User activity logged successfully'))
            .catch(error => console.error('Error logging user activity:', error));
    });

    next();
});







// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`);
});
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const users = require("./routes/api/users");
const cors = require("cors");
const Task = require("./models/task");
const taskRoutes = require('./routes/api/taskRoutes');

const app = express();


// Bodyparser Middleware
app.use(express.json());
// Cors Middleware
app.use(cors());
// DB Config
const mongo_url = config.get("mongo_url")
mongoose.set('strictQuery', true);
mongoose.connect(mongo_url)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));


    // Use routes
app.use('/api/users', users);
// Task routes
app.use('/api', taskRoutes);



const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
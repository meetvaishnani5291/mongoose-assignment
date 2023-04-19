const express = require('express');
const morgan = require('morgan')
require('dotenv').config();
require('./config/db')

//importing routes
const userRoutes = require('./src/routes/user.route')
const postRoutes = require('./src/routes/post.route')
const queryRoutes = require('./src/routes/query.route')

const app = express();
app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({extended : false}))

//routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/query', queryRoutes);

//error handler middleware
app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message });
});

//server configuration
const host = process.env.HOST;
const port = process.env.PORT || 3002

app.listen(port, host, () => {
    console.log(`app is listening on http://${host}:${port}`);
})
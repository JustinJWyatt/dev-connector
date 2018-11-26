const express = require('express');
const mongoose = require('mongoose');
const app = express();

const db = require('./config/keys').mongoURI;

mongoose.connect(db).then(() => console.log('mongoose connected')).catch(err => console.log(err));

app.get('/', (req, res) => res.send('test'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`));


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const passport = require('passport');

const db = require('./config/keys').mongoURI;

mongoose.connect('mongodb://abc123:abc123@ds115244.mlab.com:15244/dev-connector', { useNewUrlParser: true }).then(() => console.log('mongodb connected'), (err) => console.log(err));

app.get('/', (req, res) => res.send('test'));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`));


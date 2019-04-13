const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client:'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '44703380',
        database: 'smart-brain'
    }
});
//to access something from the users.then is used after from
db.select('*').from('users').then(data => {
    console.log(data);
})

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin' ,signin.handleSignin(db, bcrypt)(req, res))

//dependency injection
app.post('/register', (req,res) => { register.handleRegister(req ,res, db, bcrypt)});


app.get('/profile/:id', (req,res) => { profile.handleProfileGet(req ,res, db)});

app.put('/image', (req,res) => { image.handleImage(req ,res, db)});

app.post('/imageurl', (req,res) => { image.handleApiCall(req ,res)});

app.listen(process.env.PORT || 3001, () => {
})
//transaction used to do 2 operations at once together
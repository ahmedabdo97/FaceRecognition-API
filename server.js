const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

app.post('/signin' ,(req, res) => {
    db.select('email', 'hash').from('login')
    .where('email','=',req.body.email)
    .then(data =>{
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid) {
            return db.select('*').from('users')
            .where('email', '=',req.body.email)
            .then( user =>  {
                //[0] not to show all but the first pulled that we only need
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
        res.status(400).json('wrong credentials')
    }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})



app.post('/register', (req, res)=>{
    const {email ,name ,password } = req.body;
    let hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
         return  trx('users')
    .returning('*')
    .insert({
        // to return as array not as {''}
        email:loginEmail[0],
        name:name,
        joined: new Date()
    })// after we create we return the user
        .then(user => {
        res.json(user[0]);
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('User Already Exist'));
    
});


app.get('/profile/:id', (req, res) => {
    const { id } = req.params; 
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0])
        }else {
            res.status(400).json('Not found')
        }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3001, () => {
    console.log('app is running on port 3001');
})
//transaction used to do 2 operations at once together
const handleRegister =(req ,res, db, bcrypt)=>{
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
    
}

module.exports = {
    handleRegister:handleRegister
}
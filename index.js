const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./db_moduls');
const server = express();

const sessionConfig = {
    name: 'kaban',
    secret:'kaban like brusya',
    cookie:{
        maxAge:1000 * 30 * 30,
        secure:false,
        httpOnly:true
    },
    resave:false,
    saveUninitialized:false
}

server.use('/', bodyParser.json());
server.use(session(sessionConfig));

server.get('/api/users', protectedLogin, (req, res) => {
    db.getAllUsers()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({ message: "Cannot fetch the data from DB" });
        })
})

server.post('/api/register', (req, res) => {
    const data = req.body;
    const hash = bcrypt.hashSync(data.password);
    data.password = hash;

    db.addUser(data)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({ message: "Cannot add the user to DB" });
        })
})

server.post('/api/login', (req, res) => {
  const credentials = req.body;

  if (credentials.name && credentials.password) {
      db.userLogin(credentials.name)
          .then(user => {
              if (user && bcrypt.compareSync(credentials.password, user.password)) {
                  req.session.user = user;
                  res.status(200).send(`Welcome ${user.name}`)
              } else {
                  res.status(500).json({ error: 'You shall not pass' })
              }
          })
          .catch(err => {
              res.status(500).json({ error: 'You s' })
          })
  } else {
      res.status(500).json({ error: 'Invalid credentials' })
  }
})

server.post('/api/logout', (req, res) => {

  if (req.session && req.session.user) {
      const username = req.session.user.name;
      req.session.destroy()
      res.send(`Bye ${username}`);
  }
});

function protectedLogin(req, res, next) {
    // console.log(req.session)
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(500).json({ error: 'You are not authorized to see this' })
    }
}

server.listen(5000, () => console.log('server is running on port 5000'));
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

/* ### DATABASES AND FUNCTIONS ### */
const m = require('./module_express_server.js');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET_KEY || 'dvelopment']
}));

// default port 8080
var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");


// ### GETs ###

// For checking the databases
// app.get('/db.json', (req, res) => {
//   const usersDB_ = m.usersDB;
//   const urlsDB_ = m.urlsDB;
//   res.json({ usersDB_, urlsDB_ });
// });

app.get("/register", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    res.redirect("http://localhost:8080/urls");
  } else {
    res.render("urls_register");
  }
});

app.get("/login", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    res.redirect("http://localhost:8080/urls");
  } else {
    res.render("urls_login");
  }
});

// Sends user to the form for new shortURL one
app.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    const templateVars = { user: m.usersDB[userID]};
    res.render("urls_new", templateVars);
  } else {
    res.redirect("http://localhost:8080/login");
  }
});

// Sends user to the especific shortURL page
app.get("/urls/:id", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    if (!m.urlsDB[userID].hasOwnProperty(req.params.id)) {
      res.status(403).send(`shortURL not found. Create a new one (<a href="/urls_new">here</a>).`);
    } else {
      const templateVars = {shortURL: req.params.id, longURL: m.urlsDB[userID][req.params.id], user: m.usersDB[userID]};
      res.render("urls_show", templateVars);
    }
  } else {
    res.status(403).send('User not logged! Go back and go to login page (<a href="/login">Login</a>)');
  }
});

// Sends user to the home page (urls_index)
app.get("/urls", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    const templateVars = { user: m.usersDB[userID], urls: m.urlsDB[userID] };
    res.render("urls_index", templateVars);
  } else {
    res.status(403).send('User not logged! Go to <a href="/login">Login</a> or <a href="/register">Register</a> page.');
  }
});

// Sends us to the original longURL
app.get("/u/:id", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    const longURL = m.getLongURL(req.params.id, userID);
    if (longURL) {
      res.redirect("http://" + longURL);
    } else {
      res.status(400).send('Requested url doesn\'t exist. Create a new one (<a href="urls_new">New shortURL</a>)');
    }
  } else {
    res.status(403).send('User not logged! Go back and go to login page (<a href="/login">Login</a>)');
  }
});

app.get("/", (req, res) => {
  res.redirect("http://localhost:8080/urls");
});


// ### POSTs ###

// Receives email and password and
// sets the cookie and redirects to /urls
app.post("/register", (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.status(400).send('Required email and password! Go to register page (<a href="/register">Register</a>).');
  } else if (m.hasUserEmail(req.body.email)) {
    res.status(400).send('Email already registered! Go login page (<a href="/login">Login</a>).');
  } else {
    const userID = m.generateRandomString();
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    m.usersDB[userID] = {"id": userID, "email": req.body.email, "password": hashedPassword};
    req.session.userID = userID;
    res.redirect("http://localhost:8080/urls/");
  }
});

// Checks email, password and set cookie
app.post("/login", (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.status(400).send('Required email and password! Go back to fill in it all.');
  } else if (!m.hasUserEmail(req.body.email)) {
    res.status(403).send('User not registered! Go to register page (<a href="/register">Register</a>).');
  } else if (bcrypt.compareSync(req.body.password, m.usersDB[m.getUserID(req.body.email)].password)) {
    req.session.userID = m.getUserID(req.body.email);
    res.redirect("http://localhost:8080/urls");
  } else {
    res.status(403).send('Invalid password! Try with correct password (<a href="/login">Login</a>)');
  }
});

// Logouts and destroys a session
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("http://localhost:8080/urls");
});


// Delete
app.post("/urls/:id/delete", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    if (m.urlsDB[userID].hasOwnProperty(req.params.id)) {
      delete m.urlsDB[userID][req.params.id];
      res.redirect("http://localhost:8080/urls/");
    } else {
      res.status(403).send(`shortURL not found. Create a new one (<a href="/urls_new">here</a>)`);
    }
  } else {
    res.status(403).send('User not logged! Go back and go to login page (<a href="/login">Login</a>)');
  }
});


// Return the form wiht new longURL
app.post("/urls/:id", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    if (m.urlsDB[userID].hasOwnProperty(req.params.id)) {
      m.urlsDB[userID][req.params.id] = req.body.longURL;
      res.redirect('http://localhost:8080/urls/' + req.params.id);
    } else {
      res.status(403).send(`shortURL not found. Create a new one (<a href="/urls_new">here</a>)`);
    }
  } else {
    res.redirect("http://localhost:8080/urls/");
  }
});

// Define shortURL for each new longURL
app.post("/urls", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    const userURLs = m.urlsDB[userID] || {};
    const shortURL = m.generateRandomString();
    userURLs[shortURL] = req.body.longURL;
    m.urlsDB[userID] = userURLs;

    res.redirect('http://localhost:8080/urls/' + shortURL);
  } else {
    res.status(403).send('User not logged! Go back and go to login page (<a href="/login">Login</a>)');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
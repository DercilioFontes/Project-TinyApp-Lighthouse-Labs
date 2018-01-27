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
app.get('/db.json', (req, res) => {
  const usersDB_ = m.usersDB;
  const urlsDB_ = m.usersDB;
  res.json({ usersDB_, urlsDB_ });
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.get("/login", (req, res) => {
  res.render("urls_login");
});

// Sends us to the form for new shortURL one
app.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    const templateVars = { user: m.usersDB[userID]};
    res.render("urls_new", templateVars);
  } else {
    res.redirect("http://localhost:8080/login");
  }
});

// Sends us to the especific shortURL page
app.get("/urls/:id", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    const templateVars = {shortURL: req.params.id, longURL: m.urlsDB[userID][req.params.id], user: m.usersDB[userID]};
    res.render("urls_show", templateVars);
  } else {
    res.redirect("http://localhost:8080/login");
  }
});

// Sends us to the home page (urls_index)
app.get("/urls", (req, res) => {
  const userID = req.session.userID;
  if (m.hasUser(userID)) {
    const templateVars = { user: m.usersDB[userID], urls: m.urlsDB[userID] };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("http://localhost:8080/login");
  }
});

// Sends us to the original longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = m.getLongURL(req.params.shortURL);
  res.redirect(longURL);
});


// ### POSTs ###

// Receives email and password and
// sets the cookie and redirects to /urls
app.post("/register", (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.sendStatus(400);
  } else if (m.hasUserEmail(req.body.email)) {
    res.sendStatus(400);
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
  if (!m.hasUserEmail(req.body.email)) {
    res.sendStatus(403);
  } else if (bcrypt.compareSync(req.body.password, m.usersDB[m.getUserID(req.body.email)].password)) {
    req.session.userID = m.getUserID(req.body.email);
    res.redirect("http://localhost:8080/urls");
  } else {
    res.sendStatus(403);
  }
});

// Logouts and destroys a session
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("http://localhost:8080/urls/login");
});


// Delete
app.post("/urls/:id/delete", (req, res) => {
  const userID = req.session.userID;
  delete m.urlsDB[userID][req.params.id];
  res.redirect("http://localhost:8080/urls/");
});

// Return the form wiht new longURL
app.post("/urls/:id", (req, res) => {
  urlDataBase[req.params.id] = req.params.longURL;
  res.redirect("http://localhost:8080/urls/");
});

// Defines new shortURL for every update.
app.post("/urls", (req, res) => {
  const userID = req.session.userID;
  const shortURL = m.generateRandomString();
  const userURLs = m.urlsDB[userID] || {};

  // gets the old shortURL (if exists) (undefined if not)
  const oldShortURL = m.getShortURL(req.body.longURL, userURLs);
  if (oldShortURL) {
    delete userURLs[oldShortURL];
    userURLs[shortURL] = req.body.longURL;
  } else {
    userURLs[shortURL] = req.body.longURL;
  }
  m.urlsDB[userID] = userURLs;
  res.redirect('http://localhost:8080/urls/' + shortURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
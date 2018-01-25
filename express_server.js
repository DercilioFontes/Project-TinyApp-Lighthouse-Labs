var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// default port 8080
var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");

function generateRandomString() {
  let randomStr = "";
  const alphabetAndDigits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (var i = 0; i < 6; i++) {
    randomStr += alphabetAndDigits.charAt(Math.floor(Math.random() * alphabetAndDigits.length));
  }
  return randomStr;
}

function hasUserEmail (email) {
  for (let user in users) {
    console.log(users[user].email);
    if (users[user].email === email) {
      return true;
    } else {
      return false;
    }
  }
}

// users DB Format:
// const users = {
//   "userRandomID": {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur"
//   },
//  "user2RandomID": {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: "dishwasher-funk"
//   }
// };
const users = {};

var urlDataBase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let templateVars = {
  urls: urlDataBase
};

app.get("/register", (req, res) => {
  res.render("urls_register");
});

// Let us to form for new one
app.get("/urls/new", (req, res) => {
  res.render("urls_new", templateVars);
});

// Let us to especific page for shortURL
app.get("/urls/:id", (req, res) => {
  // get the long url from the urlDataBase to pass in the render function
  templateVars.shortURL = req.params.id;
  templateVars.url = urlDataBase[req.params.id];
  res.render("urls_show", templateVars);
});

// POST receiving email and password and
// setting the cookie and redirect to /urls
app.post("/register", (req, res) => {

  if(!req.body.email || !req.body.password) {
    res.sendStatus(400);
  } else if (hasUserEmail(req.body.email)) {
    res.sendStatus(400);
  } else {
    const user_id = generateRandomString();
    users[user_id] = {"id": user_id, "email": req.body.email, "password": req.body.password};
    res.cookie('user_id', user_id);
    res.redirect("http://localhost:8080/urls/");
  }
});

// Return the username cookie
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("http://localhost:8080/urls/");
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("http://localhost:8080/urls/");
});

// Let us to the index
app.get("/urls", (req, res) => {
  templateVars.username = req.cookies.username;
  templateVars.user_id = req.cookies.user_id;
  res.render("urls_index", templateVars);
});

// Let us to the original longURL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDataBase[req.params.shortURL];
  res.redirect(longURL);
});

// Delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDataBase[req.params.id];
  res.redirect("http://localhost:8080/urls/");
});

// Return the form wiht new longURL
app.post("/urls/:id", (req, res) => {
  urlDataBase[req.params.id] = req.params.longURL;
  res.redirect("http://localhost:8080/urls/");
});

// Define new shortURL for every update
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  for (let key in urlDataBase) {
    if (urlDataBase[key] === req.body.longURL) {
      delete urlDataBase[key];
      urlDataBase[shortURL] = req.body.longURL;
    } else {
      urlDataBase[shortURL] = req.body.longURL;
    }
  }
  res.redirect('http://localhost:8080/urls/' + shortURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
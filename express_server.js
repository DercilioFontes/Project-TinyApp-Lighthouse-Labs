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

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let templateVars = {
  urls: urlDatabase
};

// Let us to form for new one
app.get("/urls/new", (req, res) => {
  res.render("urls_new", templateVars);
});

// Let us to especific page for shortURL
app.get("/urls/:id", (req, res) => {
  // get the long url from the urlDatabase to pass in the render function
  templateVars.shortURL = req.params.id;
  templateVars.url = urlDatabase[req.params.id];
  res.render("urls_show", templateVars);
});

// Return the username cookie
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("http://localhost:8080/urls/");
});

// Let us to the index
app.get("/urls", (req, res) => {
  // Check if it has username cookie (if not sets 'username')
  if (!req.cookies.username) {
    templateVars.username = 'username';
    res.render("urls_index", templateVars);
  } else {
    templateVars.username = req.cookies.username;
    res.render("urls_index", templateVars);
  }
});

// Let us to the original longURL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// Delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("http://localhost:8080/urls/");
});

// Return the form wiht new longURL
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.params.longURL;
  res.redirect("http://localhost:8080/urls/");
});

// Define new shortURL for every update
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  for (let key in urlDatabase) {
    if (urlDatabase[key] === req.body.longURL) {
      delete urlDatabase[key];
      urlDatabase[shortURL] = req.body.longURL;
    } else {
      urlDatabase[shortURL] = req.body.longURL;
    }
  }
  res.redirect('http://localhost:8080/urls/' + shortURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
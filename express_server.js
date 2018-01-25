var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
var PORT = process.env.PORT || 8080; // default port 8080

function generateRandomString() {
 let randomStr = "";
 const alphabetAnd0_9 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

 for (var i = 0; i < 6; i++) {
  randomStr += alphabetAnd0_9.charAt(Math.floor(Math.random() * alphabetAnd0_9.length));
  }
  return randomStr;
}

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
  };

let templateVars = {
      urls: urlDatabase,
  };

app.get("/urls/new", (req, res) => {
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  // get the long url from the urlDatabase to pass in the render function
  templateVars.shortURL = req.params.id;
  templateVars.url = urlDatabase[req.params.id];
  res.render("urls_show", templateVars);
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("http://localhost:8080/urls/");
});

app.get("/urls", (req, res) => {
  if (!req.cookies.username) {
    templateVars.username = 'username';
    res.render("urls_index", templateVars);
  } else {
    templateVars.username = req.cookies.username;
    res.render("urls_index", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("http://localhost:8080/urls/");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.params.longURL;
  res.redirect("http://localhost:8080/urls/");
});

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
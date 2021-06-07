const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;

//set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const generateRandomString = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const lastIndex = characters.length - 1;
  let result = "";
  for (let i = 6; i > 0; i--) {
    result += characters.charAt(Math.floor(Math.random() * (lastIndex - 0) + 0));
  }
  return result;
}

//route for list of url page
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});
//route for adding new url to the list
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});
//route for redirecting to longURL when clicking on shortURL link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
//route for existing url display page
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});
//post request for new URL
app.post("/urls", (req, res) => {
  const sURL = generateRandomString();
  let lURL = req.body.longURL;
  if (!lURL.includes('http://')) lURL = 'http://' + lURL;
  urlDatabase[sURL] = lURL; 
  res.redirect(`/urls/${sURL}`);
});
//app to listen to defined PORT for receiving request from client
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

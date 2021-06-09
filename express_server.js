const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

//set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {

};

const checkExistingEmail = (str) => {
  if (!Object.keys(users).length) return null;
  for (let u in users) {
    if (users[u].email === str) return users[u];
  }
  return null;
}

const generateRandomString = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const lastIndex = characters.length - 1;
  let result = "";
  for (let i = 6; i > 0; i--) {
    result += characters.charAt(Math.floor(Math.random() * (lastIndex - 0) + 0));
  }
  return result;
}

//route redirection for root page
app.get('/', (req, res) => {
  if(req.cookies["loggedIn"]) res.redirect('/urls');
  res.redirect('/login');
})

//route for list of url page
app.get('/urls', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    loggedIn: req.cookies["loggedIn"] 
  };
  console.log(users);
  res.render('urls_index', templateVars);
});
//route for adding new url to the list
app.get('/urls/new', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    loggedIn: req.cookies["loggedIn"] 
  };
  res.render('urls_new', templateVars);
});
//route for redirecting to longURL when clicking on shortURL link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
//route for existing url display page
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    loggedIn: req.cookies["loggedIn"]
  };
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
//post request for delete
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//post request for edit
app.post("/urls/:shortURL", (req, res) => {
  let lURL = req.body.newURL;
  if (!lURL.includes('http://')) lURL = 'http://' + lURL;
  urlDatabase[req.params.shortURL] = lURL;
  res.redirect('/urls');
});

//get for login page
app.get('/login', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    loggedIn: req.cookies["loggedIn"] 
  };
  res.render('urls_login', templateVars);
})

//set cookie for login
app.post('/login', (req, res) => {
  const e_mail = req.body.email;
  const p_word = req.body.password;
  const ifExist = checkExistingEmail(e_mail);
  if (!ifExist) res.status(403).send("Email does not exist. Try again");
  if (ifExist) {
    if (ifExist.password === p_word) {
      res.cookie('loggedIn', { email: e_mail, password: p_word });
      res.redirect('/urls');
    }
    res.status(403).send("Password does not match. Try again");
  }
})

//clear cookie for logout
app.post('/logout', (req, res) => {
  //adding this for now
  res.clearCookie('loggedIn');
  res.redirect('/urls');
})

//get for register page (/url/register)
app.get('/register', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    loggedIn: req.cookies["loggedIn"] 
  };
  res.render('urls_register', templateVars);
});

//post for register submittion
app.post('/register', (req, res) => {
  const ifExist = checkExistingEmail(req.body.email);
  if(!req.body.email || !req.body.password) res.status(400).send("Do not enter proper email or password");
  if(ifExist) res.status(400).send("Email already exists");
  if(!ifExist) {
    const randomID = generateRandomString();
    const { email, password } = req.body;
    users[randomID] = {
      id: randomID,
      email,
      password,
    }
    res.cookie('user_id', randomID);
    res.redirect('/urls');
  }
})

//app to listen to defined PORT for receiving request from client
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

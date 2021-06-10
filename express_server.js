const express = require("express");
const cookieSession= require('cookie-session');
const alert = require("alert");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const PORT = 8080;

const { checkExistingEmail, generateRandomString } = require('./helpers');

//set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: null },
  "9sm5xK": { longURL: "http://www.google.com", userID: null }
};

const users = {

};

//route redirection for root page
app.get('/', (req, res) => {
  if(req.session['user_id']) res.redirect('/urls');
  res.redirect('/login');
})

//route for list of url page
app.get('/urls', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    loggedIn: users[req.session['user_id']]
  };
  console.log(users);
  console.log(urlDatabase);
  res.render('urls_index', templateVars);
});

//route for adding new url to the list
app.get('/urls/new', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    loggedIn: users[req.session['user_id']]
  };
  if (!templateVars.loggedIn) {
    alert("Please log in to use this feature");
    res.redirect('/login');
  } else {
    res.render('urls_new', templateVars);
  }
});

//route for redirecting to longURL when clicking on shortURL link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//route for existing url display page
app.get('/urls/:shortURL', (req, res) => {
  if(
    req.session['user_id'] && 
    users[req.session['user_id']].id === urlDatabase[req.params.shortURL].userID
    ) {
    const templateVars = { 
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL].longURL,
      loggedIn: users[req.session["user_id"]]
    };
    res.render('urls_show', templateVars);
  } else {
    alert("Login Required Or This is Not Your URL");
    res.redirect('/urls');
  }
});

//post request for new URL
app.post("/urls/new", (req, res) => {
  if(req.session['user_id']) {
    const sURL = generateRandomString();
    let lURL = req.body.longURL;
    if (!lURL.includes('http://')) lURL = 'http://' + lURL;
    urlDatabase[sURL] = { longURL: lURL, userID: users[req.session["user_id"]].id };
    res.redirect(`/urls/${sURL}`);
  } else {
    res.redirect('/urls');
  }
});

//post request for delete
app.post("/urls/:shortURL/delete", (req, res) => {
  if(users[req.session['user_id']].id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  }
});

//post request for edit
app.post("/urls/:shortURL", (req, res) => {
  if(users[req.session['user_id']].id === urlDatabase[req.params.shortURL].userID) {
    let lURL = req.body.newURL;
    if (!lURL.includes('http://')) lURL = 'http://' + lURL;
    urlDatabase[req.params.shortURL].longURL = lURL;
    res.redirect('/urls');
  }
});

//get for login page
app.get('/login', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    loggedIn: users[req.session['user_id']] 
  };
  res.render('urls_login', templateVars);
})

//set cookie for login
app.post('/login', (req, res) => {
  const e_mail = req.body.email;
  const p_word = req.body.password;
  const ifExist = checkExistingEmail(e_mail, users);
  if (!ifExist) {
    alert("Email does not exist.\nPlease Register or Try Again");
    res.status(403).redirect('/login');
  }
  if (ifExist) {
    if (bcrypt.compareSync(p_word, ifExist.password)) {
      req.session['user_id'] = ifExist.id;
      res.redirect('/urls');
    } else {
      alert("Password does not match. Try again");
      res.status(403).redirect('/login')
    }
  }
})

//clear cookie for logout
app.post('/logout', (req, res) => {
  //adding this for now
  req.session['user_id'] = null;
  res.redirect('/urls');
})

//get for register page (/url/register)
app.get('/register', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    loggedIn: users[req.session["user_id"]] 
  };
  res.render('urls_register', templateVars);
});

//post for register submittion
app.post('/register', (req, res) => {
  const ifExist = checkExistingEmail(req.body.email, users);
  if(ifExist) {
    alert("Email already exists. Please try again");
    res.status(400).redirect('/register');
  } else if(!ifExist) {
    if(!req.body.email || !req.body.password) {
      alert("Please enter proper email or password");
      res.status(400).redirect('/register');
    } else {
      const randomID = generateRandomString();
      const { email, password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      users[randomID] = {
        id: randomID,
        email,
        password: hashedPassword
      }
      res.redirect('/urls');
    }
  }
})

//app to listen to defined PORT for receiving request from client
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

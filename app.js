const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));

//CALL BACKS
function getUsers(cb){
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) return cb(err);
    const users = JSON.parse(data);
    return cb(null, users);
  });
}

// We pass getUsers an anon function with err and users as parameters.
// If there is an error, we render an error page, passing the error to the error template. 
// Else if everything goes as expected, render the index page. We also give the template a title. 
// We need to provide the template the user data, so we name the property "users" in reference to the "users" from the index.pug. For the value, we reference "users.users"
// "users" represents the data that users has retrived and passed to us via the above callback function. We are trying to access the "users" [array] through the property "users", which is why we are using "users.users". 
app.get('/', (req,res) => {
  getUsers((err, users) => {
    if (err) {
      res.render('error', {error:err});
    } else {
      res.render('index', {title: "Users", users: users.users})
    }
  });
}); 


app.listen(3000, () => console.log('App listening on port 3000!'));
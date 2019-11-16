const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));

//CALL BACKS
// function getUsers(cb){
//   fs.readFile('data.json', 'utf8', (err, data) => {
//     if (err) return cb(err);
//     const users = JSON.parse(data);
//     return cb(null, users);
//   });
// }

// // We pass getUsers an anon function with err and users as parameters.
// // If there is an error, we render an error page, passing the error to the error template. 
// // Else if everything goes as expected, render the index page. We also give the template a title. 
// // We need to provide the template the user data, so we name the property "users" in reference to the "users" from the index.pug. For the value, we reference "users.users"
// // "users" represents the data that users has retrived and passed to us via the above callback function. We are trying to access the "users" [array] through the property "users", which is why we are using "users.users". 
// app.get('/', (req,res) => {
//   getUsers((err, users) => {
//     if (err) {
//       res.render('error', {error:err});
//     } else {
//       res.render('index', {title: "Users", users: users.users})
//     }
//   });
// }); 

// This Example Uses Promises
// We create a new promise and return it. The new promise takes a callback to execute after its created. Inside this callback we need to perform an asynchronous operation and define what should happen if the action is or isn't successful. 
// To do this, our CB accepts 2 params; resolve and reject. 
// Inside the promise, for our async operation, we need to read the data.json file using nodes FS module. 
// Inside the readFile methods CB, we define the err and data params.
// If error, we reject the promise by calling the reject paramerter method, and pass in the error. 
// Else, if everything is good, we parse the json formatted data and set it to the variable "users". 
// We do this because the "readFile" method gives us the data from the data.json file as a string, so we need to parse it to json. 
// Instead of calling the CB function, we resolve the promise by calling the resolve parameter method, passing it the data. 

// In general, when "getUsers" is called, create a new Promise, read the file, and if reading the file isnt successful, give us the error. If it is successful, give us the data. 
function getUsers() {
  return new Promise((resolve, reject) => {
    fs.readFile('data.json', 'utf-8', (err, data) => {
      if(err) {
        reject(err);
      } else {
        const users = JSON.parse(data);
        resolve(users);
      }
    });
  });
}

// Inside the route, we call the "getUsers" function and chain calls to the "then()" and "catch()" methods. 
// We are basically saying "run this function, then do something else, then maybe something else, and maybe something else after that. When you're done running the chain of functions any errors fall into the "catch()" method. 
// We cant use these methods until "getUsers" returns a promise. 
// .then() method accepts a function, so we pass it an anon function. Inside the function we define param users to gain access to the data provided by "getUsers" (which either provides the data or gives us an error)
// And now that we've called getUsers and have the users (in .then(users)), now we render the page. 
// if getUsers encounters an error, its passed to the catch() method, which accepts a callback to run when errors are caught. We define the parameter for the error, and render the error page. 
app.get('/', (req,res) => {
  getUsers()
    .then((users) => {
      res.render('index' , {title: "Users", users: users.users});
    })
    .catch((err) => {
      res.render('error', {error: err});
    });
});

app.listen(3000, () => console.log('App listening on port 3000!'));
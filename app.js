const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));

// This is our middleware that wraps each of our routes automatically in a "try/catch" block. 
// Takes a callback
// Inside our "asyncHandler" function, we return a function an async function that will serve as our route handlers callback. So it will take the "req, res, next" parameters.
// In our try block, we await whatever function we have passed to the "asyncHandler" w/ the normal route handling parameters. 
// So all we did was create a function that wraps around our normal route handling function. To this function we can pass all the code that we would normally pass in our Express route handler callback. 
// In the catch block, we catch any errors and render out our error page. 
// With this mw, we no longer need to inlcude this error handling code in every single route. 
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err) {
        res.render('error', {error: err});
    }
  }
}

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
// app.get('/', (req,res) => {
//   getUsers()
//     .then((users) => {
//       res.render('index' , {title: "Users", users: users.users});
//     })
//     .catch((err) => {
//       res.render('error', {error: err});
//     });
// });

// Using Async/Await
// We store the value that "getUsers()" returns to a variable. We dont need to change our "getUsers()" function because it already returns a promise needed for "await"
// We use "res.render" to render the information to an html page
// Like the "then()" method, using "await" we are ensuring that the next line of code does not execute until we have our users info. 
// We wrap the code in a try/catch block to handle errors

// Edit: to reduce repepition, we made some middleware above to wrap each of our routes in a "try/catch" block. Hence the commented out code here. 
// app.get('/', async (req,res) => {
//   try {
//     const users = await getUsers();
//     res.render('index' , {title: "Users", users: users.users});
//   } catch(err) {
//     res.render('error', {error: err});
//   }
// });

// We will use the "asyncHandler" middleware from above here, instaed of aboves "try/catch" block. 
// "asyncHandler" will become the callback in our get route. 
// The code we use above in the try/catch block will be the callback from asyncHandler
/**
 * This is a good example of using ASYNC/AWAIT
 */
app.get('/', asyncHandler(async (req, res) => {
  const users = await getUsers();
  res.render('index' , {title: "Users", users: users.users});
}))

app.listen(3000, () => console.log('App listening on port 3000!'));
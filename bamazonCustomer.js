var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// setting some global variables so that they will be accessible globally
var table;
var price;
var pruductSelected;
var quantity;
var quantityPurchased;
var hasBought = false;
var tableLength;

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "",

  // Your password
  password: "",
  database: "bamazon"
});


// setting up the connection to mySQL
connection.connect(function (err) {
  if (err) throw err;
  // this is the main start function declaration
  print();
})


// this function will grab the data that is stored in the MYSQL database
// it will then organize it into a table using the npm cli-table 
function print() {
  // this establishes the table and sets up how it will be organized
  table = new Table({
    head: ["ID", "Products", "Department", "Price", "Stock"],
    colWidths: [20, 20, 20, 20, 20]
  })
  console.log("Selecting all products...\n");
  // this is where the code connects to mySQL and grabs all of the data from the products table
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    tableLength = res.length;
    // Log all results of the SELECT statement and push it into the cli table
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
      )
    }
    // prints the table to the console
    console.log(table.toString());
    // checks to see if the user just made a purchase if they have not run the buy function.
    if (!hasBought) {
      initiate();
    }
    // if they have made a purchase thank them print the item they purchased and how much they spent and the table with the updated quantities
    else {
      console.log(`
Hey thanks for purchasing ${quantityPurchased} ${productSelected} for $${price}!!

you're awesome
      `)
      // calls a function that will send the user back through the prompt
      anotherPurchase();


    }


  })

};
// this is the inquirer function.
// this will ask the user to enter a product number that they are interested in
// it will then ask the user how much they would like to purchase 
// 

function initiate(){
  inquirer
  .prompt({
    name: "initiate",
    type: "confirm",
    message: "would you like to make a purchase?"
  }).then(function(answer){
    if (answer.initiate){
      buy();
    }
    else{
      console.log("have a nice day!")
      connection.end()
    }
  })
}
function buy() {

  inquirer
    .prompt([{
      name: "whichProduct",
      type: "input",
      message: "Please enter the product Id that you wish to purchase",
    }, {
      name: "howMuch",
      type: "input",
      message: "how many would you like to buy?"
    }])
    .then(function (answer) {
      // answer.which product will store the product id 
      // answer.howMuch will store the amount that the user would like to purchase
      var parseId = parseInt(answer.whichProduct);
      var howMuch = parseInt(answer.howMuch);
      // this will check to see if the id number entered is valid and is inside of the data table.
      if (parseId <= tableLength) {

        // connects with the database and grabs the data that is related to the id number entered.
        connection.query("select * from products where ?", [{
            id: parseId
          }],
          function (err, res) {
            var stock = res[0].stock_quantity;
            if (err) throw err;

            // this if statement will check to see if there is enough stock to fulfill the user request
            if (stock >= howMuch) {
              // all this will take the data points from the response and save them in global variables
              price = res[0].price * howMuch;
              productSelected = res[0].product_name;
              quantityPurchased = howMuch;
              quantity = res[0].stock_quantity - howMuch;

              // this will check with the user if the price and quantity is correct and ask them to confirm 
              // if they confirm it will call a function that will thank them and ask if they would like to buy something more
              console.log(`You have selected ${howMuch} ${productSelected} - The total price of your purchase will be $${price}`)
              inquirer.prompt(
                [{
                  type: "confirm",
                  name: "priceConfirm",
                  message: "would you like to make this purchase?"
                }]
              ).then(function (confirmation) {
                if (confirmation.priceConfirm === true) {
                  
                  // calls a function that will handle the update and decrement of quantity and also redirect the user
                  // to the anotherPurchase function
                  decrementAndPrint(parseId, quantity);
                }
                else{
                  print();
                }
              })

            }
            // this is the else that corresponds to the check to for stock quantity
            else {
              console.log("There is insufficient stock to make this purchase")
              anotherPurchase();
            }
          })
      }
      //  this is the else that corresponds to checking if the product id exists
      else {
        console.log("that was an invalid product number");
        anotherPurchase();

      }
    })
}


// called after the user has made a purchase 
// called if the user failed to enter a valid product id
// or if the user changes their mind about a purchase
function anotherPurchase() {

  inquirer.prompt([{
    name: "another",
    message: "would you like to make another purchase?",
    type: "confirm",

  }]).then(function (answer) {

    if (answer.another) {
      hasBought = false;
      buy();
    } else {
      console.log("have a nice day!")
      connection.end()
    }
  })
}


// here all of the logic for updating quantities in the database is handled
function decrementAndPrint(answer, quantity) {
  console.log(answer);
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [{
        stock_quantity: quantity,
      },
      {
        id: answer,
      }
    ],
    function (err, res) {
      if (err) throw err;
    

      hasBought = true;

      print();

    }

  )


}

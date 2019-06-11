var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var table = new Table({
  head: ["ID", "Products", "Department", "Price", "Stock"],
  colWidths: [20, 20, 20, 20, 20]
})

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "jcello69",
  database: "bamazon"
});


connection.connect(function (err) {
  if (err) throw err;
  start();
})

var hasBought = false;

function start() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
      )
    }

    console.log(table.toString());
    if (!hasBought) {
      buy();
    }

  })

};



function buy() {
  inquirer
    .prompt({
      name: "whichProduct",
      type: "input",
      message: "Please enter the product Id that you wish to purchase",
    }).then(function (answer) {

      connection.query("select * from products where ?", [{
        id: answer.whichProduct
      }], function (err, res) {
       console.log(res)
        decrementAndPrint(res, answer);
       
      })



      function decrementAndPrint(res, answer) {
        var decrement = res[0].stock_quantity - 1;
        hasbought = true;
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [{
              stock_quantity: decrement
            },
            {
              id: answer.whichProduct
            }
          ],
          function (err, res) {
            if (err) throw err;
            console.log(res);
          }

        )
      }
    })
}
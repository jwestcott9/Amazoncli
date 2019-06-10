var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var table = new Table({
  head: ["Products", "Department", "Price", "Stock"],
  colWidths: [20,20, 20, 20]
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


connection.connect(function(err){
    if(err) throw err;
    start();
    buy();
})

function start (){
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
for ( var i = 0; i<res.length; i++){
    table.push(
      [res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity] 
    )
  }
    console.log(table.toString());
    connection.end();
  });
    
}
function buy (){
  inquirer
  .prompt({
    name: "whichProduct",
    type: "input",
    message: "which product number are you interested in?",
  }).then(function(answer){
    connection.query(
      console.log(stock_quantity),
      "UPDATE products SET ? Where Id ?",
      [
        {
          stock_quantity: stock_quantity
        },
        {
          id: answer.whichProduct
        }

      ]
     
    )
  })
}
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var table;
var price;
var pruductSelected;
var quantity;
var quantityPurchased;

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
start();

function start() {
  connection.connect(function (err) {
    if (err) throw err;
    print();
  })
}
var hasBought = false;

function print() {
  table = new Table({
    head: ["ID", "Products", "Department", "Price", "Stock"],
    colWidths: [20, 20, 20, 20, 20]
  })
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
    } else {
      console.log(`
Hey thanks for purchasing ${quantityPurchased} ${productSelected}s for $${price}!!

you're awesome
      `)
      anotherPurchase();


    }


  })

};

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
      connection.query("select * from products where ?", [{
          id: parseInt(answer.whichProduct),
        }],
        function (err, res) {
          
          if (err) throw err;

          if (res[0].stock_quantity > answer.howMuch) {
            price = res[0].price * answer.howMuch;
            productSelected = res[0].product_name;
            quantityPurchased = answer.howMuch;
            quantity = res[0].stock_quantity - answer.howMuch;
            console.log(`The total price of your purchase will be $${price}`)
            inquirer.prompt(
              [{
                type: "confirm",
                name: "priceConfirm",
                message: "would you like to make this purchase?"
              }]
            ).then(function (confirmation) {
              if (confirmation.priceConfirm === true) {
               
                decrementAndPrint(answer.whichProduct, quantity);
              }
            })

          } else {
            console.log("There is insufficient stock to make this purchase")
            anotherPurchase();
          }
        })
    })
}

function anotherPurchase() {

  inquirer.prompt([{
    name: "another",
    message: "would you like to make a different purchase?",
    type: "confirm",

  }]).then(function (answer) {

    if (answer.another) {
      hasBought = false;
      print();
    } else {
      console.log("have a nice day!")
      connection.end()
    }
  })
}



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
      console.log(res);

      hasBought = true;

      print();

    }

  )


}
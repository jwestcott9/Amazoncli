drop database if exists bamazon;

create database bamazon;

use bamazon;
CREATE TABLE products (
  id INT NOT NULL auto_increment,
  product_name varchar(100) null,
 department_name varchar(100) null,
  price decimal(10,2) not null,
	stock_quantity INT default 0,
  PRIMARY KEY (id)
);


Insert into products (product_name, department_name, price, stock_quantity)
values ("guitars", "instruments", 1500.50, 3);

Insert into products (product_name, department_name, price, stock_quantity)
values ("candle", "home", 20, 50);

Insert into products (product_name, department_name, price, stock_quantity)
values ("samsung tv", "electronics", 200, 2);

Insert into products (product_name, department_name, price, stock_quantity)
values ("yamaha tv", "electronics", 500, 5);
 
 
Insert into products (product_name, department_name, price, stock_quantity)
values ("mark 5 saxaphone", "instruments", 3000, 1);
 
Insert into products (product_name, department_name, price, stock_quantity)
values ("iphone", "electronics", 1000, 3);
 
Insert into products (product_name, department_name, price, stock_quantity)
values ("couch", "furniture", 250, 7);
 
Insert into products (product_name, department_name, price, stock_quantity)
values ("desk", "furniture", 40, 8);
 
Insert into products (product_name, department_name, price, stock_quantity)
values ("pens", "office", 2, 3000);
 
Insert into products (product_name, department_name, price, stock_quantity)
values ("pencils", "office", 1, 4000);
 
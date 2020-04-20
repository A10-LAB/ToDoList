//jshint esversion:6

// ******* Const Req
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// ******* Technical part for modules
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// ******* Mongo Database

// DB Connection
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

// DB Schema
const itemSchema = 
{
  name: String,
}

// DB Model 
const Item = mongoose.model("Item", itemSchema);

// DB Documents
const item1 = new Item 
({
  name: "Welcome to ToDolist !"
});
const item2 = new Item 
({
  name: "Hit the + to create new item"
});
const item3 = new Item 
({
  name: "<-- Hit this to delete an item"
});

// DB Starting Array 
const defaultArray = [item1, item2, item3]; 

// ******* Core
app.get("/", function(req, res) 
{
  // DB Render to ListPage
  Item.find({}, function (err, foundItems)
  {
    if (foundItems.length === 0)
    {
    // DB Insert
    Item.insertMany(defaultArray, function(err)
    { 
      if (err) 
      {console.log(err);}
      else 
      {console.log("/// DB Insert Done ///")};  
    });
    // Redirect for Array Items Appear in Browser
    res.redirect("/");
    }
    else 
    {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res)
{
  const itemName = req.body.newItem;
  
  // Post DB Documen based on req.body
  const item = new Item 
  ({
    name: itemName
}); 
// Mongoose short save method
item.save();
// Redirection to root to show new post
res.redirect("/"); 
});

app.post("/delete", function(req, res)
{
  console.log(req.body);
});

app.get("/work", function(req,res)
{
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res)
{
  res.render("about");
});

// ******* Listen for Console
app.listen(3000, function() 
{
  console.log("/// Server started on port 3000 ///");
});
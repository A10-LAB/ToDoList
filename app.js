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

// DB Schemes
const itemSchema = 
{
  name: String,
}

const listSchema = 
{
  name: String,
  items: [itemSchema]
}

// DB Models 
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

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
    // Redirect для массива Items чтобы появились в браузере.
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
  
  // Post DB Document based on req.body
  const item = new Item 
  ({
    name: itemName
}); 
// Mongoose короткий метод сохранения
item.save();
// Redirection to root to show new post иначе не сработает
res.redirect("/"); 
});

// Deleted Page 
app.post("/delete", function(req, res)
{
  const checkedItemID = req.body.checkbox;

Item.findByIdAndRemove(checkedItemID, function(err)
{
  if (!err)
  {
    console.log("Deleted item by ID completed");
    res.redirect("/");
  }
  else
  {
    console.log(err);
  }
});  
});

// Проверка если страница существует
app.get("/:customListName", function(req,res)
{
  const customListName = req.params.customListName;
  
  List.findOne({name: customListName}, function(err, foundList)
  {
    if(!err)
    {
      if(!foundList)
      {
        // Create new list
        const list = new List
        ({
          name: customListName,
          items: defaultArray
        });
        list.save();
        // Redirect для того, чтобы отображалось в браузере. Сыылка идет не на root, а на CustomListName, который определяется как переменная через const выше
        res.redirect("/" + customListName);
      }
      else
      {
        // Show existing List. Код добавляет созданное пользователем 
        // название страницы в качестве заголовка (listTitle) и меняет его 
        // на найденное имя через метод foundList,
        // NewListItems из ejs включает в себя все из найденных items 
        res.render("list", {listTitle: foundList.name, newListItems: foundItems})
      }
    }
  }
);
});

// Не помню зачем
app.get("/about", function(req, res)
{
  res.render("about");
});

// ******* Listen for Console
app.listen(3000, function() 
{
  console.log("/// Server started on port 3000 ///");
});
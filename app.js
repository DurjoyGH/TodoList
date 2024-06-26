const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://durjoyghosh328:xWXlDi07bJ0iUGwB@cluster0.kxfmvif.mongodb.net/sharereadsDB&appName=Cluster0");

const itemSchema = {

    name: String

};

const Item = mongoose.model("Item", itemSchema);

const listSchema = {

    name: String,
    items: [itemSchema]

}

const List = mongoose.model("List", listSchema);

const item1 = new Item({

    name: "Welcome!"

});


const item2 = new Item({

    name: "Use + sign to add new book!"

});


const item3 = new Item({

    name: "<-- Click here to delete any book!"

});

const defaultItems = [item1, item2, item3];


app.get("/", function (req, res) {

    Item.find({}).then(function (foundItems) {

        if (foundItems.length === 0) {

            Item.insertMany(defaultItems).then(function () {
                console.log("Successfully added default items!");
            }).catch(function (err) {
                console.log(err);
            });

            res.redirect("/");

        } else {

            res.render("list", { kindOfDay: "Your book list", newItems: foundItems });
        }

    }).catch(function (err) {

        console.log(err);
        res.status(500).send("Error occurred while fetching items.");

    });

});

app.get("/:customListName", function (req, res) {

    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }).then(function (foundList) {

        if (!foundList) {

            const list = new List({

                name: customListName,
                items: defaultItems

            });

            list.save();

            res.redirect("/" + customListName);

        } else {

            res.render("list", { kindOfDay: foundList.name, newItems: foundList.items });

        }
    })

})

app.post("/", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({

        name: itemName

    });

    if (listName === "Your book list") {

        item.save();

        res.redirect("/");

    } else {

        List.findOne({ name: listName }).then(function (foundList) {

            foundList.items.push(item);

            foundList.save();

            res.redirect("/" + listName);

        }).catch(function (err) {

            console.log(err);

        });
    }

})

app.post("/delete", function (req, res) {

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName == "Your book list") {

        Item.findByIdAndDelete(checkedItemId).then(function () {

            console.log("Deleted Successfully!");

            res.redirect("/");

        }).catch(function (err) {

            console.log(err);

        });

    } else {

        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }).then(function (foundList) {

            res.redirect("/" + listName);

        }).catch(function (err) {

            console.log(err);

        })
    }

})

app.listen(3000, function (req, res) {

    console.log("Server running at port 3000");

})
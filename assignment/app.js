const express = require("express");
const mongo = require("mongodb");
const assert = require("assert");

var url = "mongodb://localhost:27017/";

const app = express();
app.set("view engine", "ejs");

app.set(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  var resultArray = [];
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    var dbo = db.db("employeedb");
    var cursor = dbo.collection("todo").find();
    cursor.forEach(
      function (doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
      },
      function () {
        db.close();
        res.render("employeelist", { items: resultArray });
      }
    );
  });
});

//IN CHARDE OF CREATING DYNAMIC URLS
var getUser = function (req, res, next) {
  var eployeeId = req.params.id;
  var performAction = req.params.action;
  res.send("User (" + eployeeId + "): " + performAction);
};
app.get("/todolist/:id", (req, res) => {
  var eployeeId = req.params.id;
  var resultArray = [];
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    var dbo = db.db("employeedb");
    var cursor = dbo.collection("todo").find();
    cursor.forEach(
      function (doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
      },
      function () {
        db.close();
        res.render("todolist", { items: resultArray, key: eployeeId });
      }
    );
  });
});

const port = 9000;

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});

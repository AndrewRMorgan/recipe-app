'use strict';
var express = require('express');
var app = express();
var fs = require('fs');

var dataObj;

app.use(express.static(__dirname + '/views'));

app.set('view engine', 'pug')

app.get('/', index);
app.get('/recipes', index);

app.get(/recipes\/recipe\/((?:\w|%20)+)/, function(req, res) {
  fs.readFile('data/recipes.json', 'utf8', function (err, data) {
    if (err) throw err;
    dataObj = JSON.parse(data);
    var recipe = {};

    for (var i = 0; i < dataObj.recipes.length; i++) {
      if (dataObj.recipes[i].name === req.params[0]) {
        recipe = dataObj.recipes[i];
      }
    }

    if (recipe.name) {
      res.render('recipe', {
        recipe: recipe
      });
    } else {
      res.send("Sorry, this recipe doesn't exist or may have been removed");
    }

  });
})

function index(req, res) {
  fs.readFile('data/recipes.json', 'utf8', function (err, data) {
    if (err) throw err;
    dataObj = JSON.parse(data);
    if (dataObj.recipes.length === 0) {
      res.send("Sorry, we currently have no recipes for you");
    } else {
      res.render('index', {
        dataObj: dataObj.recipes
      });
    }
  });
}

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log('The server is listening on port: ' + port);
});

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/users.js");
const Item = require("./models/item.js");

const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ndbc (node data base connection)

mongoose.connect("mongodb://localhost:27017/8x-pro-t", {
	useNewUrlParser: true,
});

// custom variables

var usern = "";

// get route

app.get("/", function (req, res) {
	res.render("login", { userName: usern });
});

app.get("/login", function (req, res) {
	res.render("login");
});

app.get("/register", function (req, res) {
	res.render("register");
});

app.get("/lg", function (req, res) {
	usern = "";
	console.log("logout session ends here");
	res.redirect("/");
});

// render the chat list for the user ;

app.get("/page1", function (req, res) {
	var elements = [];

	if (usern === "") {
		res.redirect("/login");
	} else {
		Item.find(function (err, element) { //reads global chat
			if (err) {
				console.log(err);
			} else {
				if (element === null) {
					console.log("no");
					var obj = { task: "no chat found" };
					elements.push(obj);
					res.render("page1", { user: usern, elements: elements });
				} else {
					for (var i = 0; i < element.length; i++) {
						elements.push(element[i]);
					}
				}
				console.log("elements_found");
				res.render("page1", { user: usern, elements: elements });
			}
		});
	}
});

// post route

// apend to the items schema

app.post("/page1", function (req, res) {
	const chat = req.body.chat;

	console.log(chat);

	const item = new Item({
		task: chat,
		email: usern,
	});

	if (usern === "") {
		res.redirect("/login");
	} else {
		item.save();// saves the chat in items model
		res.redirect("/page1");
	}
});

// register and login
// very basic login without any google or fb login.

app.post("/register", function (req, res) {
	const email = req.body.username;
	const password = req.body.password;

	const newUser = new User({
		email: email,
		password: password,
	});

	newUser.save(function (err) { 
		if (err) {
			console.log(err);
		} else {
			usern = req.body.username;
			console.log(usern);
			res.redirect("/page1");
		}
	});
});

app.post("/login", function (req, res) {
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({ email: username }, function (err, foundUser) {
		if (err) {
			console.log(err);
			res.redirect("/register");
		} else if (foundUser) {
			if (foundUser.password === password) {
				usern = foundUser.email;
				res.redirect("/page1");
			} else {
				res.redirect("login");
			}
		} else {
			res.redirect("/register");
		}
	});
});

// post route end here

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
	console.log("server started at 3000 port");
});

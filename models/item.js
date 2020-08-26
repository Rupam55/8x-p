const mongoose = require("mongoose");

const ISchema = {
	task: String,
 	email: String,
};

module.exports = mongoose.model("Item", ISchema);

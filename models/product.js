const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	name: String,
	brand: String,
	price: Number,
	color: String,
	size: Array,
	description: String,
	condition: {
		type: String,
		enum: ['new', 'second'],
	},
	stock: Number,
	availability: {
		online: Boolean,
		offline: Boolean,
	},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

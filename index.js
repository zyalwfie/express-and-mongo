const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const app = express();

mongoose
	.connect('mongodb://127.0.0.1/test')
	.then((result) => {
		console.log('Connected to mongo...');
	})
	.catch((err) => {
		console.log(err);
	});

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/products', async (req, res) => {
	const products = await Product.find();

	res.render('products', { products });
});

app.listen(3000, () => {
	console.log('App is running on http://localhost:3000');
});


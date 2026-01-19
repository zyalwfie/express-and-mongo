const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
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

app.use(
	session({
		secret: 'secret',
		resave: false,
		saveUninitialized: true,
	}),
);
app.use(flash());
app.use((req, res, next) => {
	res.locals.successMessage = req.flash('success')[0];
	res.locals.errorMessage = req.flash('error')[0];
	next();
});

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
	res.locals.currentPath = req.path;
	next();
});
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/products', async (req, res) => {
	const products = await Product.find();

	res.render('products', { products });
});

app.get('/products/create', (req, res) => {
	res.render('create-product');
});

app.post('/products', async (req, res) => {
	try {
		const product = await Product.create(req.body);
		req.flash('success', 'Product berhasil disimpan');
		res.redirect(`/products/${product._id}`);
	} catch (err) {
		req.flash('error', 'Gagal menyimpan product');
		res.redirect('/products/create');
	}
});

app.get('/products/:id/edit', async (req, res) => {
	const product = await Product.findById(req.params.id);
	res.render('edit-product.ejs', { product: product });
});

app.get('/products/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).render('miscellanous');
		}

		res.render('show-product', { product });
	} catch (err) {
		res.status(400).render('miscellanous');
	}
});

app.put('/products/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const product = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!product) {
			return res.status(404).render('miscellanous');
		}

		req.flash('success', 'Product berhasil diubah');
		res.redirect(`/products/${product._id}`);
	} catch (err) {
		console.log(err);
		req.flash('error', 'Gagal mengubah product');
		res.redirect(`/products/${req.params.id}/edit`);
	}
});

app.delete('/products/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const product = await Product.findByIdAndDelete(id);

		if (!product) {
			return res.status(404).render('miscellanous');
		}

		req.flash('success', 'Produk berhasil dihapus');
		res.redirect(`/products`);
	} catch (err) {
		console.log(err);
		req.flash('error', 'Gagal menghapus produk');
		res.redirect(`/products`);
	}
});

app.listen(3000, () => {
	console.log('App is running on http://localhost:3000');
});
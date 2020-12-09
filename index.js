const express = require("express");
const morgan = require("morgan");
const app = express();
const request = require("request");
require("dotenv").config();

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

app.get("/", function(req, res) {
	const endpoints = ["/currency/gbp", "/currency/usd"];
	res.status(200).send(JSON.stringify({
		name: "ExchangeAPI",
		version: "v1.0.0",
		author: "Yassin",
		endpoints: endpoints,
	}, null, 3));
});

app.get("/currency", function(req, res) {
	const options = {
		url: `http://data.fixer.io/api/convert?access_key=b772106d3bf69b65246d76bd90dd8988&from=${req.query.from}&to=${req.query.to}&amount=1`,
	};
	request(options, (err, response, data) => {
		if (err) {
			console.log(err);
		}
		else {
			const parsed = JSON.parse(data);
			console.log(parsed)
			res.setHeader("Content-Type", "application/json");
			res.status(200).send(JSON.stringify({
				rates: parsed,
			}, null, 3));
		}
	});
});

app.get("/currency/gbp", function(req, res) {
	const options = {
		url: "http://data.fixer.io/api/latest?access_key=b772106d3bf69b65246d76bd90dd8988&format=1",
	};
	request(options, (err, response, data) => {
		if (err) {
			console.log(err);
		}
		else {
			const all = [];
			const parsed = JSON.parse(data);
			const keys = Object.keys(parsed.rates);
			keys.forEach((el, index) => {
				all.push({
					currency: el,
					rate: parsed.rates[el],
				});
			});
			res.setHeader("Content-Type", "application/json");
			res.status(200).send(JSON.stringify({
				base: "GBP",
				rates: all,
			}, null, 3));
		}
	});
});

app.get("/currency/dollar", function(req, res) {
	const all = [];
	all.push({
		currency: "EGP",
		rate: null,
	});
	res.setHeader("Content-Type", "application/json");
	res.status(200).send(JSON.stringify({
		base: "USD",
		rates: all,
	}, null, 3));
});

app.disable("etag");
const server = app.listen(process.env.PORT || 8080);
const port = server.address().port;
console.log("App now running on port", port);

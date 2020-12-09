const express = require("express");
const morgan = require("morgan");
const app = express();
const request = require("request");
require("dotenv").config();

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

app.get("/", function(req, res) {
	const endpoints = ["/currency?from=<currency>&to=<currency>", "/currency/gbp", "/currency/usd"];
	res.status(200).send(JSON.stringify({
		name: "ExchangeAPI",
		version: "v1.0.0",
		author: "Yassin",
		endpoints: endpoints,
	}, null, 3));
});

app.get("/currency", function(req, res) {
	const options = {
		url: `https://api.exchangerate.host/convert?from=${req.query.from}&to=${req.query.to}`,
	};
	request(options, (err, response, data) => {
		if (err) {
			console.log(err);
		}
		else {
			const parsed = JSON.parse(data);
			res.setHeader("Content-Type", "application/json");
			res.status(200).send(JSON.stringify({
				from: parsed.query.from.
				to: parsed.query.to,
				rates: parsed.result,
			}, null, 3));
		}
	});
});

app.get("/currency/gbp", function(req, res) {
	const options = {
		url: "https://api.exchangerate.host/latest",
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

app.get("/currency/usd", function(req, res) {
	const options = {
		url: "https://api.exchangerate.host/latest?base=USD",
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
				base: "USD",
				rates: all,
			}, null, 3));
		}
	});
});

app.disable("etag");
const server = app.listen(process.env.PORT || 8080);
const port = server.address().port;
console.log("App now running on port", port);

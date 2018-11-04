const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const qs = require("qs");
const mime = require("mime-types");

const transform = require("./transform");
const cache = require("./cache");
const images = require("./images");

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan("dev"));

// 3rd party middleware
app.use(
	cors({
		exposedHeaders: ["Link"]
	})
);

app.use(bodyParser.json());

// connect to db
app.use("/", (req, res, next) => {
	let image = req.path;
	let opts = req.query;
	let extname = opts.format
		? "." + mime.extension(mime.lookup(opts.format))
		: path.extname(image);

	try {
		res.type(mime.contentType(extname));

		if (cache.hasImage(image, opts)) {
			cache.createReadStream(image, opts).pipe(res);
		} else if (images.hasImage(image)) {
			let imageStream = images.createReadStream(image);
			let transformStream = imageStream.pipe(transform(opts));

			transformStream.pipe(cache.createWriteStream(image, opts));
			transformStream.pipe(res);
			console.log(
				"Rendered",
				image,
				"with",
				qs.stringify(opts, { delimiter: " " }),
				"to",
				cache.getCachePath(image, opts)
			);
		} else {
			res.status(404).end();
		}
	} catch (err) {
		next(err);
	}
});

app.server.listen(process.env.NODE_PORT || process.env.PORT || 8080, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

module.exports = app;
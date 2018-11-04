const fs = require("fs");
const path = require("path");
const qs = require("qs");
const crypto = require("crypto");
const mkdirp = require("mkdirp");
const mime = require("mime-types");

const CACHE_DIR = path.resolve(process.cwd(), process.env.CACHE_DIR || "cache");

if (!fs.existsSync(CACHE_DIR)) {
	mkdirp.sync(CACHE_DIR);
}

function getCachePath(image, opts = {}) {
	let hash = crypto.createHash("sha256");

	hash.update(image);
	if (Object.keys(opts).length) {
		hash.update(qs.stringify(opts));
	}

	let extname = opts.format
		? "." + mime.extension(mime.lookup(opts.format))
		: path.extname(image);

	return path.join(CACHE_DIR, hash.digest("hex") + extname);
}

function createWriteStream(image, opts) {
	return fs.createWriteStream(getCachePath(image, opts));
}

function createReadStream(image, opts) {
	return fs.createReadStream(getCachePath(image, opts));
}

function hasImage(image, opts = {}) {
	let cacheFile = getCachePath(image, opts);

	return fs.existsSync(cacheFile);
}

module.exports = {
	createWriteStream,
	createReadStream,
	hasImage,
	getCachePath
};

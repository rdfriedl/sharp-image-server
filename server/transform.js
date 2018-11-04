const sharp = require("sharp");

function transform(opts = {}) {
	let transform = sharp();
	let { width, height, format } = opts;

	width = parseInt(width) || null;
	height = parseInt(height) || null;

	if (format) {
		transform.toFormat(format);
	}

	if (width || height) {
		transform.resize(width, height);
	}

	return transform;
}

module.exports = transform;

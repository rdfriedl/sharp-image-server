const sharp = require("sharp");

function transform(opts = {}) {
	let transform = sharp();
	let { width, height, format, fit, background, position, greyscale } = opts;

	width = parseInt(width) || null;
	height = parseInt(height) || null;

	if (format) {
		transform.toFormat(format);
	}

	if (width || height) {
		// fix weired spelling of center
		if (fit === "center") {
			fit = "centre";
		}
		if (position === "center") {
			position = "centre";
		}

		transform.resize(width, height, {
			fit,
			background,
			position
		});
	}

	if (greyscale) {
		transform.greyscale();
	}

	return transform;
}

module.exports = transform;

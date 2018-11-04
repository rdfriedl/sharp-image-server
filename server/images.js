const fs = require("fs");
const path = require("path");

const IMAGE_DIR = path.resolve(
	process.cwd(),
	process.env.IMAGE_DIR || "images"
);

if (!fs.existsSync(IMAGE_DIR)) {
	fs.mkdirSync(IMAGE_DIR);
}

function createReadStream(image) {
	let imagePath = path.join(IMAGE_DIR, image);

	if (!fs.existsSync(imagePath)) {
		throw new Error("Image dose not exist");
	}

	return fs.createReadStream(imagePath);
}

function hasImage(image) {
	let imagePath = path.join(IMAGE_DIR, image);

	return fs.existsSync(imagePath);
}

module.exports = {
	createReadStream,
	hasImage
};

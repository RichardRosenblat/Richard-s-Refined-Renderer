import { PNG } from "pngjs";
import fs from "fs";
import { IImageParser } from "../../types/IImageParser";
import { ImageMatrix, Pixel } from "../../types/ImageMatrix";

/**
 * Image parser for PNG images using pngjs library
 */
export class PngJsParser implements IImageParser {

	/**
	 * Parses PNG image file
	 * @param fileName - file name
	 * @returns image matrix
	 */
	public parse(fileName: string): ImageMatrix {
		const imageBuffer = fs.readFileSync(fileName);
		return this.getImagePixels(imageBuffer);
	}

	/**
	 * Saves image matrix to PNG file
	 * @param fileName - file name
	 * @param image - image matrix
	 */
	public save(fileName: string, image: ImageMatrix): void {
		const png = new PNG({ width: image[0].length, height: image.length });

		this.fillPNGBuffer(png, image);

		const buffer = PNG.sync.write(png);
		fs.writeFileSync(fileName, buffer);
	}

	/**
	 * Fills PNG buffer with image matrix data
	 * @private
	 * @param png - PNG object
	 * @param image - image matrix
	 * @returns void
	 * */
	private fillPNGBuffer(png: PNG, image: ImageMatrix): void {
		for (let y = 0; y < png.height; y++) {
			for (let x = 0; x < png.width; x++) {
				const [r, g, b, a] = image[y][x];
				const index = (png.width * y + x) * 4;
				png.data[index] = r;
				png.data[index + 1] = g;
				png.data[index + 2] = b;
				png.data[index + 3] = a;
			}
		}
	}

	/**
	 * Gets image pixels from buffer
	 * @private
	 * @param buffer - image buffer
	 * @returns image matrix
	 */
	private getImagePixels(buffer: Buffer): ImageMatrix {
		const png = PNG.sync.read(buffer);
		const data = png.data;
		const pixels: Pixel[][] = [];
		for (let y = 0; y < png.height; y++) {
			const row: Pixel[] = [];
			for (let x = 0; x < png.width; x++) {
				const index = (png.width * y + x) * 4;
				const r = data[index];
				const g = data[index + 1];
				const b = data[index + 2];
				const a = data[index + 3];
				row.push([r, g, b, a]);
			}
			pixels.push(row);
		}
		return pixels;
	}
}

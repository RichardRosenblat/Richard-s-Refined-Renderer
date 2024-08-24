import { ImageFormatsEnum } from "../enums/imageFormats";
import { SolverMethodsEnum } from "../enums/solverMethods";
import { getImageParser } from "../factories/imageParserFactory";
import { getMazeSolver } from "../factories/mazeSolverFactory";
import { IImageParser } from "../types/IImageParser";
import { IMazeSolver } from "../types/IMazeSolver";
import { Image } from "../types/image";

export class Maze {
	private solver: IMazeSolver;
	private parser: IImageParser;
	private image?: Image;
	private solvedImage?: Image;
	private fileName?: string;

	constructor(reader: IImageParser, solver: IMazeSolver) {
		this.parser = reader;
		this.solver = solver;
	}

	public static create(forFormat?: ImageFormatsEnum, method?: SolverMethodsEnum): Maze {
		const reader = getImageParser(forFormat || ImageFormatsEnum.PNG);
		const solver = getMazeSolver(method || SolverMethodsEnum["BINARY-TREE-LEFT"]);
		return new Maze(reader, solver);
	}

	public loadImage(fileName: string): Maze {
		this.fileName = fileName;
		this.image = this.parser.parse(fileName);
		return this;
	}

	public solve(): Maze {
		if (!this.image) throw new Error("No image loaded");
		this.solvedImage = this.solver.solve(this.image);
		return this;
	}

	public save(fileName: string | undefined = this.fileName): void {
		if (!fileName || !this.image) throw new Error("No image loaded");
		this.parser.save(fileName, this.solvedImage || this.image);
	}
}

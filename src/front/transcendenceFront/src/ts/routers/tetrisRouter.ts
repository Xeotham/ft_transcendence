// @ts-ignore
import page from 'page';
import {loadTetrisPage} from "../tetris/tetris.ts";

export const tetrisRouter = () => {
	page("/tetris", () => loadTetrisPage("idle"));
}
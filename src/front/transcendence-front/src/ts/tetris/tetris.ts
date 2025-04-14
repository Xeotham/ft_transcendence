import { getMinoColor, keys, loadTetrisArgs, loadTetrisType, minoSize, setKey, tetrisGame } from "./utils.ts";
import { loadTetrisHtml } from "./htmlPage.ts";
// @ts-ignore
import page from "page"
import { arcadeGame, searchGame } from "./gameManagement.ts";

export const userKeys = new keys();
export const tetrisGameInfo = new tetrisGame();

export const   loadTetrisPage = (page: loadTetrisType, arg: loadTetrisArgs | null = null) => {
	switch (page) {
		case "idle":
			return idlePage();
		case "setting":
			return settingPage();
		case "keybindings":
			return keybindsPage(arg!);
		case "board":
			return drawBoard();
	}
}

const   idlePage = () => {
	loadTetrisHtml("idle");

	document.getElementById("home")?.addEventListener("click", () => page.show("/"));
	document.getElementById("setting")?.addEventListener("click", () => loadTetrisPage("keybindings", { keys: userKeys }));
	document.getElementById("matchmaking")?.addEventListener("click", () => searchGame())
	document.getElementById("arcade")?.addEventListener("click", () => arcadeGame());
}

const   settingPage = () => {
	loadTetrisHtml("setting");

	document.getElementById("idle")?.addEventListener("click", () => loadTetrisPage("idle"));
	document.getElementById("keybindings")?.addEventListener("click", () => loadTetrisPage("keybindings", { keys: userKeys }));

}

const  keybindsPage = (keys: loadTetrisArgs) => {
	loadTetrisHtml("keybindings", keys);

	document.getElementById("idle")?.addEventListener("click", () => loadTetrisPage("idle"));
	document.getElementById("keybindings")?.addEventListener("click", () => loadTetrisPage("keybindings", { keys: userKeys }));

	document.getElementById("moveLeft")?.addEventListener("click", () => changeKeys("moveLeft"));
	document.getElementById("moveRight")?.addEventListener("click", () => changeKeys("moveRight"));
	document.getElementById("rotClock")?.addEventListener("click", () => changeKeys("rotClock"));
	document.getElementById("rotCountClock")?.addEventListener("click", () => changeKeys("rotCountClock"));
	document.getElementById("rot180")?.addEventListener("click", () => changeKeys("rot180"));
	document.getElementById("hardDrop")?.addEventListener("click", () => changeKeys("hardDrop"));
	document.getElementById("softDrop")?.addEventListener("click", () => changeKeys("softDrop"));
	document.getElementById("hold")?.addEventListener("click", () => changeKeys("hold"));
	document.getElementById("forfeit")?.addEventListener("click", () => changeKeys("forfeit"));
}

let  modify: boolean = false;

const changeKeys = (keyType: string) => {
	if (modify)
		return ;
	document.getElementById(keyType)!.innerText = "Press a key";

	modify = true;

	const getNewKey = (event: KeyboardEvent) => {
		const newKey = event.key;
		modify = false;
		setKey(keyType, newKey);
		console.log("New key set:", newKey);
		document.removeEventListener("keydown", getNewKey);
		document.getElementById(keyType)!.innerText = newKey === ' ' ? "Space" : newKey;
	}

	document.addEventListener("keydown", getNewKey);
}

const   drawBoard = () => {
	loadTetrisHtml("board");

	const canvas = document.getElementById("gameCanvas")  as HTMLCanvasElement;
	const c = canvas?.getContext("2d") as CanvasRenderingContext2D;
	const game = tetrisGameInfo.getGame();

	if (!c || !game)
		return;
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.beginPath();

	for (let y = game.matrix.length - 1; y > 15; --y) {
		for (let x = 0; x < game.matrix[y].length; ++x) {
			c.fillStyle = getMinoColor(game.matrix[y][x].texture);
			c.fillRect(x * minoSize, y * minoSize - 15 * minoSize , minoSize, minoSize);
		}
	}
}

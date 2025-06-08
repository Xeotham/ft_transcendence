import { Game, score, buttons, intervals, responseFormat, pongSfxPlayer } from "./utils.ts";
import { address, postToApi, user } from "../utils.ts";
import { loadPongPage, pongGameInfo } from "./pong.ts";
import { tourMessageHandler } from "./tournament.ts";
import { hideZoneGame, zone } from "../zone/zoneCore.ts";
// @ts-ignore
import  page from "page";
// @ts-ignore
import { loadPongHtml } from "./pongHTML.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { TCS } from "../TCS.ts";


export class PongRoom {
	private roomNumber: number;
	private game: Game | null;
	private player: string | "P1" | "P2" | "SPEC" | null;
	private socket: WebSocket | null;
	private score: score;
	private isSolo: boolean;
	private isBot: boolean;
	private isButtonPressed: buttons;
	private intervals: intervals;
	private queueInterval: number | null;
	private specPlacement: number;


	constructor(socket: WebSocket, isSolo: boolean = false, isBot: boolean = false) {
		this.roomNumber = -1;
		this.game = null;
		this.player = null;
		this.socket = socket;
		this.score = { player1: 0, player2: 0 };
		this.isSolo = isSolo;
		this.isBot = isBot;
		this.isButtonPressed = { "ArrowUp": false, "ArrowDown": false, "KeyS": false, "KeyX": false };
		this.intervals = { "ArrowUp": null, "ArrowDown": null, "KeyS": null, "KeyX": null };
		this.queueInterval = null;
		this.specPlacement = -1;
	}
	// Getters
	getRoomNumber(): number { return this.roomNumber; }
	getGame(): Game | null { return this.game; }
	getPlayer(): string | null { return this.player; }
	getSocket(): WebSocket | null { return this.socket; }
	getScore(): score { return this.score; }
	getIsSolo(): boolean { return this.isSolo; }
	getIsBot(): boolean { return this.isBot; }
	getQueueInterval(): number | null { return this.queueInterval; }
	getMatchType(): string { return "PONG"; }
	getSpecPlacement(): number { return this.specPlacement; }
	getIsButtonPressed(idx: string): boolean | undefined {
		switch (idx) {
			case "ArrowUp":
				return this.isButtonPressed.ArrowUp;
			case "ArrowDown":
				return this.isButtonPressed.ArrowDown;
			case "KeyS":
				return this.isButtonPressed.KeyS;
			case "KeyX":
				return this.isButtonPressed.KeyX;
			default:
				return undefined;
		}
	}
	getIntervals(idx: string): number | null | undefined {
		switch (idx) {
			case "ArrowUp":
				return this.intervals.ArrowUp;
			case "ArrowDown":
				return this.intervals.ArrowDown;
			case "KeyS":
				return this.intervals.KeyS;
			case "KeyX":
				return this.intervals.KeyX;
			default:
				return undefined;
		}
	}

	// Setters
	setRoomNumber(roomNumber: number): void { this.roomNumber = roomNumber; }
	setGame(game: Game | null): void { this.game = game; }
	setPlayer(player: string | "P1" | "P2" | "SPEC" | null): void { this.player = player; }
	setSocket(socket: WebSocket | null): void { this.socket = socket; }
	setScore(score: score): void { this.score = score; }
	setIsSolo(isSolo: boolean): void { this.isSolo = isSolo; }
	setIsBot(isBot: boolean): void { this.isBot = isBot; }
	setQueueInterval(queueInterval: number | null): void { this.queueInterval = queueInterval; }
	setSpecPlacement(specPlacement: number): void { this.specPlacement = specPlacement; }
	setButtonPressed(idx: string, value: boolean): void {
		switch (idx) {
			case "ArrowUp":
				this.isButtonPressed.ArrowUp = value;
				return ;
			case "ArrowDown":
				this.isButtonPressed.ArrowDown = value;
				return ;
			case "KeyS":
				this.isButtonPressed.KeyS = value;
				return ;
			case "KeyX":
				this.isButtonPressed.KeyX = value;
				return ;
		}
	}
	setIntervals(idx: string, value: number | null): void {
		switch (idx) {
			case "ArrowUp":
				this.intervals.ArrowUp = value;
				return ;
			case "ArrowDown":
				this.intervals.ArrowDown = value;
				return ;
			case "KeyS":
				this.intervals.KeyS = value;
				return ;
			case "KeyX":
				this.intervals.KeyX = value;
				return ;
		}
	}
	clearIntervals() {
		clearInterval(this.queueInterval as number);
		this.queueInterval = null;
		clearInterval(this.intervals["ArrowUp"] as number);
		this.intervals["ArrowUp"] = null;
		clearInterval(this.intervals["ArrowDown"] as number);
		this.intervals["ArrowDown"] = null;
		clearInterval(this.intervals["KeyS"] as number);
		this.intervals["KeyS"] = null;
		clearInterval(this.intervals["KeyX"] as number);
		this.intervals["KeyX"] = null;
	}

	// Methods
	initSocket() {
		if (!this.socket)
			return ;
		this.socket.addEventListener("error", (error) => { console.error(error); });
		this.socket.onopen = () => { console.log("Connected to the server"); };
		this.socket.onclose = () => {
			console.log("Connection closed");
			quit(pongGameInfo.getRoom()?.getQueueInterval() ? "QUEUE_TIMEOUT" : "LEAVE");
		};

		this.socket.addEventListener("message", messageHandler);

		window.onunload = () => {
			try {
				postToApi(`http://${address}/api/user/disconnect-user`, {username: user.getUsername()});
				if (this.socket) {
					quit("LEAVE", "TOURNAMENT");
					this.socket.close();
				}
			}
			catch(error) {
				return ;
			}
		}
		// Special handling for Chrome
		localStorage.setItem("nav", JSON.stringify(navigator.userAgent.includes("Firefox")));
		if (!navigator.userAgent.includes("Firefox")) {
			window.onbeforeunload = (e) => {
				postToApi(`http://${address}/api/user/disconnect-user`, { username: user.getUsername() }).catch();
				quit("LEAVE", "TOURNAMENT");
				e.preventDefault();
				return '';
			};
		}
	}

	prepareGame(roomId: number, player: string | null) {
		this.setRoomNumber(roomId);
		this.setPlayer(player);
		console.log("Joined room: " + roomId + " as player: " + player);
	}
}

export const    createPrivateRoom = () => {
	const   socket = new WebSocket(`ws://${address}/api/pong/createPrivateRoom?username=${user.getUsername()}`);

	pongGameInfo.setRoom(new PongRoom(socket));
	pongGameInfo.getRoom()?.initSocket();
}

export const    joinPrivRoom = () => {
	loadPongPage("priv-room-code");

	const form = document.getElementById("inviteForm") as HTMLFormElement;
	form?.addEventListener("submit", (event) => {
		event.preventDefault(); // Prevent the page from reloading

		const inviteCode = (document.getElementById("inviteCode") as HTMLInputElement).value;
		if (!inviteCode) {
			console.error("Invite code is required");
			return;
		}
		const socket = new WebSocket(`ws://${address}/api/pong/joinPrivRoom?inviteCode=${inviteCode}&username=${user.getUsername()}`);
		pongGameInfo.setRoom(new PongRoom(socket));
		pongGameInfo.getRoom()?.initSocket();
	});
}

export const   joinMatchmaking = async () => {
	const   socket = new WebSocket(`ws://${address}/api/pong/joinMatchmaking?username=${user.getUsername()}`);

	pongGameInfo.setRoom(new PongRoom(socket));
	pongGameInfo.getRoom()?.initSocket();
	loadPongPage("match-found");
}

export const   joinSolo = async () => {
	const   socket = new WebSocket(`ws://${address}/api/pong/joinSolo`);

	pongGameInfo.setRoom(new PongRoom(socket, true));
	pongGameInfo.getRoom()?.initSocket();
}

export const   joinBot = async () => {
	const   socket = new WebSocket(`ws://${address}/api/pong/joinBot?username=${user.getUsername()}`);

	pongGameInfo.setRoom(new PongRoom(socket, false, true));
	pongGameInfo.getRoom()?.initSocket();
}

export const   quit = (msg: string = "LEAVE", force: string = "", winner: number | null = null) => {
	const   matchType = force !== "" ? force : pongGameInfo.getMatchType();

	if (matchType != null)
		console.log("Quiting room of type: " + matchType);
	if (!matchType)
		return ;
	quitRoom(msg);
	if (matchType === "TOURNAMENT") {
		quitTournament(msg, winner);
		return ;
	}

	if (pongGameInfo.getMatchType() === "TOURNAMENT" && matchType === "PONG") {
		loadPongPage("match-found")
	}

}

const   quitRoom = (msg: string = "LEAVE") => {
	if (!pongGameInfo.getRoom())
		return;

	const   roomId = pongGameInfo.getRoom()?.getRoomNumber();
	const   player = pongGameInfo.getRoom()?.getPlayer();
	const   specPlacement = pongGameInfo.getRoom()?.getSpecPlacement();

	if (pongGameInfo.getRoom()?.getIsSolo() || pongGameInfo.getMatchType() === "TOURNAMENT")
		msg = "LEAVE";
	if (msg === "QUEUE_TIMEOUT")
		console.log("You took too long to confirm the game. Back to the lobby");
	fetch(`http://${address}/api/pong/quitRoom`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ matchType: "PONG", message: msg, roomId: roomId, P: player, specPlacement: specPlacement })
	});
	pongGameInfo.getRoom()?.clearIntervals();
	const socket = pongGameInfo.getRoom()?.getSocket();
	if (socket && pongGameInfo.getMatchType() === "PONG") {
		console.log("Connection closed");
		socket.onclose = null; // Remove any existing onclose handler
		socket.close();
	}
	pongGameInfo.resetRoom();
	page.show("/pong");
}

const quitTournament = (msg: string = "LEAVE", winner: number | null) => {
	const socket = pongGameInfo.getTournament()?.getSocket();
	const tournamentId = pongGameInfo.getTournament()?.getId();
	const tourPlacement = pongGameInfo.getTournament()?.getPlacement();

	console.log("Quiting tournament: " + tournamentId);

	fetch(`http://${address}/api/pong/quitRoom`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ matchType: "TOURNAMENT", message: msg, tourId: tournamentId, tourPlacement: tourPlacement })
	});
	if (socket) {
		console.log("Connection closed");
		socket.onclose = null; // Remove any existing onclose handler
		socket.close();
		if (zone.state === "PONG")
			loadPongPage("idle");
	}
	pongGameInfo.resetTournament();
	console.log("Leaving tournament");
	if (winner)
		loadPongPage("tournament-end", { winner: winner });
}

export const   messageHandler = (event: MessageEvent)=> {
	let res: responseFormat = JSON.parse(event.data);

	if (!res)
		return;
	switch (res.type) {
		case 'INFO':
			console.log("%c[INFO]%c : " + res.message, "color: green", "color: reset");
			if (res.data)
				console.log("data: " + res.data);
			return ;
		case "ALERT":
			return console.log("%c[" + res.type + "]%c : " + res.message, "color: red", "color: reset");
		case "ERROR":
			//fallthrough
		case "WARNING":
			return console.log("%c[" + res.type + "]%c : " + res.message, "color: red", "color: reset");
		case "CONFIRM":
			return confirmGame();
		case "LEAVE":
			quit("LEAVE", res.data ? res.data : pongGameInfo.getMatchType(), res.winner);
			if (res.message === "QUEUE_AGAIN") {
				console.log("The opponent took too long to confirm the game. Restarting the search");
				if (res.data === "PONG")
					joinMatchmaking();
			}
			return ;
		case "GAME":
			return gameMessageHandler(res);
		case "TOURNAMENT":
			return tourMessageHandler(res);
		default:
			console.log("Unknown message type: " + res.type);
	}
}

const   effectHandler = (effect: string) => {
	switch (effect) {
		case "hitPaddle":
			pongSfxPlayer.play("hitPaddle");
			return ;
		case "hitOpponentPaddle":
			pongSfxPlayer.play("hitOpponentPaddle");
			return ;
		case "goal":
			pongSfxPlayer.play("goal");
			return ;
	}
}

const   showWinner = (winner: string) => {
	const   endGameDiv = document.getElementById("pongEndGame") as HTMLDivElement;

	if (!endGameDiv) {
		hideZoneGame()
		return;
	}

	endGameDiv.style.display = "block";

	endGameDiv.innerHTML = `
		<div id="tetrisStatsDetailText" class="${TCS.modaleStatDetail}">
			<div class="${TCS.modaleTitre} text-center">GAME OVER</div>
			<div class="h-[15px]"></div>
			<div class="${TCS.tetrisEndGameScore}">Winner: ${winner}</div>
			<div class="h-[30px]"></div>
			<div id="returnHome" class="${TCS.tetrisEndGameButton}">
				${imTexts.tetrisBoardReturnToMenu}
			</div>
		</div>
	`

	document.getElementById("returnHome")?.addEventListener("click", () => {
		hideZoneGame();
	})
}

const	gameMessageHandler = (res: responseFormat) => {
	switch (res.message) {
		case "PREP":
			const   roomNumber: number = typeof res.roomId === "number" ? res.roomId : -1;
			const   player: string | null = res.player;

			return  pongGameInfo.getRoom()?.prepareGame(roomNumber, player);
		case "START":
			loadPongHtml("board");
			document.getElementById("pongEndGame")!.style.display = "none";
			if (pongGameInfo?.getRoom()?.getPlayer() === "SPEC")
				return ;
			document.addEventListener("keydown", keyHandler);
			document.addEventListener("keyup", keyHandler);

			return ;
		case "FINISH":
			if (pongGameInfo.getRoom()?.getPlayer() === "SPEC") {
				showWinner(res.data);
				return quit("LEAVE", "PONG");
			}
			document.removeEventListener("keydown", keyHandler);
			document.removeEventListener("keyup", keyHandler);
			if (pongGameInfo.getMatchType() === "TOURNAMENT" && res.data !== pongGameInfo.getRoom()?.getPlayer())
				pongGameInfo.getTournament()?.setLostTournament(true);
			showWinner(res.data);
			// console.log(res);
			return quit("LEAVE", "PONG");
		case "SCORE":
			const   score: score = res.data;
			pongGameInfo.getRoom()?.setScore(score);
			console.log("%c[Score]%c : " + score.player1 + " - " + score.player2, "color: purple", "color: reset");
			if (document.getElementById("score"))
				document.getElementById("score")!.innerText = `Score: ${score.player1} | ${score.player2}`;
			return ;
		case "PRIVOWNER":
			console.log("Invite code: " + res.inviteCode);
			return loadPongPage("priv-room-create", { inviteCode: res.inviteCode!});
		case "SPEC":
			if (res.data >= 0)
				pongGameInfo.getRoom()?.setSpecPlacement(res.data);
			pongGameInfo?.getRoom()?.setRoomNumber(res?.roomId!);
			console.log("Starting Spectator mode");
			// console.log("Starting Spectator mode at placement: " + pongGameInfo.getRoom()?.getSpecPlacement());
			loadPongPage("board");
			document.getElementById("pongEndGame")!.style.display = "none";
			return document.getElementById("quit")?.addEventListener("click", () => quit());
		case "EFFECT":
			effectHandler(res.data);
			return ;
		default:
			pongGameInfo?.getRoom()?.setGame(res.data);
			loadPongPage("board", { game: res.data });
	}
}

export const keyHandler = (event: KeyboardEvent) => {
	const   game = pongGameInfo.getRoom()?.getGame();
	const   roomNumber = pongGameInfo.getRoom()?.getRoomNumber() as number;
	const   player = pongGameInfo.getRoom()?.getPlayer();
	const   isSolo = pongGameInfo.getRoom()?.getIsSolo();

	if (!game || roomNumber < 0 || !player || event.repeat)
		return ;

	if (event.code === "Escape") {
		quit();
		hideZoneGame();
	}

	async function sendPaddleMovement(key: string, p: string) {
		if (!game)
			return ;
		const paddle = p === "P1" ? game.paddle1 : game.paddle2;

		if (key !== "ArrowUp" && key !== "ArrowDown" && key !== "KeyS" && key !== "KeyX")
			return ;
		let direction = "";
		if (key === "ArrowUp" || key === "ArrowDown")
			direction = key === "ArrowUp" ? "up" : "down";
		if (isSolo && (key === "KeyS" || key === "KeyX"))
			direction = key === "KeyS" ? "up" : "down";

		if (direction === "" || (direction === "up" &&  paddle.y <= 0) || (direction === "down" && paddle.y >= 400 - 80))
			return;
		fetch(`http://${address}/api/pong/movePaddle`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({roomId: roomNumber, P: p, key: direction})
		})
	}

	let p = player;
	if (isSolo)
		p = event.code === "KeyS" || event.code === "KeyX" ? "P1" : "P2";
	if (event.type === "keydown" && pongGameInfo.getRoom()?.getIsButtonPressed(event.code) === false) {
		pongGameInfo.getRoom()?.setButtonPressed(event.code, true);
		pongGameInfo.getRoom()?.setIntervals(event.code, setInterval(sendPaddleMovement, 1000 / 60, event.code, p));
	}
	if (event.type === "keyup" && pongGameInfo.getRoom()?.getIsButtonPressed(event.code) === true) {
		pongGameInfo.getRoom()?.setButtonPressed(event.code, false);
		clearInterval(pongGameInfo.getRoom()?.getIntervals(event.code) as number);
		pongGameInfo.getRoom()?.setIntervals(event.code, null);
	}
}

const   confirmGame = () => {
	loadPongPage("confirm");

	let remainingTime = 10;

	document.getElementById("quit")?.addEventListener("click", () => quit());


	pongGameInfo.getRoom()?.clearIntervals();
	// console.log("Room? : " + gameInfo.getRoom());
	pongGameInfo.getRoom()?.setQueueInterval(setInterval(() => {
		remainingTime--;
		if (document.getElementById("timer"))
			document.getElementById("timer")!.innerText = `${imTexts.pongModalesTournamentJoinConfirmTimer}: ${remainingTime}s`;
		if (remainingTime <= 0) {
			clearInterval(pongGameInfo.getRoom()?.getQueueInterval() as number);
			quit("QUEUE_TIMEOUT");
		}
	}, 1000));
	document.getElementById("confirm-game")?.addEventListener("click", () => {
		clearInterval(pongGameInfo.getRoom()?.getQueueInterval() as number);
		document.getElementById("timer")!.innerText = "Confirmed! Awaiting opponent";
		fetch(`http://${address}/api/pong/startConfirm`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ roomId: pongGameInfo.getRoom()?.getRoomNumber(), P: pongGameInfo.getRoom()?.getPlayer() })
		})
	});
}


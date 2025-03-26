import  { content, homePage } from "../main.ts";
import  { Game, RoomInfo, TournamentInfo } from "../utils.ts";
import  { joinSolo, joinMatchmaking, quitRoom, PongRoom } from "./game.ts";
import  { listRoomsSpectator } from "./spectate.ts";
import  { Tournament, getTournamentName, listTournaments } from "./tournament.ts";

class   gameInformation {
	private room: PongRoom | null;
	private tournament: Tournament | null;
	private matchType: "PONG" | "TOURNAMENT" | null;

	constructor () {
		this.room = null;
		this.tournament = null;
		this.matchType = null;
	}

	getRoom() { return this.room; }
	getMatchType() { return this.matchType; }
	getTournament() { return this.tournament; }

	setRoom(room: PongRoom, classic: boolean = true) {
		this.room = room;
		if (classic)
			this.matchType = "PONG";
	}
	setTournament(tournament: Tournament) { this.tournament = tournament; this.matchType = "TOURNAMENT"; }
	resetRoom() { this.room = null; this.matchType = null; }
}

export const   gameInfo: gameInformation = new gameInformation();


export const loadPongHtml = (page: "idle" | "match-found" | "tournament-found" | "board" | "confirm" | "tournament-name") => {
	switch (page) {
		case "idle":
			return idleHtml();
		case "match-found":
			return matchFoundHtml();
		case "tournament-found":
			return tournamentFoundHtml();
		case "board":
			return drawBoard();
		case "confirm":
			return confirmPage();
		case "tournament-name":
			return tournamentNameHtml();
	}
}

const   idleHtml = () => {
	if (!content)
		return ;
	content.innerHTML = `
        <h1>Pong</h1>
        <button id="home">Home Page</button>
		<button id="join-game">Join a Game</button>		
		<button id="join-solo-game">Create a solo Game</button>
		<button id="create-tournament">Create a tournament</button>
		<button id="join-tournament">Join a tournament</button>
		<button id="spectate">Spectate a room</button>
	`;
}

export const   idlePage = () => {
	loadPongHtml("idle");

	document.getElementById("home")?.addEventListener("click", () => homePage());
	document.getElementById("join-game")?.addEventListener("click", joinMatchmaking);
	document.getElementById("join-solo-game")?.addEventListener("click", joinSolo);
	document.getElementById("create-tournament")?.addEventListener("click", getTournamentName);
	document.getElementById("join-tournament")?.addEventListener("click", listTournaments);
	document.getElementById("spectate")?.addEventListener("click", listRoomsSpectator);
}

const   matchFoundHtml = () => {
	if (!content)
		return ;

	content.innerHTML= `
		<p>Room found!</p>
		<button id="quit-room">Quit Room</button>
	`;
}

export const   matchFound = () => {
	loadPongHtml("match-found");

	document.getElementById("quit-room")?.addEventListener("click", () => quitRoom("Leaving room"));
}

export const   specRoomInfoHtml = (roomId: number) => {
	if (!content)
		return ;

	content.innerHTML = `
			<button id="roomLst">Return to Room List</button>
			<h1>Room Info:</h1>
			<h2>Room Number: ${roomId}</h2>
			<button id="spectate">Spectate Room</button>
			`
}

export const   tourInfoHtml = (tourId: number, started: boolean) => {
	if (!content)
		return ;

	content.innerHTML = `
			<button id="roomLst">Return to Tournament List</button>
			<h1>Tournament Info:</h1>
			<h2>Tournament Number: ${tourId}</h2>
		`
	content.innerHTML += started?
		`<p>The tournament as already started.</p>`:
		`<p>The tournament hasn't started yet </p>
			<p>Do you want to join ?</p>
			<button id="joinTournament">Join the tournament</button>`
}

export const roomListHtml = (rooms: RoomInfo[]) => {
	if (!content)
		return ;

	let listHTML = `
		<button id="back">Back</button>
		<ul>`;

	rooms.forEach((room: RoomInfo) => {
		listHTML += `
		  		<li>
					<button class="room-button" id="${room.id}">
						Room ID: ${room.id}, full: ${room.full}, solo: ${room.isSolo}
					</button>
		  		</li>
			`;
	});
	listHTML += '</ul>';
	content.innerHTML = listHTML;
}

export const tournamentListHtml = (tournaments: TournamentInfo[]) => {
	if (!content)
		return ;

	let listHTML = `
		<button id="back">Back</button>
		<ul>`;
	tournaments.forEach((tournament: TournamentInfo) => {
		listHTML += `
		  <li>
			<button class="tournament-button" id="${tournament.id}">
			  Tournament ID: ${tournament.id}, Started: ${tournament.started}
			</button>
		  </li>
		`;
	});
	listHTML += '</ul>';
	content.innerHTML = listHTML;
}

const   tournamentNameHtml = () => {
	if (!content)
        return ;

    content.innerHTML = `
		<p>Enter the name of the tournament</p>
		<form>
			<input type="text" id="tournamentName" placeholder="Tournament Name">
			<button id="submitTournamentName">Submit</button>
		</form>
	`
}

const   tournamentFoundHtml = () => {
    if (!content)
        return ;
	if (!gameInfo.getTournament())
		return ;

    content.innerHTML= `
		<p>Tournament found!</p>
		<button id="quit-room">Quit Tournament</button>
	`;
    if (gameInfo.getTournament()?.getIsOwner()) {
        content.innerHTML += `
			<button id="start-tournament">Start Tournament</button>
			<button id="shuffle-tree">Shuffle Tree</button>
		`;

    }
}


const   drawBoard = () => {
	if (!content)
		return

	content.innerHTML = `
                <button id="quit">Quit</button>
				<canvas id="gameCanvas" width="800" height="400"></canvas>
			`;
}

const   confirmPage = () => {
	if (!content)
		return ;

	// TODO: Add quit button

	content.innerHTML = `
    <p>Game Found, Confirm?</p>
    <button id="confirm-game">Confirm Game</button>
    <p id="timer">Time remaining: 10s</p>
	`;
}

export function drawGame(game: Game) {
	const canvas = document.getElementById("gameCanvas")  as HTMLCanvasElement;
	const c = canvas?.getContext("2d") as CanvasRenderingContext2D;

	if (!c || !game)
		return;
	c.clearRect(0, 0, canvas.width, canvas.height);

	// Draw ball
	c.fillStyle = "white";
	c.beginPath();
	c.arc(game.ball.x, game.ball.y, game.ball.size, 0, Math.PI * 2);
	c.fill();

	// Draw paddles
	c.fillRect(game.paddle1.x, game.paddle1.y, game.paddle1.x_size, game.paddle1.y_size); // Left Paddle
	c.fillRect(game.paddle2.x, game.paddle2.y, game.paddle2.x_size, game.paddle2.y_size); // Right Paddle
}

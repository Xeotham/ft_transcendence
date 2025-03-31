import  { content } from "../main.ts";
import  { Game, RoomInfo, TournamentInfo, loadPongHtmlType, loadHtmlArg } from "../utils.ts";
import  { PongRoom } from "./game.ts";
import  { Tournament } from "./tournament.ts";

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
	resetRoom() {
		this.room = null;
		this.matchType = this.matchType === "TOURNAMENT" ? "TOURNAMENT" : null;
	}
	resetTournament() { this.resetRoom(); this.tournament = null; this.matchType = null; }
}

export const	gameInfo: gameInformation = new gameInformation();


export const loadPongHtml = (page: loadPongHtmlType, arg: loadHtmlArg | null = null) => {
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
		case "spec-room-info":
			return specRoomInfoHtml(arg?.roomId!);
		case "tour-info":
			return tourInfoHtml(arg?.tourId!, arg?.started!);
		case "list-rooms":
			return roomListHtml(arg?.roomLst!);
		case "list-tournaments":
			return tournamentListHtml(arg?.tourLst!);
		case "draw-game":
			return drawGame(arg?.game!);
	}
}

const   idleHtml = () => {
	if (!content)
		return ;
	content.innerHTML = `
        <h1>Pong</h1>
        <nav>
	        <a href="/">Home Page</a>
			<a href="/pong/join-game">Join a Game</a>
			<a href="/pong/solo-game">Create a solo Game</a>
			<a href="/pong/create-tournament">Create a tournament</a>
			<a href="/pong/list/tournaments">Join a tournament</a>
			<a href="/pong/list/rooms-spectator">Spectate a room</a>
		</nav>	
`;
}

const   matchFoundHtml = () => {
	if (!content)
		return ;

	content.innerHTML= `
		<p>Room found!</p>
		<a href="/pong/quit-room">Quit Room</a>
	`;
}

const   specRoomInfoHtml = (roomId: number) => {
	if (!content)
		return ;

	content.innerHTML = `
			<a href="pong/list/rooms-spectator">Return to Room List</a>
			<h1>Room Info:</h1>
			<h2>Room Number: ${roomId}</h2>
			<button id="spectate">Spectate Room</button>
			`
}

const   tourInfoHtml = (tourId: number, started: boolean) => {
	if (!content)
		return ;

	content.innerHTML = `
			<a href="/pong/list/tournaments">Return to Tournament List</a>
			<h1>Tournament Info:</h1>
			<h2>Tournament Number: ${tourId}</h2>
		`
	content.innerHTML += started?
		`<p>The tournament as already started.</p>`:
		`<p>The tournament hasn't started yet </p>
			<p>Do you want to join ?</p>
			<button id="joinTournament">Join the tournament</button>`
}

const roomListHtml = (rooms: RoomInfo[]) => {
	if (!content)
		return ;

	let listHTML = `
		<a href="/pong">Back</a>
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

const tournamentListHtml = (tournaments: TournamentInfo[]) => {
	if (!content)
		return ;

	let listHTML = `
		<a href="/pong">Back</a>
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
		<a href="/pong">Back</a>
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
		<a href="/pong/quit-room">Quit Tournament</a>
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
                <a href="/pong/quit-room">Quit</a>
                <h1>Pong Game</h1>
                <p id="score" >Score: 0 | 0</p>
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

function drawGame(game: Game) {
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

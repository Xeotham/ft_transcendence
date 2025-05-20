import {TCS} from "../TCS.ts";
import {EL} from "../zone/zoneHTML.ts";
import {Game, loadHtmlArg, loadPongHtmlType, RoomInfo, TournamentInfo} from "./utils.ts";
import {pongGameInfo} from "./pong.ts";

export const loadPongHtml = (page: loadPongHtmlType, arg: loadHtmlArg | null = null) => {
	switch (page) {
		case "empty":
			return emptyHtml();
		case "logo":
			return logoHtml();
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
			return tourInfoHtml(arg?.tourId!, arg?.started!, arg?.tourName!);
		case "list-rooms":
			return roomListHtml(arg?.roomLst!);
		case "tour-rooms-list":
			return tourRoomListHtml(arg?.roomLst!);
		case "list-tournaments":
			return tournamentListHtml(arg?.tourLst!);
		case "draw-game":
			return drawGame(arg?.game!);
		case "tournament-end":
			return tournamentEndPage(arg?.winner!);
		case "priv-room-create":
			return privRoomCreate(arg?.inviteCode!);
		case "priv-room-code":
			return privRoomCode();
	}
}

const   emptyHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = ``;
}

const   logoHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = `<div id="logoPong" class="${TCS.pongLogo}">Pong</div>`;
}

const   idleHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = `
	<nav class="${TCS.pongNav0}">
		<div id="pong" class="${TCS.pongTitre} flex-1">Pong</div>
		<div class="flex-1"><button id="Solo-game" class="${TCS.pongNavButton}">play vs offline</button></div>
		<div class="flex-1"><button id="Bot-game" class="${TCS.pongNavButton}">play vs bot</button></div>
		<div class="flex-1"><button id="Join-game" class="${TCS.pongNavButton}">play vs online</button></div>
		<div class="flex-1"><button id="Private-room" class="${TCS.pongNavButton}">Create a Room</button></div>
		<div class="flex-1"><button id="Join-priv-room" class="${TCS.pongNavButton}">Join a Room</button></div>
		<div class="flex-1"><button id="Rooms-spectator" class="${TCS.pongNavButton}">Spectate a Room</button></div>
		<div class="flex-1"><button id="Create-tournament" class="${TCS.pongNavButton}">Create a tournament</button></div>
		<div class="flex-1"><button id="Tournaments" class="${TCS.pongNavButton}">Join a tournament</button></div>
		<div class="flex-1"><button id="Home" class="${TCS.pongNavButton}">Return Home</button></div>
	</nav>`;
}

const   matchFoundHtml = () => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML =`
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><p class="${TCS.pongText}">Room found!</p></div>
		<div class="flex-1"><button id="quit" class="${TCS.pongButton}">Quit Room</button></div>
	</div>`;
}

const   specRoomInfoHtml = (roomId: number) => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><button id="return" class="${TCS.pongButton}">Return to Room List</button></div>
		<div class="flex-1"><h1 class="${TCS.pongText}">Room Info:</h1></div>
		<div class="flex-1"><h2 class="${TCS.pongText}">Room Number: ${roomId}</h2></div>
		<div class="flex-1"><button id="spectate" class="${TCS.pongButton}">Spectate Room</button></div>
	</div>`;
}

const   tourInfoHtml = (tourId: number, started: boolean, name: string) => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><h1 class="${TCS.pongText}">Tournament Info:</h1></div>
		<div class="flex-1"><h2 class="${TCS.pongText}">Tournament name: ${name}</h2></div>
		<div class="flex-1"><h2 class="${TCS.pongText}">Tournament Number: ${tourId}</h2></div>`;
	EL.contentPong.innerHTML += started?`
	<div class="flex-1"><p class="${TCS.pongText}">The tournament as already started.</p></div>`
	:`
	<div class="flex-1"><p class="${TCS.pongText}">The tournament hasn't started yet </p>
	<div class="flex-1"><p class="${TCS.pongText}">Do you want to join ?</p></div>
	<div class="flex-1">
		<button id="joinTournament" class="${TCS.pongButton}">Join the tournament</button>
		<button id="return" class="${TCS.pongButton}">Return to Tournament List</button>
	</div>`;
	EL.contentPong.innerHTML += `</div>`;
}

const   tourRoomListHtml = (rooms: RoomInfo[]) => {
	if (!EL.contentPong)
		return ;

	let listHTML = `<div class="${TCS.pongNav1}"><ul>`;

	rooms.forEach((room: RoomInfo) => {
		listHTML += `
		<li class="flex-1" class="${TCS.pongButton}">
			<a href="/pong/tournament/room/${room.id}" class="${TCS.pongButton}">
				Id: ${room.id} Full: ${room.full} Solo: ${room.isSolo} Bot: ${room.isBot}
			</a>
		</li>`;
	});
	listHTML += '</ul></div>';
	EL.contentPong.innerHTML = listHTML;
}

const   privRoomCreate = (inviteCode: string) => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><h1 class="${TCS.pongText}">Private Room</h1></div>
		<div class="flex-1"><h2 class="${TCS.pongText}">Here is your Invite Code: ${inviteCode}</h2></div>
		<div class="flex-1"><button id="quit" class="${TCS.pongButton}">Quit Room</button></div>
	</div>`;
}

const   privRoomCode = () => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><h1 class="${TCS.pongText}">Please enter your invite code:</h1></div>
		<form id="inviteForm" class="flex-1">
			<input type="text" id="inviteCode" placeholder="Invite Code" class="${TCS.pongButton}">
			<button id="submit" class="${TCS.pongButton}">Submit</button>
		</form>
		<div class="flex-1"><button id="back" class="${TCS.pongButton}">Back</button></div>
	</div>`;
}

const roomListHtml = (rooms: RoomInfo[]) => {
	if (!EL.contentPong)
		return ;

	let listHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><button id="back" class="${TCS.pongButton}">Back</button></div>
		<div class="flex-1"><ul>`;

	rooms.forEach((room: RoomInfo) => {
		if (!room.privRoom && !room.isSolo) {
			listHTML += `
			<li class="flex-1" class="${TCS.pongButton}">
				<a href="/pong/room/${room.id}" class="${TCS.pongButton}">
				Id: ${room.id}
				</a>
		    </li>`};
	});
	listHTML += '</ul></div>';
	EL.contentPong.innerHTML = listHTML;
}

const tournamentListHtml = (tournaments: TournamentInfo[]) => {
	if (!EL.contentPong)
		return ;

	let listHTML = `
	<div class="${TCS.pongNav1}">
		<ul>`;
	tournaments.forEach((tournament: TournamentInfo) => {
		listHTML += `
		  <li class="flex-1" class="${TCS.pongButton}">
			<a href="/pong/tournament/${tournament.id}" class="${TCS.pongButton}">
			  Id: ${tournament.id} Name: ${tournament.name}, Started: ${tournament.started}
			</a>
		  </li>`;
	});
	listHTML += `
		</ul>
		<div class="flex-1"><button id="back" class="${TCS.pongButton}">Back</button></div>
	</div>`;
	EL.contentPong.innerHTML = listHTML;
}

const   tournamentNameHtml = () => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><p class="${TCS.pongText}">Enter the name of the tournament</p></div>
		<form class="flex-1">
			<input type="text" id="tournamentName" placeholder="Tournament Name" class="${TCS.pongButton}">
			<button id="submit" class="${TCS.pongButton}">Submit</button>
		</form>
		<div class="flex-1"><button id="back" class="${TCS.pongButton} pb-[30px]">Back</button></div>
	</div>`;
}

const   tournamentEndPage = (winner: number) => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><button id="home" class="${TCS.pongButton}">Home</button></div>
		<div class="flex-1"><h1 class="${TCS.pongText}">Tournament Over</h1></div>
		<div class="flex-1"><p class="${TCS.pongText}">Winner: Player ${winner}</p></div>
	</div>`;
}

const   tournamentFoundHtml = () => {
	if (!EL.contentPong)
		return ;
	if (!pongGameInfo.getTournament())
		return ;

	EL.contentPong.innerHTML= `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><p class="${TCS.pongText}">Tournament found!</p></div>
		<div class="flex-1"><button id="quit" class="${TCS.pongButton}">Quit Tournament</button></div>`;
	if (pongGameInfo.getTournament()?.getIsOwner()) {
		EL.contentPong.innerHTML += `
		<div class="flex-1"><button id="start-tournament" class="${TCS.pongButton}">Start Tournament</button></div>
		<div class="flex-1"><button id="shuffle-tree" class="${TCS.pongButton}">Shuffle Tree</button></div>`;
	}
	EL.contentPong.innerHTML += `</div>`;
}


// TODO: Add spec tournament board

const   drawBoard = () => {
	if (!EL.contentPong)
		return

	// TODO quid du quit
	EL.contentPong.innerHTML = `
	<div class="flex flex-col">
		<div class="flex justify-end mb-4">
			<button id="quit" class="${TCS.pongButton}">Quit</button>
		</div>
		<canvas id="pongCanvas" width="800" height="400" class="${TCS.pongCanvas}"></canvas>
	</div>`;
}

const   confirmPage = () => {
	if (!EL.contentPong)
		return ;

	// TODO: Add quit button

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><p>Game Found, Confirm?</p></div>
		<div class="flex-1"><button id="confirm-game" class="${TCS.pongButton}">Confirm Game</button></div>
		<div class="flex-1"><p id="timer">Time remaining: 10s</p></div>
	</div>`;
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

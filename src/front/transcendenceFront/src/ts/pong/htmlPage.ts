import { loadHtmlArg, loadPongHtmlType, RoomInfo, TournamentInfo} from "./utils.ts";
import {content} from "../main.ts";
import {pongGameInfo} from "./pong.ts";

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
			return tourInfoHtml(arg?.tourId!, arg?.started!, arg?.tourName!);
		case "list-rooms":
			return roomListHtml(arg?.roomLst!);
		case "tour-rooms-list":
			return tourRoomListHtml(arg?.roomLst!);
		case "list-tournaments":
			return tournamentListHtml(arg?.tourLst!);
		case "tournament-end":
			return tournamentEndPage(arg?.winner!);
		case "priv-room-create":
			return privRoomCreate(arg?.inviteCode!);
		case "priv-room-code":
			return privRoomCode();
	}
}

const   idleHtml = () => {
	if (!content)
		return ;
	content.innerHTML = `
        <h1>Pong</h1>
        <nav>
	        <button id="home">Home Page</button>
			<button id="join-game">Join a Game</button>
			<button id="solo-game">Create a solo Game</button>
			<button id="bot-game">Create a bot Game</button>
			<button id="private-room">Create a Private Room</button>
			<button id="join-priv-room">Join a Private Room</button>
			<button id="create-tournament">Create a tournament</button>
			<button id="tournaments">Join a tournament</button>
			<button id="rooms-spectator">Spectate a room</button>
		</nav>	
	`;
}

const   matchFoundHtml = () => {
	if (!content)
		return ;

	content.innerHTML= `
		<p>Room found!</p>
		<button id="quit">Quit Room</button>
	`;
}

const   specRoomInfoHtml = (roomId: number) => {
	if (!content)
		return ;

	content.innerHTML = `
			<button id="return">Return to Room List</button>
			<h1>Room Info:</h1>
			<h2>Room Number: ${roomId}</h2>
			<button id="spectate">Spectate Room</button>
			`
}

const   tourInfoHtml = (tourId: number, started: boolean, name: string) => {
	if (!content)
		return ;

	content.innerHTML = `
			<button id="return">Return to Tournament List</button>
			<h1>Tournament Info:</h1>
			<h2>Tournament name: ${name}</h2>
			<h2>Tournament Number: ${tourId}</h2>
		`
	content.innerHTML += started?
		`<p>The tournament as already started.</p>`:
		`<p>The tournament hasn't started yet </p>
			<p>Do you want to join ?</p>
			<button id="joinTournament">Join the tournament</button>`
}

const   tourRoomListHtml = (rooms: RoomInfo[]) => {
	if (!content)
		return ;

	let listHTML = `<ul>`;

	rooms.forEach((room: RoomInfo) => {
		listHTML += `
		  		<li>
					<a href="/pong/tournament/room/${room.id}">
					  Id: ${room.id} Full: ${room.full} Solo: ${room.isSolo} Bot: ${room.isBot}
					</a>
		  		</li>
			`;
	});
	listHTML += '</ul>';
	content.innerHTML = listHTML;
}

const   privRoomCreate = (inviteCode: string) => {
	if (!content)
		return ;

	content.innerHTML = `
	<button id="quit">Quit Room</button>
	<h1>Private Room</h1>
	<h2>Here is your Invite Code: ${inviteCode}</h2>
	`
}

const   privRoomCode = () => {
	if (!content)
		return ;

	content.innerHTML = `
	<button id="back" >Back</button>
	<h1>Please enter your invite code:</h1>
	<form id="inviteForm">
		<input type="text" id="inviteCode" placeholder="Invite Code">
	</form>
	<button id="submit">Submit</button>
	`
}

const roomListHtml = (rooms: RoomInfo[]) => {
	if (!content)
		return ;

	let listHTML = `
		<button id="back">Back</button>
		<ul>`;

	rooms.forEach((room: RoomInfo) => {
		if (!room.privRoom && !room.isSolo) {
			listHTML += `
                <li>
					<a href="/pong/room/${room.id}">
					  Id: ${room.id}
					</a>
		        </li>
			`};
	});
	listHTML += '</ul>';
	content.innerHTML = listHTML;
}

const tournamentListHtml = (tournaments: TournamentInfo[]) => {
	if (!content)
		return ;

	let listHTML = `
		<button id="back">Back</button>
		<ul>`;
	tournaments.forEach((tournament: TournamentInfo) => {
		listHTML += `
		  <li>
			<a href="/pong/tournament/${tournament.id}">
			  Id: ${tournament.id} Name: ${tournament.name}, Started: ${tournament.started}
			</a>
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
		<button id="back">Back</button>
		<p>Enter the name of the tournament</p>
		<form>
			<input type="text" id="tournamentName" placeholder="Tournament Name">
			<button id="submit">Submit</button>
		</form>
	`
}

const   tournamentEndPage = (winner: number) => {
	if (!content)
		return ;

	content.innerHTML = `
	<button id="home">Home</button>
	<h1>Tournament Over</h1>
	<p>Winner: Player ${winner}</p>
	`
}

const   tournamentFoundHtml = () => {
	if (!content)
		return ;
	if (!pongGameInfo.getTournament())
		return ;

	content.innerHTML= `
		<p>Tournament found!</p>
		<button id="quit">Quit Tournament</button>
	`;
	if (pongGameInfo.getTournament()?.getIsOwner()) {
		content.innerHTML += `
			<button id="start-tournament">Start Tournament</button>
			<button id="shuffle-tree">Shuffle Tree</button>
		`;

	}
}

// TODO: Add spec tournament board

const   drawBoard = () => {
	if (!content)
		return

	content.innerHTML = `
				<canvas id="pongCanvas" width="${window.innerWidth}" height="${window.innerHeight}></canvas>
<!--                <p id="score" >Score: 0 | 0</p>-->
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

import  { content, homePage } from "../main.ts";
import  { Game } from "../utils.ts";
import  { joinSolo, joinMatchmaking } from "./game.ts";

export const loadPongHtml = (page: "idle" | "match-found" | "tournament-found" | "room-list" | "board" | "confirm") => {
    switch (page) {
        case "idle":
            return idleHtml();
        case "match-found":
            return matchFound();
        case "tournament-found":
            return ;
        case "room-list":
            return ; // TODO: function to fetch room list roomList();
        case "board":
            return drawBoard();
        case "confirm":
            return confirmPage();
    }
}

const   idleHtml = () => {
    if (!content)
        return ;
    content.innerHTML = `
        <h1>Want to play some pong ?</h1>
        <button id="home">Naaah i'd better go back home</button>
		<button id="join-game">Join a Game</button>		
		<button id="join-solo-game">Create a solo Game</button>
<!--		<button id="create-tournament">Create a tournament</button>-->
<!--		<button id="join-tournament">Join a tournament</button>-->
<!--		<button id="spectate">spectate</button>-->
	`;
}

export const   idlePage = () => {
    loadPongHtml("idle");

    document.getElementById("home")?.addEventListener("click", () => homePage());
    document.getElementById("join-game")?.addEventListener("click", joinMatchmaking);
    document.getElementById("join-solo-game")?.addEventListener("click", joinSolo);
    // document.getElementById("create-tournament")?.addEventListener("click", getTournamentName);
    // document.getElementById("join-tournament")?.addEventListener("click", listTournaments);
    // document.getElementById("spectate")?.addEventListener("click", listRooms);
}

const   matchFound = () => {
    if (!content)
        return ;

    content.innerHTML= `
		<p>Room found!</p>
		<button id="quit-room">Quit Room</button>
	`;
    // document.getElementById("quit-room")?.addEventListener("click", (ev) => quitRoom("Leaving room"));
}

// const   tournamentFound = (tournament: any /* TODO: tournament info*/) => {
//     if (!content)
//         return ;
//
//     content.innerHTML= `
// 		<p>Tournament found!</p>
// 		<button id="quit-room">Quit Tournament</button>
// 	`;
//     if (isTournamentOwner) {
//         content.innerHTML += `
// 			<button id="start-tournament">Start Tournament</button>
// 			<button id="shuffle-tree">Shuffle Tree</button>
// 		`;
//         document.getElementById("start-tournament")?.addEventListener("click", () => {
//             fetch(`http://${address}:3000/api/pong/startTournament`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ tourId: tournamentId })
//             }) });
//         document.getElementById("shuffle-tree")?.addEventListener("click", shuffleTree);
//     }
//     document.getElementById("quit-room")?.addEventListener("click", (ev) => quitRoom("Leaving room"));
// }

// const   roomList = (rooms: any) => {
//     if (!content)
//         return ;
//         let listHTML = '<ul>';
//         rooms.forEach((room: RoomInfo) => {
//             listHTML += `
// 		    <li>
// 			    <button class="room-button" id="${room.id}">
// 			        Room ID: ${room.id}, full: ${room.full}, solo: ${room.isSolo}
// 			    </button>
//             </li>
// 		    `;
//             });
//         listHTML += '</ul>';
//         content.innerHTML = listHTML;
//
//         // Add event listeners to the buttons
//         document.querySelectorAll('.room-button').forEach(button => {
//             button.addEventListener('click', getRoomInfo);
//         });
// }

const   drawBoard = () => {
    if (!content)
        return

    content.innerHTML = `
				<canvas id="gameCanvas" width="800" height="400"></canvas>
			`;
}

const   confirmPage = () => {
    if (!content)
        return ;

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

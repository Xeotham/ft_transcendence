// import {TournamentInfo} from "../utils";
// import {address, content} from "../front";
//
// async function	getTournamentName() {
//     if (!content)
//         return ;
//
//     content.innerHTML = `
// 		<p>Enter the name of the tournament</p>
// 		<form>
// 			<input type="text" id="tournamentName" placeholder="Tournament Name">
// 			<button id="submitTournamentName">Submit</button>
// 		</form>
// 	`
//     document.getElementById("submitTournamentName")?.addEventListener("click", () => {
//         const name = (document.getElementById("tournamentName") as HTMLInputElement).value;
//         createTournament(name);
//     });
// }
//
// async function	createTournament(name: string) {
//     isSolo = false;
//     isTournamentOwner = true;
//     matchType = "TOURNAMENT";
//     loadPage("room-found");
//     if (!socket)
//         socket = new WebSocket(`ws://${address}:3000/api/pong/createTournament?name=${name}`);
//
//     socket.addEventListener("error", (error) => {
//         console.error(error);
//     })
//     // Connection opened
//     socket.onopen = () => {
//         console.log("Created a tournament");
//     }
//     socket.onclose = () => {
//         console.log("Connection closed");
//         if (tournamentId >= 0)
//             quitRoom();
//     }
//     // Listen for messages
//     socket.addEventListener("message", messageHandler);
// }
//
// function getTournamentInfo(event: Event){
//     if (!content)
//         return ;
//
//     const	tournamentId = (event.target as HTMLButtonElement).getAttribute('id');
//     content.innerHTML = `
// 		<button id="tournamentLst">Return to Tournament List</button>
// 	`;
//
//     fetch(`http://${address}:3000/api/pong/get_tournament_info?id=${tournamentId}`, {
//         method: "GET",
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(data => {
//             const started = data.started;
//             content.innerHTML += `
// 			<h1>Tournament Info:</h1>
// 			<h2>Tournament Number: ${tournamentId}</h2>
// 		`
//             content.innerHTML += data.started === true?
//                 `<p>The tournament as already started.</p>`:
//                 `<p>The tournament hasn't started yet </p>
// 			<p>Do you want to join ?</p>
// 			<button id="joinTournament">Join the tournament</button>`
//             document.getElementById('tournamentLst')?.addEventListener("click", listTournaments);
//             if (!started) {
//                 document.getElementById('joinTournament')?.addEventListener("click", () => {
//                     joinTournament(Number(tournamentId))
//                 });
//             }
//         });
// }
//
// async function	listTournaments() {
//     if (!content)
//         return ;
//
//     fetch(`http://${address}:3000/api/pong/get_tournaments`, {
//         method: "GET",
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(data => {
//             let listHTML = '<ul>';
//             data.forEach((tournament: TournamentInfo) => {
//                 listHTML += `
// 		  <li>
// 			<button class="tournament-button" id="${tournament.id}">
// 			  Tournament ID: ${tournament.id}, Started: ${tournament.started}
// 			</button>
// 		  </li>
// 		`;
//             });
//             listHTML += '</ul>';
//             content.innerHTML = listHTML;
//
//             // Add event listeners to the buttons
//             document.querySelectorAll('.tournament-button').forEach(button => {
//                 button.addEventListener('click', getTournamentInfo);
//             });
//         })
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//         });
// }
//
// async function	joinTournament(tournamentId: number) {
//     isSolo = false;
//     isTournamentOwner = false;
//     matchType = "TOURNAMENT";
//
//     if (!socket)
//         socket = new WebSocket(`ws://${address}:3000/api/pong/joinTournament?id=${tournamentId}`);
//
//     socket.addEventListener("error", (error) => {
//         console.error(error);
//     })
//     // Connection opened
//     socket.onopen = () => {
//         console.log("Trying to join a tournament");
//     }
//     socket.onclose = () => {
//         console.log("Connection closed");
//         if (tournamentId >= 0)
//             quitRoom();
//     }
//     // Listen for messages
//     socket.addEventListener("message", messageHandler);
// }
//
// function shuffleTree() {
//     fetch(`http://${address}:3000/api/pong/shuffleTree`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ tourId: tournamentId })
//     });
// }
//

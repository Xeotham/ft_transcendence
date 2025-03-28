import {responseFormat } from "../utils";
import { address, content } from "../main.ts";
import { loadPongHtml, gameInfo } from "./pong.ts";
import { quitRoom, messageHandler } from "./game.ts";

export class   Tournament {
	private tournamentId: number;
	private tourPlacement: number;
	private tournamentName: string;
	private tournamentOwner: boolean;
	private socket: WebSocket | null;

	constructor(socket: WebSocket | null, name: string, Owner: boolean = false) {
		this.tournamentId = -1;
		this.tourPlacement = -1;
		this.tournamentName = name;
		this.tournamentOwner = Owner;
		this.socket = socket;
	}

	// Getters
	getId() { return this.tournamentId; }
	getPlacement() { return this.tourPlacement; }
	getName() { return this.tournamentName; }
	getIsOwner() { return this.tournamentOwner; }
	getSocket() { return this.socket; }

	// Setters
	setId(id: number) { this.tournamentId = id; }
	setPlacement(placement: number) { this.tourPlacement = placement; }
	setName(name: string) { this.tournamentName = name; }
	setOwner(owner: boolean) { this.tournamentOwner = owner; }
	setSocket(socket: WebSocket) { this.socket = socket; }

	// Methods
	initSocket() {
		if (!this.socket)
			return ;
		this.socket.addEventListener("error", (error) => {
			console.error(error);
		});
		this.socket.onopen = () => {
			console.log("Connected to the server");
		};
		this.socket.onclose = () => {
			console.log("Connection closed");
			quitRoom();
		};
		this.socket.addEventListener("message", messageHandler);
	}

	prepTournament(tourId: number, placement: number) {
		this.tournamentId = tourId;
		this.tourPlacement = placement;
		console.log("Joined tournament: " + tourId + " as player: " + placement);
	}
}

export const   tourMessageHandler = (res: responseFormat) => {
	switch (res.message) {
		case "OWNER":
			gameInfo.getTournament()?.setOwner(true);
			console.log("You are the owner of the tournament");
			// loadPage("room-found");
			return ;
		case "PREP":
			const tournamentId = typeof res.tourId === "number" ? res.tourId : -1;
			const tourPlacement = typeof res.tourPlacement === "number" ? res.tourPlacement : -1;

			gameInfo.getTournament()?.prepTournament(tournamentId, tourPlacement);
			// loadPage("room-found");
			return ;
		case "LEAVE":
			quitRoom();
			return ;
	}
}

export const   getTournamentName = async () => {
	loadPongHtml("tournament-name");

	document.getElementById("submitTournamentName")?.addEventListener("click", () => {
        const name: string = (document.getElementById("tournamentName") as HTMLInputElement).value;
        createTournament(name);
    });
}

const   createTournament = async (name: string) => {
	const   socket = new WebSocket(`ws://${address}:3000/api/pong/createTournament?name=${name}`);

	gameInfo.setTournament(new Tournament(socket, name, true));
	gameInfo.getTournament()?.initSocket()
	tournamentFound();
}

export const    listTournaments = () => {
    fetch(`http://${address}:3000/api/pong/get_tournaments`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
			loadPongHtml("list-tournaments", { tourLst: data })
	        // Add event listeners to the buttons
            document.querySelectorAll('.tournament-button').forEach(button => {
                button.addEventListener('click', getTournamentInfo);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

//
const getTournamentInfo = (event: Event) => {
    if (!content)
        return ;

    const	tournamentId = (event.target as HTMLButtonElement).getAttribute('id');

    fetch(`http://${address}:3000/api/pong/get_tournament_info?id=${tournamentId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const started = data.started;

			loadPongHtml("tour-info", { tourId: Number(tournamentId), started: started });
            document.getElementById('tournamentLst')?.addEventListener("click", listTournaments);
            if (!started) {
                document.getElementById('joinTournament')?.addEventListener("click", () => {
                    joinTournament(Number(tournamentId))
                });
            }
        });
}

const joinTournament = (tournamentId: number/*, tourName: string*/) => {
    const socket = new WebSocket(`ws://${address}:3000/api/pong/joinTournament?id=${tournamentId}`);

	gameInfo.setTournament(new Tournament(socket, "tourName"))
	gameInfo.getTournament()?.initSocket();
	tournamentFound();
}

const   shuffleTree = () => {
    fetch(`http://${address}:3000/api/pong/shuffleTree`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tourId: gameInfo.getTournament()?.getId() })
    });
}

const   startTournament = () => {
	fetch(`http://${address}:3000/api/pong/startTournament`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ tourId: gameInfo.getTournament()?.getId() })
	});
}

const   tournamentFound = () => {
	loadPongHtml("tournament-found");

	if (gameInfo.getTournament()?.getIsOwner()) {
		document.getElementById("start-tournament")?.addEventListener("click", startTournament);
		document.getElementById("shuffle-tree")?.addEventListener("click", shuffleTree);
	}
}

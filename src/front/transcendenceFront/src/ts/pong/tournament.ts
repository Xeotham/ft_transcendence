import { responseFormat, TournamentInfo } from "./utils.ts";
import { address, postToApi, user } from "../utils.ts";
import { loadPongPage, pongGameInfo } from "./pong.ts";
import { quit, messageHandler, PongRoom } from "./game.ts";
// @ts-ignore
import  page from "page";

export class   Tournament {
	private tournamentId: number;
	private tourPlacement: number;
	private tournamentName: string;
	private tournamentOwner: boolean;
	private socket: WebSocket | null;
	private lostTournament: boolean;

	constructor(socket: WebSocket | null, name: string, Owner: boolean = false) {
		this.tournamentId = -1;
		this.tourPlacement = -1;
		this.tournamentName = name;
		this.tournamentOwner = Owner;
		this.socket = socket;
		this.lostTournament = false;
	}

	// Getters
	getId() { return this.tournamentId; }
	getPlacement() { return this.tourPlacement; }
	getName() { return this.tournamentName; }
	getIsOwner() { return this.tournamentOwner; }
	getSocket() { return this.socket; }
	getLostTournament() { return this.lostTournament; }

	// Setters
	setId(id: number) { this.tournamentId = id; }
	setPlacement(placement: number) { this.tourPlacement = placement; }
	setName(name: string) { this.tournamentName = name; }
	setOwner(owner: boolean) { this.tournamentOwner = owner; }
	setSocket(socket: WebSocket) { this.socket = socket; }
	setLostTournament(lostTournament: boolean) { this.lostTournament = lostTournament; }

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
			quit();
		};
		this.socket.addEventListener("message", messageHandler);

		window.onunload = () => {
			postToApi(`http://${address}/api/user/disconnect-user`, { username: user.getUsername() }).catch();
			if (this.socket) {
				quit("LEAVE", "TOURNAMENT");
				this.socket.close();
			}
		}
		// Special handling for Chrome
		if (!navigator.userAgent.includes("Firefox")) {
			window.onbeforeunload = (e) => {
				postToApi(`http://${address}/api/user/disconnect-user`, { username: user.getUsername() }).catch();
				quit("LEAVE", "TOURNAMENT");
				e.preventDefault();
				return '';
			};
		}
	}

	prepTournament(tourId: number, placement: number, isChange: boolean = false) {
		this.tournamentId = tourId;
		this.tourPlacement = placement;
		if (isChange)
			console.log("Changed placement in tournament: " + tourId + ". You now are player: " + placement);
		else
			console.log("Joined tournament: " + tourId + " as player: " + placement);
	}
}

export const   tourMessageHandler = async (res: responseFormat) => {
	switch (res.message) {
		case "OWNER":
			pongGameInfo.getTournament()?.setOwner(true);
			console.log("You are the owner of the tournament");
			tournamentFound();
			return ;
		case "PREP":
			const tournamentId = typeof res.tourId === "number" ? res.tourId : -1;
			const tourPlacement = typeof res.tourPlacement === "number" ? res.tourPlacement : -1;

			pongGameInfo.getTournament()?.prepTournament(tournamentId, tourPlacement, res.data === "CHANGE_PLACEMENT");
			if (!pongGameInfo.getTournament()?.getIsOwner())
				loadPongPage("match-found");
			return ;
		case "CREATE":
			console.log("Creating a pong room for a tournament instance");
			pongGameInfo.setRoom(new PongRoom(pongGameInfo?.getTournament()?.getSocket()!), false);
			return ;
		case "LEAVE":
			quit();
			return ;
	}
}

export const   getTournamentName = async () => {
	loadPongPage("tournament-name");

	const   tournamentNameForm = document.getElementById("tournamentNameForm") as HTMLFormElement;

	tournamentNameForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const name: string = (document.getElementById("tournamentName") as HTMLInputElement).value;
		createTournament(name);
	})
}

const   createTournament = async (name: string) => {
	const   socket = new WebSocket(`ws://${address}/api/pong/createTournament?name=${name}&username=${user.getUsername()}`);

	pongGameInfo.setTournament(new Tournament(socket, name, true));
	pongGameInfo.getTournament()?.initSocket()
	tournamentFound();
}

export const    listTournaments = () => {
    fetch(`http://${address}/api/pong/get_tournaments`, {
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
			loadPongPage("list-tournaments", { tourLst: data })
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

//
export const getTournamentInfo = (id: number) => {
    fetch(`http://${address}/api/pong/get_tournament_info?id=${id}`, {
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
        .then((data: TournamentInfo)  => {
            const   started = data.started;
			const   tournamentName = data.name;

			if (tournamentName === undefined || started === undefined)
				throw new Error("Tournament does not exist");
			page.show("/pong/tournament");
			loadPongPage("tour-info", { tourId: id, started: started, tourName: tournamentName });
            if (!started) {
                document.getElementById('joinTournament')?.addEventListener("click", () => {
                    joinTournament(id);
                });
            }
        })
        .catch(error => {
			alert(error);
			page.show("/pong/tournaments/list");
        });
}

const joinTournament = (tournamentId: number/*, tourName: string*/) => {
    const socket = new WebSocket(`ws://${address}/api/pong/joinTournament?id=${tournamentId}&username=${user.getUsername()}`);

	pongGameInfo.setTournament(new Tournament(socket, "tourName"))
	pongGameInfo.getTournament()?.initSocket();
	tournamentFound();
}

const   shuffleTree = () => {
    fetch(`http://${address}/api/pong/shuffleTree`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tourId: pongGameInfo.getTournament()?.getId() })
    });
}

const   startTournament = () => {
	fetch(`http://${address}/api/pong/startTournament`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ tourId: pongGameInfo.getTournament()?.getId() })
	});
}

const   tournamentFound = () => {
	loadPongPage("tournament-found");

	if (pongGameInfo.getTournament()?.getIsOwner()) {
		document.getElementById("start-tournament")?.addEventListener("click", startTournament);
		document.getElementById("shuffle-tree")?.addEventListener("click", shuffleTree);
		document.getElementById("quit2")?.addEventListener("click", () => quit("Leaving room"));
	}
	document.getElementById("quit-room")?.addEventListener("click", () => quit("Leaving tournament"));
	document.getElementById("quit2")?.addEventListener("click", () => quit("Leaving tournament"));
}

import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay, modale } from './modalesCore.ts';
import { getFromApi, address } from "../utils.ts";
import ApexCharts from 'apexcharts';


let pongStatPage = 0;
const pongListLength = 10;
let pongChart: ApexCharts | null = null;

interface pongStats {
	date: string;
	username: string;
	opponent: string;
	score: number;
	scoreOpponent: number;
	winner: boolean;
}

interface GameUserInfo
{
	date: 	 string;
	username : string;
	userId: number;
	score: 	number;
	winner: boolean;
	type: 	string;
}

let pongHistory: pongStats[] = []

const formatPongStat = (history:{  gameId: number, players: GameUserInfo[] }, playerUsername: string ) => {
	let stat: pongStats = {date: '', username: '', opponent: '', score: 0, scoreOpponent: 0, winner: false};
	const game1 = history.players[0];
	const game2 = history.players[1];
	if (!game1 || !game2) {
		return null;
	}

	stat.date = game1.date;
	stat.username = playerUsername;
	stat.opponent = game1.username === playerUsername ? game2.username : game1.username;
	stat.score = game1.username === playerUsername ? game1.score : game2.score;
	stat.scoreOpponent = game1.username === playerUsername ? game2.score : game1.score;
	stat.winner = game1.username === playerUsername ? game1.winner : game2.winner;
	return stat;

}

export const  loadPongStat = async (playerUsername: string) => {
	try {
		const get: any = await getFromApi(`http://${address}/api/user/get-game-history?username=${playerUsername}`);
		const history: {
			gameId: number,
			players: GameUserInfo[]
		}[] = get.history.filter((e: any) => e.players[0].type === 'pong');
		const newHistory: pongStats[] = [];
		history.forEach((game) => {
			if (game.players.length < 2) {
				return;
			}
			const stat = formatPongStat(game, playerUsername);
			if (stat) {
				newHistory.push(stat);
			}
		})
		pongHistory = newHistory.reverse();
	}
	catch (error) {
		pongHistory = [];
	}
}

export const modalePongStatHTML = (page: number) => {

	pongStatPage = page;

	let PongStatHTML =`
    <div id="PongStatsTitle" class="${TCS.modaleTitre}">
    ${imTexts.modalesPongStatsTitle}</div>

    <span id="PongStatsBack" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesPongStatsBack}</span>

    <div class="h-[30px]"></div>
  `;

	if (pongHistory.length > 0) {
		PongStatHTML += `<div id="donut-chart"></div>`;
		PongStatHTML += `<div class="h-[10px]"></div>`;
	} else {
		PongStatHTML += `<div class="${TCS.modaleTexteGris}">${imTexts.modalesPongStatsNoStats}</div>`;
	}

	PongStatHTML += getModalePongStatListHTML(pongStatPage);

	PongStatHTML += `
    <div class="h-[30px]"></div>
  </div>
  `;

	return PongStatHTML;
}

const formatPongStatLine = (index: number) => {
	const stat = pongHistory[index];
	if (!stat)
		return '';
	let formattedStat = `<span class='text-stone-400'>${stat.date}</span> - `;
	formattedStat += stat.winner ? "<span class='text-lime-400'>" : "<span class='text-rose-700'>"
	formattedStat += `${stat.score}/${stat.scoreOpponent}</span> - ${stat.opponent}`;
	return formattedStat;
}

const getModalePongStatListHTML = (page: number) => {

	let listHTML = ``;

	for (let i = 0; i < pongListLength && pongHistory[(page * pongListLength) + i]; i++) {
		listHTML += `
      <div id="pongStatLine${i}" class="${TCS.modaleTexte}">
      ${formatPongStatLine(i + (page * pongListLength))}</div>
    `;
	}

	listHTML += `  <div class="h-[10px]"></div>

  <span id="PongStatsPrevNext" class="${TCS.modaleTexte}">
    <span id="PongPrev"><a id="PongStatsPrev" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesPongStatsPrev}</a></span>
    <span id="PongSlash">/</span>
    <span id="PongNext"><a id="PongStatsNext" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesPongStatsNext}</a></span>
  </div>`;

	listHTML += `
  <div class="h-[10px]"></div>
  `;

	return listHTML;
}

const destroyPieChart = () => {
	if (pongChart) {
		pongChart.destroy();
		pongChart = null;
	}
}

export const modalePongStatEvents = () => {
	destroyPieChart();

	const PongStatsBack = document.getElementById('PongStatsBack') as HTMLAnchorElement;
	const PongStatsPrev = document.getElementById('PongStatsPrev') as HTMLAnchorElement;
	const PongStatsNext = document.getElementById('PongStatsNext') as HTMLAnchorElement;

	if (!PongStatsBack || !PongStatsPrev || !PongStatsNext)
		return;

	PongStatsBack.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		destroyPieChart();
		modaleDisplay(ModaleType.PROFILE);
	});

	PongStatsPrev.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		if (pongStatPage <= 0 || !modale.content)
			return;
		destroyPieChart();
		modale.content.innerHTML = modalePongStatHTML(--pongStatPage);
		modaleDislpayPrevNextPong();
		modalePongStatEvents();
		modalePongStatPie();
	});

	PongStatsNext.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		if (pongStatPage >= pongListLength || !modale.content)
			return;
		if ((pongStatPage + 1) * pongListLength < pongHistory.length)
		{
			destroyPieChart();
			modale.content.innerHTML = modalePongStatHTML(++pongStatPage);
			modaleDislpayPrevNextPong();
			modalePongStatEvents();
			modalePongStatPie();
		}
	});
}

export const modaleFriendPongStatEvents = () => {
	destroyPieChart();

	const PongStatsBack = document.getElementById('PongStatsBack') as HTMLAnchorElement;
	const PongStatsPrev = document.getElementById('PongStatsPrev') as HTMLAnchorElement;
	const PongStatsNext = document.getElementById('PongStatsNext') as HTMLAnchorElement;

	if (!PongStatsBack || !PongStatsPrev || !PongStatsNext)
		return;

	PongStatsBack.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		destroyPieChart();
		modaleDisplay(ModaleType.FRIEND_PROFILE);
	});

	PongStatsPrev.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		if (pongStatPage <= 0 || !modale.content)
			return;
		destroyPieChart();
		modale.content.innerHTML = modalePongStatHTML(--pongStatPage);
		modaleDislpayPrevNextPong();
		modaleFriendPongStatEvents();
		modalePongStatPie();
	});

	PongStatsNext.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		if (pongStatPage >= pongListLength || !modale.content)
			return;
		if ((pongStatPage + 1) * pongListLength < pongHistory.length)
		{
			destroyPieChart();
			modale.content.innerHTML = modalePongStatHTML(++pongStatPage);
			modaleDislpayPrevNextPong();
			modaleFriendPongStatEvents();
			modalePongStatPie();
		}
	});
}

export const modaleDislpayPrevNextPong = () => {

	const prev = document.getElementById('PongPrev');
	const next = document.getElementById('PongNext');
	const slash = document.getElementById('PongSlash');

	const isNext = pongHistory.length - (pongStatPage * pongListLength) > pongListLength;

	if (!isNext)
		next?.classList.add('hidden');
	if (pongStatPage === 0)
		prev?.classList.add('hidden');
	if (!isNext || pongStatPage === 0)
		slash?.classList.add('hidden');

}

const getPongHistoryWin = () => {
	return pongHistory.filter((game) => game.winner).length;
}

const getPongHistoryLoose = () => {
	return pongHistory.filter((game) => !game.winner).length;
}

export const modalePongStatPie = () => {
	destroyPieChart();

	const getChartOptions = () => {
		return {
			series: [getPongHistoryWin(), getPongHistoryLoose()],
			colors: ["#a3e635", "#be123c"], //lime-400, rose-700
			chart: {
				height: 220,
				width: "100%",
				type: "donut",
				animations: {
					enabled: false // Désactiver les animations pour éviter les problèmes de transformation
				}
			},
			stroke: {
				colors: ["transparent"],
				lineCap: "",
			},
			plotOptions: {
				pie: {
					donut: {
						labels: {
							show: true,
							name: {
								show: true,
								fontFamily: "Sixtyfour, sans-serif",
								fontSize: "8px",
								fontWeight: "bold",
								color: "#facc15", // yellow-400
								offsetY: 20,
							},
							total: {
								showAlways: true,
								show: true,
								label: "Win rate",
								fontFamily: "sixtyfour, sans-serif",
								fontSize: "12px",
								color: "#f7fee7", // lime-50
								formatter: function (w: any) {
									const wins = w.globals.seriesTotals[0];
									const total = w.globals.seriesTotals[0] + w.globals.seriesTotals[1];
									return Math.round((wins / total) * 100) + '%';
								},
							},
							value: {
								show: true,
								fontFamily: "sixtyfour, sans-serif",
								offsetY: -20,
								fontSize: "22px",
								color: "#facc15", // yellow-400
								formatter: function (value: any) {
									return value;
								},
							},
						},
						size: "65%",
					},
				},
			},
			grid: {
				padding: {
					top: -2,
				},
			},
			labels: ["Win", "Loose"],
			dataLabels: {
				enabled: false,
			},
			legend: {
				position: "bottom",
				fontFamily: "Inter, sans-serif",
				show: false
			},
			yaxis: {
				labels: {
					formatter: function (value: any) {
						return value
					},
				},
			},
			xaxis: {
				labels: {
					formatter: function (value: any) {
						return value
					},
				},
				axisTicks: {
					show: false,
				},
				axisBorder: {
					show: false,
				},
			},
		}
	}

	if (document.getElementById("donut-chart") && typeof ApexCharts !== 'undefined') {
		pongChart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions());
		pongChart.render();
	}
}

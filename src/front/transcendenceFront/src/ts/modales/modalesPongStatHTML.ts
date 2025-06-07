import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import {ModaleType, modaleDisplay, modale} from './modalesCore.ts';
import {getFromApi,address} from "../utils.ts";
import ApexCharts from 'apexcharts';


let pongStatPage = 0;
const pongListLength = 10;
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
  const get: any = await  getFromApi(`http://${address}/api/user/get-game-history?username=${playerUsername}`);
  const history: { gameId: number, players: GameUserInfo[] }[] = get.history.filter((e: any) => e.players[0].type === 'pong');
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

export const modalePongStatHTML = (page: number) => {

  pongStatPage = page;

  let PongStatHTML =`
    <div id="PongStatsTitle" class="${TCS.modaleTitre}">
    ${imTexts.modalesPongStatsTitle}</div>

    <div id="PongStatsBack" class="${TCS.modaleTexteLink}">
      ${imTexts.modalesPongStatsBack}</div>

    <div class="h-[30px]"></div>
  `;

  PongStatHTML += `<div id="donut-chart"></div>`;

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
    formattedStat += stat.winner ? "<span class='text-green-500'>" : "<span class='text-red-500'>"
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

export const modalePongStatEvents = () => {

  const PongStatsBack = document.getElementById('PongStatsBack') as HTMLAnchorElement;
  const PongStatsPrev = document.getElementById('PongStatsPrev') as HTMLAnchorElement;
  const PongStatsNext = document.getElementById('PongStatsNext') as HTMLAnchorElement;

  if (!PongStatsBack || !PongStatsPrev || !PongStatsNext)
    return;

  PongStatsBack.addEventListener('click', () => {
    modaleDisplay(ModaleType.PROFILE);
  });

  PongStatsPrev.addEventListener('click', () => {
    if (pongStatPage <= 0 || !modale.content)
      return;
    modale.content.innerHTML = modalePongStatHTML(--pongStatPage);
    modaleDislpayPrevNextPong();
    modalePongStatEvents();
    modalePongStatPie();
  });

  PongStatsNext.addEventListener('click', () => {
    if (pongStatPage >= pongListLength || !modale.content)
      return;
    if ((pongStatPage + 1) * pongListLength < pongHistory.length)
    {
      modale.content.innerHTML = modalePongStatHTML(++pongStatPage);
      modaleDislpayPrevNextPong();
      modalePongStatEvents();
      modalePongStatPie();
    }
  });
}

export const modaleFriendPongStatEvents = () => {

  const PongStatsBack = document.getElementById('PongStatsBack') as HTMLAnchorElement;
  const PongStatsPrev = document.getElementById('PongStatsPrev') as HTMLAnchorElement;
  const PongStatsNext = document.getElementById('PongStatsNext') as HTMLAnchorElement;

  if (!PongStatsBack || !PongStatsPrev || !PongStatsNext)
    return;

  PongStatsBack.addEventListener('click', () => {
    modaleDisplay(ModaleType.FRIEND_PROFILE);
  });

  PongStatsPrev.addEventListener('click', () => {
    if (pongStatPage <= 0 || !modale.content)
      return;
    modale.content.innerHTML = modalePongStatHTML(--pongStatPage);
    modaleDislpayPrevNextPong();
    modaleFriendPongStatEvents();
    modalePongStatPie();
  });

  PongStatsNext.addEventListener('click', () => {
    if (pongStatPage >= pongListLength || !modale.content)
      return;
    if ((pongStatPage + 1) * pongListLength < pongHistory.length)
    {
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

export const modalePongStatPie = () => {

  const getChartOptions = () => {
    return {
      series: [9, 6],
      colors: ["#a3e635", "#be123c"], //lime-400, rose-700
      chart: {
        height: 240, // 320 initiale
        width: "100%",
        type: "donut",
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
                fontSize: "10px",
                color: "#facc15", // yellow-400
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
                fontSize: "20px",
                color: "#facc15", // yellow-400
                formatter: function (value: any) {
                  console.log('value formater', value);
                  return Math.round((9/6 * 100)) + "%"
                },
              },
            },
            size: "80%",
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
    const chart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions());
    chart.render();

    // Get all the checkboxes by their class name
    // const checkboxes = document.querySelectorAll('#devices input[type="checkbox"]');

    // Function to handle the checkbox change event
    // function handleCheckboxChange(event: any, chart: any) {
    //     const checkbox = event.target;
    //     if (checkbox.checked) {
    //         switch(checkbox.value) {
    //           case 'desktop':
    //             chart.updateSeries([15.1, 22.5, 4.4, 8.4]);
    //             break;
    //           case 'tablet':
    //             chart.updateSeries([25.1, 26.5, 1.4, 3.4]);
    //             break;
    //           case 'mobile':
    //             chart.updateSeries([45.1, 27.5, 8.4, 2.4]);
    //             break;
    //           default:
    //             chart.updateSeries([55.1, 28.5, 1.4, 5.4]);
    //         }

    //     } else {
    //         chart.updateSeries([35.1, 23.5, 2.4, 5.4]);
    //     }
    // }

    // Attach the event listener to each checkbox
    // checkboxes.forEach((checkbox) => {
    //     checkbox.addEventListener('change', (event) => handleCheckboxChange(event, chart));
    // });
  }

}

import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay } from './modalesCore.ts';
import {getFromApi} from "../utils.ts";
import {address, user} from "../immanence.ts";

let friendListPage = 0;

interface friendList {
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

let friendList: friendList[] = []

// const formatPongStat = (gameId: number, history: { gameId: number, username: string, date: string, score: number, winner: boolean, type: string }[]) => {

// const formatPongStat = (history:{  gameId: number, players: GameUserInfo[] } ) => {
//   let stat: pongStats = {date: '', username: '', opponent: '', score: 0, scoreOpponent: 0, winner: false};
//   const game1 = history.players[0];
//   const game2 = history.players[1];
//   if (!game1 || !game2) {
//     return null;
//   }
//   stat.date = game1.date;
//   stat.username = user.getUsername();
//   stat.opponent = game1.username === user.getUsername() ? game2.username : game1.username;
//   stat.score = game1.username === user.getUsername() ? game1.score : game2.score;
//   stat.scoreOpponent = game1.username === user.getUsername() ? game2.score : game1.score;
//   stat.winner = game1.username === user.getUsername() ? game1.winner : game2.winner;
//   return stat;

// }

// export const  loadPongStat = async () => {
//   const get: any = await  getFromApi(`http://${address}/api/user/get-game-history?username=${user.getUsername()}`);
//   const history: { gameId: number, players: GameUserInfo[] }[] = get.history;
//   history.filter((e) => e.players[0].type !== 'pong');
//   console.log(history);
//   const newHistory: pongStats[] = [];
//   history.forEach((game) => {
//     if (game.players.length < 2) {
//       return;
//     }
//     const stat = formatPongStat(game);
//     if (stat) {
//       newHistory.push(stat);
//     }
//   })
//   pongHistory = newHistory;
// }

export const modaleFriendListHTML = (page: number) => {

  friendListPage = page;

  let friendListHTML =`
    <div id="friendListTitle" class="${TCS.modaleTitre}">
    ${imTexts.modalesFriendListTitle}</div>

    <div id="friendListBack" class="${TCS.modaleTexteLink}">
      ${imTexts.modalesFriendListBack}</div>

    <div class="h-[30px]"></div>
  `;

  friendListHTML += getModaleFriendListListHTML(friendListPage);

  friendListHTML += `
    <div class="h-[30px]"></div>
  </div>
  `;

  return friendListHTML;
}

const formatFriendListLine = (index: number) => {
    // const stat = pongHistory[index];
    // if (!stat)
    //   return '';
    // let formattedStat = `${stat.date} - `;
    // formattedStat += stat.winner ? "<span class='text-green-500'>" : "<span class='text-red-500'>"
    // formattedStat += `${stat.score}/${stat.scoreOpponent}</span> - ${stat.opponent}`;
    // return formattedStat;

    let formattedFriend = `<span class="${TCS.modaleFriendList}" id="friendListLine${index}">
    username_ami-${index}</span> - `; // TODO: remplacer par le nom de l'ami

    if (index%2 === 0) // TODO: changer par le statut de l'ami
      formattedFriend += `<span class='text-green-500'>${imTexts.modalesFriendListConnected}</span>`;
    else
      formattedFriend += `<span class='text-red-500'>${imTexts.modalesFriendListDisconnected}</span>`;

    // formattedFriend += `<span class='${TCS.modaleTexteLink}'>${imTexts.modalesFriendListRemove}</span>`;

    return formattedFriend;
}

const getModaleFriendListListHTML = (page: number) => {

  let listHTML = ``;

  //console.log("getModalePongStatListHTML", page); // TODO: enlever

  // for (let i = 0; i < 10 && pongHistory[(page * 10) + i]; i++) {
  //   listHTML += `
  //     <div id="pongStatLine${i}" class="${TCS.modaleTexte}">
  //     ${formatPongStatLine(i + (page * 10))}</div>
  //   `;
  // }

  for (let i = 0; i < 10; i++) { // TODO: remplacer par le nombre d'amis
    listHTML += `
      <div id="friendListLine${i}" class="${TCS.modaleTexte}">
      ${formatFriendListLine(i)}</div>
    `;
  }

  listHTML += `  <div class="h-[10px]"></div>

  <div id="friendListPrevNext" class="${TCS.modaleTexte}">
    <a id="friendListPrev" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesFriendListPrev}</a>
    /
    <a id="friendListNext" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesFriendListNext}</a>
  </div>`;

  listHTML += `
  <div class="h-[10px]"></div>
  `;

  return listHTML;
}

export const modaleFriendListEvents = () => {

  const friendListBack = document.getElementById('friendListBack') as HTMLAnchorElement;
  const friendListPrev = document.getElementById('friendListPrev') as HTMLAnchorElement;
  const friendListNext = document.getElementById('friendListNext') as HTMLAnchorElement;
  
  if (!friendListBack || !friendListPrev || !friendListNext)
    return;

  friendListBack.addEventListener('click', () => {
    modaleDisplay(ModaleType.PROFILE);
  });

  friendListPrev.addEventListener('click', () => {
    if (friendListPage <= 0)
      return;
    modaleFriendListHTML(--friendListPage);
  });

  friendListNext.addEventListener('click', () => {
    if (friendListPage >= 10) // TODO: remplacer par le nombre de pages
      return;
    if ((friendListPage + 1) * 10 <= friendList.length)
      modaleFriendListHTML(++friendListPage);
  });


  for (let i = 0; i < 10; i++) {
    const friendListLine = document.getElementById('friendListLine' + i) as HTMLAnchorElement;
    friendListLine.addEventListener('click', () => {
      console.log("friendListLine <<<<<<<<");
      modaleDisplay(ModaleType.FRIEND_PROFILE);
    });
  }
}

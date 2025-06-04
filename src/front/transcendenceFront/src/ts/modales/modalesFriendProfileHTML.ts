import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modale, modaleDisplay } from './modalesCore.ts';

// import avatarImg from '../../medias/avatars/avatar1.png';
import {getFromApi, postToApi} from "../utils.ts";
import {address, user} from "../immanence.ts";
// @ts-ignore
import  page from "page";


interface GameUserInfo
{
  date: 	 string;
  username : string;
  userId: number;
  score: 	number;
  winner: boolean;
  type: 	string;
}

const pongWinRate = async () => {
  const stats = await getFromApi(`http://${address}/api/user/get-stat?username=${user.getUsername()}`);
  const victories: number = stats.stats.pongWin;
  let defeats: number = stats.stats.pongLose;
  return `${imTexts.modalesProfileWinrate}: ${victories} ${imTexts.modalesProfileVictories} / ${defeats} ${imTexts.modalesProfileDefeats}`;
}

const tetrisBestScore = async () => {
  const get: any = await  getFromApi(`http://${address}/api/user/get-game-history?username=${user.getUsername()}`);
  const history: { gameId: number, players: GameUserInfo[] }[] = get.history;
  history.filter((e) => e.players[0].type !== 'tetris');
  if (!history.length)
    return `${imTexts.modalesProfileBestScore}: No game played`;
  let score: number = 0;
  history.forEach((game) => {
    game.players.forEach((player) => {
      if (user.getUsername() === player.username && player.score > score)
        score = player.score;
    })
  })
  return `${imTexts.modalesProfileBestScore}: ${score}pts`;
}


export const modaleFriendProfileHTML = async () => {

  let ProfileHTML = `
  <div id="friendProfileBack" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesFriendProfileBack}</div>

  <div class="h-[7px]"></div>

  <div class="flex flex-row items-start justify-start gap-4">
    <div id="friendProfileAvatar" class="${TCS.modaleAvatarProfil} ">
      <img src="${user.getAvatar()}"/>
    </div>
    <div>
      <div id="friendProfileName" class="${TCS.modaleTitre}">${user.getUsername()}</div>
      <div id="friendProfileStatus" class="${TCS.modaleTexte}">
        <span id="friendProfileConnected" class="text-green-500">${imTexts.modalesFriendProfileConnected}</span>
        <span id="friendProfileDisconnected" class="text-red-500">${imTexts.modalesFriendProfileDisconnected}</span>
        <div class="h-[3px]"></div>
        <span id="friendProfileFriendRemove" class="${TCS.modaleTexteLink}">${imTexts.modalesFriendProfileFriendRemove}</span>
      </div>
    </div>
  </div>
 
  <div class="h-[30px]"></div>

  <span class="${TCS.modaleTexte} text-[24px]">Pong</span>
  <div id="modalePongStats" class="${TCS.modaleTexte}">
  ${await pongWinRate()}</div>
  <!-- <div id="modalePongStatsLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfilePongStatsLink}</div> -->

    <div class="h-[30px]"></div>

  <span class="${TCS.modaleTexte} text-[24px]">Tetris</span>
  <div id="modaleTetrisStats" class="${TCS.modaleTexte}">
    ${await tetrisBestScore()}</div>
  <!-- <div id="modaleTetrisStatsLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfileTetrisStatsLink}</div> -->

  <div class="h-[30px]"></div>

`;
  if (modale.content)
  modale.content.innerHTML = ProfileHTML;
  //return ProfileHTML;
}

export const modaleFriendProfileEvents = () => {

  const friendProfileBack =   document.getElementById('friendProfileBack') as HTMLAnchorElement;
  const friendProfileConnected =   document.getElementById('friendProfileConnected') as HTMLAnchorElement;
  const friendProfileDisconnected =   document.getElementById('friendProfileDisconnected') as HTMLAnchorElement;
  const friendProfileFriendRemove =   document.getElementById('friendProfileFriendRemove') as HTMLAnchorElement;

  friendProfileBack?.addEventListener('click', () => {
    modaleDisplay(ModaleType.FRIEND_LIST);
  });

  friendProfileFriendRemove?.addEventListener('click', () => {
    modaleDisplay(ModaleType.FRIEND_LIST);
  });

  const isConnected = true; // TODO: connecté ?
  if (isConnected) {
    friendProfileConnected.style.display = 'block';
    friendProfileDisconnected.style.display = 'none';
  } else {
    friendProfileConnected.style.display = 'none';
    friendProfileDisconnected.style.display = 'block';
  }
}

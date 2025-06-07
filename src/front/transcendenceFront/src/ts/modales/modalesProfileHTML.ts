import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay } from './modalesCore.ts';

// import avatarImg from '../../medias/avatars/avatar1.png';
import { getFromApi, postToApi, address, user, resetGamesSocket } from "../utils.ts";
// @ts-ignore
import  page from "page";
import {friendList} from "./modalesFriendListHTML.ts";

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
  const history: { gameId: number, players: GameUserInfo[] }[] = get.history.filter((e) => e.players[0].type === 'tetris');
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


export const modaleProfileHTML = async () => {

  let ProfileHTML = `
      
  <div class="flex flex-row items-start justify-start gap-4">
    <div id="profileAvatar" class="${TCS.modaleAvatarProfil} ">
      <img src="${user.getAvatar()}"/>
    </div>
    <div>
      <div id="profileUsername" class="${TCS.modaleTitre}">${user.getUsername()}</div>
      <div id="profileUserEdit" class="${TCS.modaleTexte}">
        <a id="profileUserEditLink" class="${TCS.modaleTexteLink}">
        ${imTexts.modalesProfileUserEdit}</a>
        /
        <a id="profileDeconectLink" class="${TCS.modaleTexteLink}">
        ${imTexts.modalesProfileDeconect}</a>
      </div>
    </div>
  </div>

  <div class="h-[30px]"></div>
  
  <span class="${TCS.modaleTexte} text-[24px]">
  ${imTexts.modalesProfileLanguageTitle}</span>
  <div id="profileUserLanguage" class="${TCS.modaleTexte}">
    fr -
    <span class="${TCS.modaleTexteLink}">en</span> -
    <span class="${TCS.modaleTexteLink}">es</span> -
    <span class="${TCS.modaleTexteLink}">de</span>
  </div>

  <div class="h-[30px]"></div>
  
  <span class="${TCS.modaleTexte} text-[24px]">
  ${imTexts.modalesProfileFriendList + `(${friendList.getFriendList().length})`}</span>
  <div id="modlaleFriendListLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfileFriendListLink}</div>
 
  <div class="h-[30px]"></div>

  <span class="${TCS.modaleTexte} text-[24px]">Pong</span>
  <div id="modalePongStats" class="${TCS.modaleTexte}">
  ${await pongWinRate()}</div>
  <div id="modalePongStatsLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfilePongStatsLink}</div>

    <div class="h-[30px]"></div>

  <span class="${TCS.modaleTexte} text-[24px]">Tetris</span>
  <div id="modaleTetrisStats" class="${TCS.modaleTexte}">
    ${await tetrisBestScore()}</div>
  <div id="modaleTetrisStatsLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfileTetrisStatsLink}</div>

  <div class="h-[30px]"></div>

`;

  return ProfileHTML;
}

export const modaleProfileEvents = () => {
  
  const profileAvatar =         document.getElementById('profileAvatar') as HTMLImageElement;
  const profileUserEditLink =   document.getElementById('profileUserEditLink') as HTMLAnchorElement;
  const profileDeconectLink =   document.getElementById('profileDeconectLink') as HTMLAnchorElement;
  const modaleFriendListLink = document.getElementById('modlaleFriendListLink') as HTMLAnchorElement;
  const modalePongStatsLink =   document.getElementById('modalePongStatsLink') as HTMLAnchorElement;
  const modaleTetrisStatsLink = document.getElementById('modaleTetrisStatsLink') as HTMLAnchorElement;

  profileAvatar?.addEventListener('click', () => {
    modaleDisplay(ModaleType.AVATAR);
  });

  profileUserEditLink?.addEventListener('click', () => {
    modaleDisplay(ModaleType.EDIT_PROFILE);
  });

  profileDeconectLink?.addEventListener('click', () => {
    const username = { username: user.getUsername()};
    resetGamesSocket("home");
    postToApi(`http://${address}/api/user/logout`, username)
        .then(() => {
          localStorage.clear();
          user.setToken(null);
          friendList.resetFriendList(); // Reset friend list
          page("/");
        })
        .catch((error) => {
          console.error("Error logging out:", error.status, error.message);
          alert(error.message);
        });
  });

  modaleFriendListLink?.addEventListener('click', () => {
    // console.log("profileFriendListLink <<<<<<<<");
    modaleDisplay(ModaleType.FRIEND_LIST);
  });

  modalePongStatsLink?.addEventListener('click', () => {
    modaleDisplay(ModaleType.PONG_STATS);
  });

  modaleTetrisStatsLink?.addEventListener('click', () => {
    modaleDisplay(ModaleType.TETRIS_STATS);
  });
}

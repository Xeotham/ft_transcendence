import { TCS } from '../TCS.ts';
import { imTexts, language, imSetLanguage, SupportedLanguages } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay } from './modalesCore.ts';

// import avatarImg from '../../medias/avatars/avatar1.png';
import { getFromApi, postToApi, address, user, resetGamesSocket } from "../utils.ts";
// @ts-ignore
import  page from "page";
import { friendList } from "./modalesFriendListHTML.ts";

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
  try {
    const stats = await getFromApi(`http://${address}/api/user/get-stat?username=${user.getUsername()}`);
    const victories: number = stats.stats.pongWin;
    let defeats: number = stats.stats.pongLose;
    return `${imTexts.modalesProfileWinrate}: ${victories} ${imTexts.modalesProfileVictories} / ${defeats} ${imTexts.modalesProfileDefeats}`;
  }
  catch (error) {
    return "Error fetching Pong stats";
  }
}

const tetrisBestScore = async () => {
  try {
    const get: any = await getFromApi(`http://${address}/api/user/get-game-history?username=${user.getUsername()}`);
    const history: {
      gameId: number,
      players: GameUserInfo[]
    }[] = get.history.filter((e: any) => e.players[0].type === 'tetris');
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
  catch (error) {
    return "Error fetching Tetris stats";
  }
}


export const modaleProfileHTML = async () => {

  let ProfileHTML = `
      
  <div class="flex flex-row items-start justify-start gap-4">
    <div id="profileAvatar" class="${TCS.modaleAvatarProfil}">
      <img src="${user.getAvatar()}"/>
    </div>
    <div>
      <div id="profileUsername" class="${TCS.modaleTitre}">${user.getUsername()}</div>
      <div id="profileUserEdit" class="${TCS.modaleTexte}">
        <a id="profileUserEditLink" class="${TCS.modaleTexteLink}">${imTexts.modalesProfileUserEdit}</a>
        /
        <a id="profileDeconectLink" class="${TCS.modaleTexteLink}">${imTexts.modalesProfileDeconect}</a>
      </div>
    </div>
  </div>

  <div class="h-[30px]"></div>
  
  <span class="${TCS.modaleTexte} text-[24px]">${imTexts.modalesProfileLanguageTitle}</span>
  <div id="profileUserLanguage" class="${TCS.modaleTexte}">
    <span id="profileUserLanguageFR" class="${TCS.modaleTexte}">FR</span>
    <span id="profileUserLanguageEN" class="${TCS.modaleTexte}">EN</span>
    <span id="profileUserLanguageES" class="${TCS.modaleTexte}">ES</span>
    <span id="profileUserLanguageDE" class="${TCS.modaleTexte}">DE</span>
  </div>

  <div class="h-[30px]"></div>
  
  <div class="${TCS.modaleTexte} text-[24px]">${imTexts.modalesProfileFriendList} (${friendList.getFriendList().length})</div>
  <div id="modlaleFriendListLink" class="${TCS.modaleTexteLink}">${imTexts.modalesProfileFriendListLink}</div>
 
  <div class="h-[30px]"></div>

  <div class="${TCS.modaleTexte} text-[24px]">Pong</div>
  <div id="modalePongStats" class="${TCS.modaleTexte}">${await pongWinRate()}</div>
  <div id="modalePongStatsLink" class="${TCS.modaleTexteLink}">${imTexts.modalesProfilePongStatsLink}</div>

  <div class="h-[30px]"></div>

  <div class="${TCS.modaleTexte} text-[24px]">Tetris</div>
  <div id="modaleTetrisStats" class="${TCS.modaleTexte}">${await tetrisBestScore()}</div>
  <div id="modaleTetrisStatsLink" class="${TCS.modaleTexteLink}">${imTexts.modalesProfileTetrisStatsLink}</div>

  <div class="h-[30px]"></div>
`;

  return ProfileHTML;
}

//imTextsSet(imTextsJson[language]);

const profileUserLanguageEvents = () => {
  // console.log("language", language);

  if (language != 'fr') {
    const profileUserLanguageFR = document.getElementById('profileUserLanguageFR') as HTMLSpanElement;
    if (profileUserLanguageFR) {
      profileUserLanguageFR.className = TCS.modaleTexteLink;
      profileUserLanguageFR.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        setLanguage('fr', e);
      });
    }
  }

  if (language != 'en') {
    const profileUserLanguageEN = document.getElementById('profileUserLanguageEN') as HTMLSpanElement;
    if (profileUserLanguageEN) {
      profileUserLanguageEN.className = TCS.modaleTexteLink;
      profileUserLanguageEN.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        setLanguage('en', e);
      });
    }
  }

  if (language != 'es') {
    const profileUserLanguageES = document.getElementById('profileUserLanguageES') as HTMLSpanElement;
    if (profileUserLanguageES) {
      profileUserLanguageES.className = TCS.modaleTexteLink;
      profileUserLanguageES.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        setLanguage('es', e);
      });
    }
  }

  if (language != 'de') {
    const profileUserLanguageDE = document.getElementById('profileUserLanguageDE') as HTMLSpanElement;
    if (profileUserLanguageDE) {
      profileUserLanguageDE.className = TCS.modaleTexteLink;
      profileUserLanguageDE.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        setLanguage('de', e);
      });
    }
  }

  const setLanguage = (language: string, e: Event) => {
    // console.log("setLanguage", language);
    e.stopPropagation();
    imSetLanguage(language as SupportedLanguages);
    modaleDisplay(ModaleType.NONE);
    page.show(document.location.pathname);
    modaleDisplay(ModaleType.PROFILE);
  }
}

export const modaleProfileEvents = () => {
  
  const profileAvatar =         document.getElementById('profileAvatar') as HTMLImageElement;
  const profileUserEditLink =   document.getElementById('profileUserEditLink') as HTMLAnchorElement;
  const profileDeconectLink =   document.getElementById('profileDeconectLink') as HTMLAnchorElement;
  const modaleFriendListLink = document.getElementById('modlaleFriendListLink') as HTMLAnchorElement;
  const modalePongStatsLink =   document.getElementById('modalePongStatsLink') as HTMLAnchorElement;
  const modaleTetrisStatsLink = document.getElementById('modaleTetrisStatsLink') as HTMLAnchorElement;

  profileAvatar?.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    modaleDisplay(ModaleType.AVATAR);
  });

  profileUserEditLink?.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    modaleDisplay(ModaleType.EDIT_PROFILE);
  });

  profileDeconectLink?.addEventListener('click', (e: Event) => {
    e.stopPropagation();
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

  modaleFriendListLink?.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    modaleDisplay(ModaleType.FRIEND_LIST);
  });

  modalePongStatsLink?.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    modaleDisplay(ModaleType.PONG_STATS);
  });

  modaleTetrisStatsLink?.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    modaleDisplay(ModaleType.TETRIS_STATS);
  });

  profileUserLanguageEvents();
}

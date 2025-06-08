import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { modaleDisplay, ModaleType} from './modalesCore.ts';

import { address, getFromApi, postToApi, user, UserInfo } from "../utils.ts";
import { friendList, loadFriendList } from "./modalesFriendListHTML.ts";
// @ts-ignore
import page from "page";


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
		const stats = await getFromApi(`http://${address}/api/user/get-stat?username=${friendList.getActualFriend()?.username}`);
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
		const get: any = await getFromApi(`http://${address}/api/user/get-game-history?username=${friendList.getActualFriend()?.username}`);
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
					console.log(player.score, score);
				score = player.score;
			})
		})
		return `${imTexts.modalesProfileBestScore}: ${score}pts`;
	}
	catch (error) {
		return "Error fetching Tetris stats";
	}
}

export const modaleFriendProfileHTML = async () => {

	let ProfileHTML = `
  <div id="friendProfileBack" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesFriendProfileBack}</div>

  <div class="h-[7px]"></div>

  <div class="flex flex-row items-start justify-start gap-4">
    <div id="friendProfileAvatar" class="${TCS.modaleAvatarProfilFriend} ">
      <img src="${URL.createObjectURL(UserInfo.base64ToBlob(friendList.getActualFriend()?.avatar!))}"/>
    </div>
    <div>
      <div id="friendProfileName" class="${TCS.modaleTitre}">${friendList.getActualFriend()?.username}</div>
      <div id="friendProfileStatus" class="${TCS.modaleTexte}">
        <span id="friendProfileConnected" class="text-lime-400">${imTexts.modalesFriendProfileConnected}</span>
        <span id="friendProfileDisconnected" class="text-rose-700">${imTexts.modalesFriendProfileDisconnected}</span>
        <div class="h-[3px]"></div>
        <span id="friendProfileFriendRemove" class="${TCS.modaleTexteLink}">${imTexts.modalesFriendProfileFriendRemove}</span>
      </div>
    </div>
  </div>
 
  <div class="h-[30px]"></div>

  <span class="${TCS.modaleTexte} text-[24px]">Pong</span>
  <div id="modalePongStats" class="${TCS.modaleTexte}">
  ${await pongWinRate()}</div>
  <div id="modaleFriendPongStatsLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfilePongStatsLink}</div>

    <div class="h-[30px]"></div>

  <span class="${TCS.modaleTexte} text-[24px]">Tetris</span>
  <div id="modaleTetrisStats" class="${TCS.modaleTexte}">
    ${await tetrisBestScore()}</div>
  <div id="modaleFriendTetrisStatsLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfileTetrisStatsLink}</div>

  <div class="h-[30px]"></div>

`;
	return ProfileHTML;
}

export const modaleFriendProfileEvents = () => {

	const friendProfileBack =   document.getElementById('friendProfileBack') as HTMLAnchorElement;
	const friendProfileConnected =   document.getElementById('friendProfileConnected') as HTMLAnchorElement;
	const friendProfileDisconnected =   document.getElementById('friendProfileDisconnected') as HTMLAnchorElement;
	const friendProfileFriendRemove =   document.getElementById('friendProfileFriendRemove') as HTMLAnchorElement;
	const friendPongStats = document.getElementById('modaleFriendPongStatsLink') as HTMLAnchorElement;
	const friendTetrisStats = document.getElementById('modaleFriendTetrisStatsLink') as HTMLAnchorElement;

	friendProfileBack?.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		friendList.setActualFriend(null);
		modaleDisplay(ModaleType.FRIEND_LIST);
	});

	friendProfileFriendRemove?.addEventListener('click', async (e: Event) => {
		e.stopPropagation();
		try {
			await postToApi(`http://${address}/api/user/delete-friend`, { username: user.getUsername(), usernameFriend: friendList.getActualFriend()?.username });
		}
		catch (e) {
			console.error("Error removing friend:", e);
		}
		friendList.setActualFriend(null);
		await loadFriendList()
		modaleDisplay(ModaleType.FRIEND_LIST);
	});

	friendPongStats?.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		modaleDisplay(ModaleType.FRIEND_PONG_STATS);
	})

	friendTetrisStats?.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		modaleDisplay(ModaleType.FRIEND_TETRIS_STATS);
	});

	const isConnected = friendList.getActualFriend()?.connected;
	if (isConnected) {
		friendProfileConnected.style.display = 'block';
		friendProfileDisconnected.style.display = 'none';
	}
	else {
		friendProfileConnected.style.display = 'none';
		friendProfileDisconnected.style.display = 'block';
	}
}

import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay } from './modalesCore.ts';
import {getFromApi, UserInfo, address, user} from "../utils.ts";

let friendListPage = 0;

interface friendList {
	username:   string;
	avatar:     string;
	connected:  boolean;
}
//
// interface GameUserInfo
// {
// 	date: 	 string;
// 	username : string;
// 	userId: number;
// 	score: 	number;
// 	winner: boolean;
// 	type: 	string;
// }

export const friendList = new class {
	private friendList: friendList[];
	private actualFriend: friendList | null;
	constructor() {
		this.friendList = [];
		this.actualFriend = null;
	}

	getActualFriend() {
		return this.actualFriend;
	}

	setActualFriend(actualFriend: number | null) {
		if (actualFriend === null)
			return this.actualFriend = null;
		this.actualFriend = this.friendList[actualFriend];
	}

	getFriendList() {
		return this.friendList;
	}

	setFriendList(friendList: friendList[]) {
		this.friendList = friendList;
	}

	resetFriendList() {
		this.friendList = [];
		this.actualFriend = null;
	}
}

export const  loadFriendList = async () => {
	try {
		const get: any = await getFromApi(`http://${address}/api/user/get-friends?username=${user.getUsername()}`);
		friendList.setFriendList(get.friendList);
	}
	catch (error) {
		console.error("Error loading friend list:", error);
		friendList.resetFriendList();
	}
}

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
	const   friend = friendList.getFriendList()[index + (friendListPage * 10)];
	if (!friend) {
		return "";
	}

	const   avatar = URL.createObjectURL(UserInfo.base64ToBlob(friend.avatar));
	let formattedFriend = `
	<img src="${avatar}" class="${ friend.connected ? TCS.gameFriendImg + " border-green-500" : TCS.gameFriendImg + " border-red-500"}" alt="friend avatar"/>
	<span class="${TCS.modaleFriendList}" id="friendListLine${index}">
		${friend.username}
	</span>`; // TODO: remplacer par le nom de l'ami

	return formattedFriend;
}

const getModaleFriendListListHTML = (page: number) => {

	friendListPage = page;
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
		if ((friendListPage + 1) * 10 <= friendList.getFriendList().length)
			modaleFriendListHTML(++friendListPage);
	});


	for (let i = 0; i < 10; i++) {
		const friendListLine = document.getElementById('friendListLine' + i) as HTMLAnchorElement;
		friendListLine.addEventListener('click', () => {
			// console.log("friendListLine <<<<<<<<");
			friendList.setActualFriend(i + (friendListPage * 10));
			modaleDisplay(ModaleType.FRIEND_PROFILE);
		});
	}
}

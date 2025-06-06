import {TCS} from '../TCS.ts';
import {imTexts} from '../imTexts/imTexts.ts';
import {modaleAlert, modaleDisplay, ModaleType} from './modalesCore.ts';
import {address, getFromApi, postToApi, user, UserInfo} from "../utils.ts";

let friendListPage = 0;

interface friendList {
	username:   string;
	avatar:     string;
	connected:  boolean;
}

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
	<div id="friendListLine${index}" class="w-full h-[40px] pb-[5px] flex flex-row-2 mb-[5px]">
		<div class="w-[40px] h-[40px]">
			<img src="${avatar}" class="${ friend.connected ? TCS.gameFriendImg + " border-green-500" : TCS.gameFriendImg + " border-red-500"}" alt="friend avatar"/>
		</div>
		<div class="${TCS.modaleFriendList} w-full h-[40px]">
			${friend.username}
			<span class="text-stone-950">
			&nbsp;&nbsp;&nbsp;${imTexts.modalesFriendListView}</span>
		</div>
	</div>
	`;

	return formattedFriend;
}

const getModaleFriendListListHTML = (page: number) => {

	friendListPage = page;
	let listHTML = `
		<form id="friendSearchForm" class="${TCS.form}">
			<input id="friendSearchInput" name="friendSearch" type="text" placeholder=" " class="${TCS.formInput}">		
			<label for="friendSearch" class="${TCS.formLabel}">${imTexts.modalesFriendListUsername}</label>
			<button id="friendSearchButton" type="submit" class="${TCS.formButton}">${imTexts.modalesFriendListAdd}</button>
		</form>
		<div id="modaleAlert" class="${TCS.modaleTexte}"></div>
		<div class="h-[20px]"></div>
	`;


	for (let i = 0; i < 6; i++) { // TODO: remplacer par le nombre d'amis
		listHTML += `
      <div id="friendListLine${i}" class="${TCS.modaleTexte}">
      ${formatFriendListLine(i)}</div>
    `;
	}

	listHTML += `  <div class="h-[10px]"></div>

  <div id="friendListPrevNext" class="${TCS.modaleTexte}">
    <a id="friendListPrev" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesFriendListPrev}</a>
    <span id="friendSlash">/</span>
    <a id="friendListNext" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesFriendListNext}</a>
  </div>`;

	listHTML += `
  <div class="h-[10px]"></div>
  `;

	return listHTML;
}

export const modaleFriendListEvents = () => {

	const   friendListBack = document.getElementById('friendListBack') as HTMLAnchorElement;
	const   friendListPrev = document.getElementById('friendListPrev') as HTMLAnchorElement;
	const   friendListNext = document.getElementById('friendListNext') as HTMLAnchorElement;
	const   friendSearch = document.getElementById('friendSearchForm') as HTMLFormElement;

	if (!friendListBack || !friendListPrev || !friendListNext || !friendSearch)
		return;

	friendSearch.addEventListener('submit', async (e) => {
		e.preventDefault();
		try {
			const friendName = (document.getElementById('friendSearchInput') as HTMLInputElement).value;
			await postToApi(`http://${address}/api/user/add-friend`, { username: user.getUsername(), usernameFriend: friendName });
			await loadFriendList();
			await modaleDisplay(ModaleType.FRIEND_LIST);

		}
		catch (e: any) {
			console.error("Error adding friend:", e.message);
			await modaleDisplay(ModaleType.FRIEND_LIST);
			modaleAlert(e.message);
		}
	})

	friendListBack.addEventListener('click', () => {
		modaleDisplay(ModaleType.PROFILE);
	});

	friendListPrev.addEventListener('click', () => {
		if (friendListPage <= 0)
			return;
		modaleFriendListHTML(--friendListPage);
		modaleDislpayPrevNextFriend();
	});

	friendListNext.addEventListener('click', () => {
		if (friendListPage >= 10) // TODO: remplacer par le nombre de pages
			return;
		if ((friendListPage + 1) * 10 <= friendList.getFriendList().length) {
			modaleDislpayPrevNextFriend();
			modaleFriendListHTML(++friendListPage);
		}
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

export const modaleDislpayPrevNextFriend = () => {

	const prev = document.getElementById('friendListPrev');
	const next = document.getElementById('friendListNext');
	const slash = document.getElementById('friendSlash');

	const isNext = friendList.getFriendList().length - (friendListPage * 10) > 10;

	// console.log("PREV " + isNext);
	// console.log("Prev " + prev);
	// console.log("Next " + next);
	// console.log("slash " + slash);


	if (!isNext)
		next?.classList.add('hidden');
	if (friendListPage === 0)
		prev?.classList.add('hidden');
	if (!isNext || friendListPage === 0)
		slash?.classList.add('hidden');

}


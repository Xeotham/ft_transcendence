import { TCS} from '../TCS.ts';
import { imTexts} from '../imTexts/imTexts.ts';
import { modaleAlert, modaleDisplay, ModaleType, modale } from './modalesCore.ts';
import { address, getFromApi, postToApi, user, UserInfo } from "../utils.ts";

let 	friendListPage = 0;
const 	friendListLength = 6;

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

	if (friendList.getFriendList().length === 0)
		friendListHTML += `<div class="${TCS.modaleTexteGris}">${imTexts.modalesFriendListNoFriends}</div>`;

	friendListHTML += `
    <div class="h-[30px]"></div>
  </div>
  `;

	return friendListHTML;
}

const formatFriendListLine = (index: number) => {
	const   friend = friendList.getFriendList()[index + (friendListPage * friendListLength)];
	if (!friend) {
		return "";
	}
	//colors: ["#a3e635", "#be123c"], //lime-400, rose-700

	const   avatar = URL.createObjectURL(UserInfo.base64ToBlob(friend.avatar));
	let formattedFriend = `
	<div id="friendListLine${index}" class="w-full h-[40px] pb-[5px] flex flex-row-2 mb-[5px]">
		<div class="w-[40px] h-[40px]">
			<img src="${avatar}" class="${ friend.connected ? TCS.gameFriendImg + " border-lime-400" : TCS.gameFriendImg + " border-rose-700"}" alt="friend avatar"/>
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
			<label for="friendSearchInput" class="${TCS.formLabel}">${imTexts.modalesFriendListUsername}</label>
			<div class="h-[10px]"></div>
			<button id="friendSearchButton" type="submit" class="${TCS.formButton}">${imTexts.modalesFriendListAdd}</button>
		</form>
		<div class="h-[10px]"></div>
		<div id="modaleAlert" class="${TCS.modaleTexte}"></div>
		<div class="h-[10px]"></div>
	`;

	for (let i = 0; i < friendListLength; i++) {
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

	friendSearch?.addEventListener('submit', async (e: Event) => {
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

	friendListBack?.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		modaleDisplay(ModaleType.PROFILE);
	});

	friendListPrev?.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		if (friendListPage <= 0 || !modale.content)
			return;
		modale.content.innerHTML = modaleFriendListHTML(--friendListPage);
		modaleDislpayPrevNextFriend();
		modaleFriendListEvents();
	});

	friendListNext.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		if (friendListPage >= friendListLength || !modale.content)
			return;
		if ((friendListPage + 1) * friendListLength <= friendList.getFriendList().length) {
			modale.content.innerHTML = modaleFriendListHTML(++friendListPage);
			modaleDislpayPrevNextFriend();
			modaleFriendListEvents();
		}
	});


	for (let i = 0; i < 10; i++) {
		const friendListLine = document.getElementById('friendListLine' + i) as HTMLAnchorElement;
		if (!friendListLine)
			continue;
		friendListLine.addEventListener('click', (e: Event) => {
			e.stopPropagation();
			friendList.setActualFriend(i + (friendListPage * friendListLength));
			modaleDisplay(ModaleType.FRIEND_PROFILE);
		});
	}
}

export const modaleDislpayPrevNextFriend = () => {
	
	const prev = document.getElementById('friendListPrev');
	const next = document.getElementById('friendListNext');
	const slash = document.getElementById('friendSlash');

	const isNext = friendList.getFriendList().length - (friendListPage * friendListLength) > friendListLength;

	if (!isNext)
		next?.classList.add('hidden');
	if (friendListPage === 0)
		prev?.classList.add('hidden');
	if (!isNext || friendListPage === 0)
		slash?.classList.add('hidden');

}


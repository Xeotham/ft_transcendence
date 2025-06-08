import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { modaleDisplay, ModaleType } from './modalesCore.ts';
import { patchToApi, address, user, UserInfo, getFromApi } from "../utils.ts";
import { modaleAlert } from './modalesCore.ts';

let   defaultAvatars: { url: string, base64: string }[] = [];

export const    loadDefaultAvatars = async () => {
	try {
		const avatars: string[] = (await getFromApi(`http://${address}/api/user/get-avatars`)).avatars;

		avatars.forEach((avatar) => {
			defaultAvatars.push({
				url: URL.createObjectURL(UserInfo.base64ToBlob(avatar)),
				base64: avatar
			})
		})
	}
	catch(err) {
		window.location.reload();
	}
}

export let modaleAvatarHTML = () => {
	let AvatarHTML = `
	<div id="titre_avatar" class="${TCS.modaleTitre}">
	${imTexts.modalesAvatarTitle}</div>
	
	<div id="avatarBack" class="${TCS.modaleTexteLink}">
	${imTexts.modalesAvatarBack}</div>

	<div class="h-[30px]"></div>

	<div class="grid grid-cols-6 gap-x-[21px] gap-y-[21px]">
`;

	AvatarHTML += showDefaultAvatars();

	AvatarHTML += `
	<div class="h-[1Xpx]"></div>

	</div>
		<div id="upload">
			<div class="${TCS.modaleTexte} text-[24px]">${imTexts.modalesAvatarUploadTitle}</div>
			<label for="uploadAvatar" class="${TCS.modaleTexte} ${TCS.formButton} cursor-pointer">
				${imTexts.modalesAvatarUploadLink}
				<input type="file" id="uploadAvatar" file-type="image/*" accept="image/*" class="hidden" />
			</label>
		</div>
	
	<div class="h-[5px]"></div>

	<div id="modaleAlert" class="${TCS.modaleTexte}"></div>

	<div class="h-[25px]"></div>
	`;

	return AvatarHTML;
}

const   showDefaultAvatars = () => {
	let     avatarHTML = '';

	defaultAvatars.forEach((avatar, index) => {
		const   url = avatar.url;
		avatarHTML += `
			<div id="profileAvatar${index}" class="${TCS.modaleAvatarChoose}">
				<img id="avatar${index}" src="${url}"/>
			</div>
		`;
	})
	return avatarHTML;
}

const imageToBase64 = (imageElement: HTMLImageElement): string => {
	// Create a canvas element
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	if (!context) {
		throw new Error('Failed to get canvas context');
	}

	// Set canvas dimensions to match the image
	canvas.width = 200;
	canvas.height = 200;

	// Draw the image onto the canvas
	context.drawImage(imageElement, 0, 0, 200, 200);

	// Get the Base64 string (default is 'image/png')
	return canvas.toDataURL('image/png').split(',')[1]; // Remove the data URL prefix
}

const processUploadedAvatar = (uploadedAvatar: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		// Check if the file is an image
		if (!uploadedAvatar.type.startsWith('image/')) {
			return reject(new Error('The uploaded file is not an image.'));
		}

		const reader = new FileReader();

		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				try {
					// Use the existing imageToBase64 function
					const base64String = imageToBase64(img);
					resolve(base64String);
				} catch (error) {
					reject(new Error('Failed to convert image to Base64.'));
				}
			};

			img.onerror = () => {
				reject(new Error('Failed to load the image.'));
			};

			img.src = reader.result as string; // Set the image source to the FileReader result
		};

		reader.onerror = () => {
			reject(new Error('Failed to read the file.'));			
		};

		reader.readAsDataURL(uploadedAvatar); // Read the file as a data URL
	});
};

export const modaleAvatarEvents = async () => {
	const   avatarBack = document.getElementById('avatarBack') as HTMLAnchorElement;
	const   uploadedAvatar = (document.getElementById('uploadAvatar') as HTMLInputElement)
	let     avatarBase64: string | undefined;

	if (!avatarBack) {
		return;
	}

	avatarBack.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		modaleDisplay(ModaleType.PROFILE);
	});

	uploadedAvatar.addEventListener("change", async event => {
		const   fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			const   file = fileInput.files[0];
			try {
				avatarBase64 = await processUploadedAvatar(file);
				patchToApi(`http://${address}/api/user/update-avatar`, {username: user.getUsername(), avatar: avatarBase64});
				user.setAvatar(avatarBase64);
				modaleDisplay(ModaleType.PROFILE);
			} catch (error) {
				console.error('Error processing uploaded avatar:', error);
				modaleAlert('Error processing uploaded avatar.');
			}
		}
	})

	for (let i = 0; i < 24; i++) {
		const avatar = document.getElementById(`profileAvatar${i}`) as HTMLDivElement;
		if (!avatar)
			continue;
		avatar.addEventListener('click', async (e: Event) => {
			e.stopPropagation();
			if (!avatar)
				return;
			user.setAvatar(defaultAvatars[i].base64);
			patchToApi(`http://${address}/api/user/update-avatar`, {username: user.getUsername(), avatar: defaultAvatars[i].base64}).catch();
			modaleDisplay(ModaleType.PROFILE);
		})
	}
}
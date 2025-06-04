import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { modaleDisplay, ModaleType } from './modalesCore.ts';
import {address, user} from "../immanence.ts";
import {patchToApi} from "../utils.ts";
import { modaleAlert } from './modalesCore.ts';


export let modaleAvatarHTML = () => {
	let AvatarHTML = `
	<div id="titre_avatar" class="${TCS.modaleTitre}">
	${imTexts.modalesAvatarTitle}</div>
	
	<div id="avatarBack" class="${TCS.modaleTexteLink}">
	${imTexts.modalesAvatarBack}</div>

	<div class="h-[30px]"></div>

	<div class="grid grid-cols-6 gap-x-[21px] gap-y-[21px]">
`;

	for (let i = 0; i < 24; i++) {
		AvatarHTML += `
    <div id="profileAvatar${i}" class="${TCS.modaleAvatarChoose}">
      <img id="avatar${i}" src="/src/medias/avatars/avatar${i+1}.png"/>
    </div>
  `;
	}

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

	avatarBack.addEventListener('click', () => {
		modaleDisplay(ModaleType.PROFILE);
	});

	uploadedAvatar.addEventListener("change", async event => {
		const   fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			const   file = fileInput.files[0];
			try {
				avatarBase64 = await processUploadedAvatar(file);
				user.setAvatar(avatarBase64);
				patchToApi(`http://${address}/api/user/update-user`, {username: user.getUsername(), type: "avatar", update: avatarBase64});
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
		avatar.addEventListener('click', async () => {
			const   img = new Image();
			img.src = `http://localhost:5000/src/medias/avatars/avatar${i+1}.png`;

			const   avatar = imageToBase64(img);

			if (!avatar)
				return;
			user.setAvatar(avatar);
			patchToApi(`http://${address}/api/user/update-user`, {username: user.getUsername(), type: "avatar", update: avatar})
			modaleDisplay(ModaleType.PROFILE);
		})
	}
}
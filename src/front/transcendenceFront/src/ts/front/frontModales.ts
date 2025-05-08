///////////////////////////////////////////
// Imports

///////////////////////////////////////////
// Variables

export enum ModaleType {
  NONE = 'NONE',
  SIGNIN = 'SIGNIN',
  SIGNUP = 'SIGNUP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  VERIFY_EMAIL_SUCCESS = 'VERIFY_EMAIL_SUCCESS',
  VERIFY_EMAIL_ERROR = 'VERIFY_EMAIL_ERROR',
}

export let modale = {
  type: ModaleType.SIGNIN,
  show: false,
  element: <HTMLDivElement|null>null,
};

///////////////////////////////////////////
// Functions

export const initModale = () => {
  modale.type = ModaleType.NONE;
  modale.show = false;
  modale.element = document.querySelector<HTMLDivElement>('div[name="zoneModale"]');
  hideModale();
}

export const showModale = (modaleType: ModaleType, modaleContent: string) => {
  if (modale.element) {
    modale.type = modaleType;
    modale.element.innerHTML = modaleContent;
    while (modale.element.classList.contains('hidden')) {
      modale.element.classList.remove('hidden');
    }
    modale.element.classList.add('block');
    modale.show = true;

    closeIconAdd(); // a tester
  }
}

export const hideModale = () => {
  if (modale.element) {
    modale.type = ModaleType.NONE;
    modale.element.innerHTML = '';
    while (modale.element.classList.contains('block')) {
      modale.element.classList.remove('block');
    }
    modale.element.classList.add('hidden');
    modale.show = false;
  }
}

export const closeIconAdd = () => {
  const closeIcon = document.querySelector<HTMLDivElement>('div[id="closeIcon"]');
  if (!closeIcon) return;

  while (closeIcon.classList.contains('hidden')) {
    closeIcon.classList.remove('hidden');
  }
  closeIcon.classList.add('block');

  closeIcon.addEventListener('click', () => {
    hideModale();
  });
}

export const closeIconRemove = () => {
  const closeIcon = document.querySelector<HTMLDivElement>('div[id="closeIcon"]');
  if (!closeIcon) return;

  while (closeIcon.classList.contains('block')) {
    closeIcon.classList.remove('block');
  }
  closeIcon.classList.add('hidden');

  closeIcon.removeEventListener('click', () => {
  });
}


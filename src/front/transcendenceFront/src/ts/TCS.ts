import '../style/style.css'

///////////////////////////////////////////
//  Tailwind Class Strings 
export const TCS = {
    
    // zonePong 
    zonePong : "relative flex w-full h-full bg-gradient-to-b from-amber-400 to-yellow-600",
    zonePongShadow : "shadow-[inset_-30px_0_25px_-3px_rgba(0,0,0,0.45)]",

    // zoneTetris   
    zoneTetris : "relative flex w-full h-full bg-gradient-to-t from-lime-50 to-slate-200",
    zoneTetrisShadow : "shadow-[inset_30px_0_25px_-3px_rgba(12,10,9,0.35)]", //12, 10, 9
    
    // zoneGame   
    zoneGame : "absolute top-0 left-0 w-full h-full z-50",    
    
    // zoneAvatar
    avatar : "fixed flex top-[20px] w-[100px] h-[100px] z-30", 
    avatarMask : "w-full h-full rounded-full overflow-hidden shadow-xl/40 hover:cursor-pointer hover:rotate-11 hover:scale-110 hover:shadow-xl/80 transition-all duration-200 ease-in-out",
    avatarImg : "w-full h-full object-cover ",
    avatarHidden : "hidden",

    // zoneModale
    zoneModale : "fixed z-40 w-screen h-screen",
    bkgModale : "fixed inset-0 w-screen h-screen backdrop-blur-xs",
    contentModale : "fixed z-40 w-[680px] shadow-xl/30 bg-stone-950 px-8 py-5 top-16 left-1/2 -translate-x-1/2",
    
    modaleClose : "fixed z-50 w-[20px] h-[20px] shadow-xl/30 rounded-xs bg-yellow-600 hover:bg-amber-400 ring-1 ring-amber-400 focus:outline-none flex items-center justify-center absolute top-[10px] right-[10px] cursor-pointer hover:cursor-pointer",
    modaleTitre : "font-sixtyfour text-[28px] relative text-amber-400",
    modaleTexte : "font-sixtyfour text-[14px] relative text-lime-50",
    modaleTexteGris : "font-sixtyfour text-[14px] relative text-stone-400",
    modaleTexteLink : "font-sixtyfour text-[14px] text-yellow-600 hover:text-amber-400 transition-all duration-200 ease-in-out cursor-pointer hover:cursor-pointer underline decoration-yellow-600 hover:decoration-amber-400",
    modaleToRegister : "font-sixtyfour text-[14px] relative text-lime-50",
    modaleAvatarProfil : "w-[100px] h-[100px] border-1 hover:border-8 border-yellow-600 transition-all duration-200 ease-in-out cursor-pointer hover:cursor-pointer",
    modaleAvatarChoose : "w-[86px] h-[86px] border-1 hover:border-6 border-yellow-600 transition-all duration-200 ease-in-out cursor-pointer hover:cursor-pointer relative",
    modaleStatsLine : "font-sixtyfour text-[14px] text-lime-50 grid grid-cols-[120px_1fr_80px] gap-4 items-center",
    modaleFriendList : "font-sixtyfour text-[14px] text-lime-50 font-medium text-left bg-stone-950 hover:bg-amber-400 transition-all duration-250 ease-in-out cursor-pointer hover:cursor-pointer hover:pl-[20px] flex items-center pl-[10px]",
    modaleStatDetail : "font-pixelcode text-[14px] text-lime-50 font-medium text-left",
    modaleStatDetailGrey : "font-pixelcode text-[14px] text-stone-400 font-medium text-left",
    statRow1 : "border-b-1 border-stone-400",
    statCol1 : "border-b-1 border-stone-400",
    statData : "border-b-1 border-stone-400",
    modaleAvatarProfilFriend : "w-[100px] h-[100px] border-1 border-lime-50",


    // formulaire
    form : "font-sixtyfour text-[14px] relative",
    formDivInput : "relative z-0 w-full mb-5 group",
    formInput : "block py-0 px-0 w-full font-sixtyfour text-[14px] text-amber-400 bg-transparent border-0 border-b-1 border-yellow-600 appearance-none focus:outline-none focus:ring-0 focus:border-lime-50 peer [&:not(:placeholder-shown)]:border-lime-50 cursor-text",
    formLabel : "absolute font-sixtyfour text-[14px] text-yellow-600 peer-focus:font-medium duration-300 transform -translate-y-[20px] scale-100 top-[0px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-lime-50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-[20px] peer-[&:not(:placeholder-shown)]:text-lime-50",
    formInputTetrisMultiplayer : "block py-0 px-0 w-full font-sixtyfour text-[14px] text-stone-950 bg-transparent border-0 border-b-1 border-yellow-600 appearance-none focus:outline-none focus:ring-0 peer cursor-text",
    formLabelTetrisMultiplayer : "absolute font-sixtyfour text-[14px] text-yellow-600 peer-focus:font-medium duration-300 transform -translate-y-[20px] scale-100 top-[0px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-lime-50/0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-[20px] peer-[&:not(:placeholder-shown)]:text-lime-50/0",
    formButton : "flex justify-left w-full pt-[20px] text-lime-50 bg-yellow-600 hover:bg-amber-400 hover:text-black transition-all duration-200 ease-in-out cursor-pointer hover:cursor-pointer",
    formInputNumber :    "w-[80px] py-[2px] border-1 text-yellow-600 p-[2px] border-2 border-[#d6d3d1] bg-white transition-all duration-200 ease-in-out cursor-pointer hover:cursor-pointer",
    formInputNumberBkg : "w-[80px] py-[2px] bg-transparent border-none appearance-none focus:outline-none focus:ring-0 focus:border-yellow-600",

    // PONG
    pongCanvas : "bg-black/80 block w-[800px] h-[400px]",

    pongLogo :   "font-sixtyfour text-[120px] flex items-center justify-center h-full w-full text-lime-50 text-shadow-lg text-shadow-stone-900/40",
    pongTitre : "font-sixtyfour text-[42px] flex items-center justify-center h-full w-full text-lime-50 text-shadow-lg text-shadow-stone-900/40",
    pongNav0 : "flex flex-col items-center justify-center",//fade-in-up
    pongNav1 : "flex flex-col items-center justify-center bg-lime-50 px-[28px] py-[28px] shadow-xl/50",
    pongButton : "font-sixtyfour text-[14px] text-lime-50 bg-yellow-600 shadow-xl/30 px-0 py-0 me-0 mb-[5px] px-[5px] px-[10px] transition-all duration-200 ease-in-out hover:bg-amber-400 hover:scale-110 hover:shadow-xl/50 cursor-pointer hover:cursor-pointer",
    pongText :   "font-sixtyfour text-[14px] text-black font-medium px-5 py-1.5 me-2 mb-2",
    pongNavButton : "font-sixtyfour text-[28px] text-lime-50 bg-yellow-600 hover:bg-amber-400 px-0 py-0 me-0 mb-[5px] px-[5px] px-[10px] transition-all duration-200 ease-in-out hover:scale-110 shadow-xl/30 hover:shadow-xl/50 cursor-pointer hover:cursor-pointer",

    // TETRIS
    tetrisLogo : "font-sixtyfour text-[120px] flex items-center justify-center h-full w-full text-yellow-600 text-shadow-lg text-shadow-stone-900/40",
    tetrisTitre : "font-sixtyfour text-[42px] flex items-center justify-center text-yellow-600 text-shadow-lg text-shadow-stone-900/40",
    tetrisNav0 : "flex flex-col items-center justify-center",//fade-in-up
    tetrisNav1 : "flex flex-col items-center justify-center bg-yellow-600 px-[28px] py-[28px] shadow-xl/50",
    tetrisButton :   "font-sixtyfour text-[14px] text-black bg-yellow-600 hover:bg-amber-400 px-0 py-0 me-0 mb-[5px] px-[5px] px-[10px] transition-all duration-200 ease-in-out hover:scale-110 shadow-xl/30 hover:shadow-xl/50 cursor-pointer hover:cursor-pointer",
    tetrisText :   "font-sixtyfour text-[14px] text-black font-medium px-5 py-1.5 me-2 mb-2",
    tetrisNavButton : "font-sixtyfour text-[28px] text-black bg-slate-200 hover:bg-lime-50 px-0 py-0 me-0 mb-[5px] px-[5px] px-[10px] transition-all duration-200 ease-in-out hover:scale-110 shadow-xl/30 hover:shadow-xl/50 cursor-pointer hover:cursor-pointer",

    tetrisWindowBkg : "fixed z-40 w-[680px] shadow-xl/30 bg-lime-50 px-8 py-5 top-16 left-1/2 -translate-x-1/2",
    tetrisWindowText : "font-sixtyfour text-[14px] relative text-stone-950",
    tetrisEndGame: "fixed z-40 w-[900px] shadow-xl/30 bg-stone-950/85 px-8 py-5 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 align-center justify-center",
    tetrisEndGameDetail: "font-pixelcode text-[14px] text-lime-50 font-medium text-left",
    tetrisEndGameScore: "font-pixelcode text-[50px] text-stone-400 font-medium text-center",
    tetrisEndGameButton: "p-[15px] flex justify-center w-full text-[20px] text-lime-50 bg-yellow-600 hover:bg-amber-400 hover:text-black transition-all duration-200 ease-in-out cursor-pointer hover:cursor-pointer",


    gameTitle : "font-sixtyfour text-[24px] text-amber-900 font-medium text-left",
    gameTexte : "font-sixtyfour text-[14px] relative text-stone-950",
    gameTexteGris : "font-sixtyfour text-[14px] relative text-stone-400",
    gameSelect : "font-sixtyfour text-[14px] pl-[10px] text-lime-50 font-medium text-left bg-yellow-600 hover:bg-amber-400 cursor-pointer hover:cursor-pointer w-full [&>option]:bg-yellow-600",
    gameOption : "bg-yellow-600",
    gameBlockLabel : "font-sixtyfour text-[14px] text-black font-medium text-left",
    gameBlockLink : "font-sixtyfour  text-[14px] w-full h-[40px] pl-[2px] text-lime-50 font-medium text-left bg-yellow-600 hover:bg-amber-400 transition-all duration-200 ease-in-out cursor-pointer hover:cursor-pointer",
    gameList : "font-sixtyfour text-[14px] text-stone-950 font-medium text-left bg-lime-50 hover:bg-amber-400 transition-all duration-250 ease-in-out cursor-pointer hover:cursor-pointer hover:pl-[10px]",
    gameBigButton : "font-sixtyfour text-[24px] text-lime-50 pt-[5px] w-full font-medium text-left bg-yellow-600 hover:bg-amber-400 transition-all duration-200 ease-in-out cursor-pointer hover:cursor-pointer",
    gamePackImg : "w-[616px] h-[100px] hover:border-x-[10px] hover:border-amber-400 hover:scale-105 hover:shadow-xl/60 transition-all duration-250 ease-in-out cursor-pointer hover:cursor-pointer relative",

	gameFriendImg : "w-[40px] h-[40px] border-[3px] inline cursor-pointer hover:cursor-pointer",
}

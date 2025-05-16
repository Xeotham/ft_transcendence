import '../style/style.css'

///////////////////////////////////////////
//  Tailwind Class Strings 
export const TCS = {

    // body
    //html_body : "m-0 h-full overflow-x-hidden",

    // zoneTop
    zoneTop : "absolute fixed left-0 top-0 w-full h-[30px] z-42 bg-gradient-to-t from-slate-50 to-stone-200 shadow-xl/30",
    immanenceLogo : "h-full w-auto ml-[10px] float-left",
    
    // zonePong 
    zonePong : "relative flex top-[30px] w-full h-full bg-gradient-to-b from-amber-400 to-yellow-600",

    // zoneTetris   
    zoneTetris : "relative flex top-[30px] w-full h-full bg-gradient-to-t from-lime-50 to-slate-200",
    
    // zoneModale
    modale : "fixed z-40 w-[680px] shadow-xl/30 bg-black/80 px-8 py-5 top-16 left-1/2 -translate-x-1/2",
    modaleClose : "fixed z-50 w-[20px] h-[20px] shadow-xl/30 rounded-xs bg-yellow-600 hover:bg-amber-400 ring-1 ring-amber-400 focus:outline-none flex items-center justify-center absolute top-[10px] right-[10px]",
    modaleTitre : "font-sixtyfour text-[28px] text-amber-400",
    modaleTexte : "font-sixtyfour text-[14px] relative text-lime-50",
    modaleLink : "text-yellow-600 hover:bg-yellow-600 hover:text-lime-50 hover:decoration-none decoration-yellow-600 underline",
    modaleToRegister : "font-sixtyfour text-[14px] relative text-lime-50",

    // formulaire
    form : "font-sixtyfour text-[14px] relative",
    formDivInput : "relative z-0 w-full mb-5 group",
    formInput : "block py-0 px-0 w-full font-sixtyfour text-[14px] text-amber-400 bg-transparent border-0 border-b-1 border-amber-400 appearance-none focus:outline-none focus:ring-0 focus:border-lime-50 peer [&:not(:placeholder-shown)]:border-lime-50",
    formLabel : "absolute font-sixtyfour text-[14px] text-amber-400 peer-focus:font-medium duration-300 transform -translate-y-[20px] scale-100 top-[0px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-lime-50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-[20px] peer-[&:not(:placeholder-shown)]:text-lime-50",
    formButton : "font-sixtyfour text-[14px] text-lime-50 bg-yellow-600 hover:bg-amber-400 ring-1 ring-amber-400 focus:outline-none font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2",

  // Fontsona3, Fontsona4, Fontsona5, FontsonaQ, PressStart2P, Sixtyfour, PixelifySans, Doto

    // PONG
    pongCanvas : "bg-black/80 block",

    pongLogo :   "font-sixtyfour text-[120px] flex items-center justify-center h-full w-full text-lime-50",
    pongTitre : "font-sixtyfour text-[80px] flex items-center justify-center h-full w-full text-lime-50",
    pongNav0 : "flex flex-col items-center justify-center",
    pongNav1 : "flex flex-col items-center justify-center bg-lime-50 px-[28px] py-[28px] shadow-xl/50",
    pongButton : "font-sixtyfour text-[14px] text-lime-50 bg-yellow-600 hover:bg-amber-400 px-0 py-0 me-0 mb-[5px] px-[5px] px-[10px] transition-all duration-200 ease-in-out hover:scale-110 shadow-xl/30",
    pongText :   "font-sixtyfour text-[14px] text-black font-medium px-5 py-1.5 me-2 mb-2",
    pongNavButton : "font-sixtyfour text-[28px] text-lime-50 bg-yellow-600 hover:bg-amber-400 px-0 py-0 me-0 mb-[5px] px-[5px] px-[10px] transition-all duration-200 ease-in-out hover:scale-110 shadow-xl/30",
    // version arrondie
    //buttonPongNav : "font-fontsonaQ text-[18px] text-lime-50 bg-yellow-600 hover:bg-amber-400 ring-1 ring-amber-400 focus:outline-none font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 transition-all duration-200 ease-in-out hover:scale-110 hover:z-10",
    // version droite
    //subpixel-antialiased  ?

    // TETRIS

    tetrisLogo : "font-sixtyfour text-[120px] flex items-center justify-center h-full w-full text-yellow-600",
    tetrisTitre : "font-sixtyfour text-[80px] flex items-center justify-center h-full w-full text-yellow-600",  
    tetrisNav0 : "flex flex-col items-center justify-center",
    tetrisNav1 : "flex flex-col items-center justify-center bg-yellow-600 px-[28px] py-[28px] shadow-xl/50",
    tetrisButton : "font-sixtyfour text-[14px] text-black font-medium px-5 py-1.5 me-2 mb-2",
    tetrisText :   "font-sixtyfour text-[14px] text-black font-medium px-5 py-1.5 me-2 mb-2",
    tetrisNavButton : "font-sixtyfour text-[28px] text-black bg-slate-200 hover:bg-lime-50 px-0 py-0 me-0 mb-[5px] px-[5px] px-[10px] transition-all duration-200 ease-in-out hover:scale-110 shadow-xl/30 shadow-xl/30",

}




    /*
    old style

    // zoneModale
    modale : "fixed z-40 w-[680px] shadow-xl/30 bg-gradient-to-b from-slate-50 to-stone-200 px-8 py-5 top-16 left-1/2 -translate-x-1/2 rounded-lg",
    modaleClose : "fixed z-50 w-[20px] h-[20px] shadow-xl/30 rounded-xs bg-yellow-600 hover:bg-amber-400 ring-1 ring-amber-400 focus:outline-none flex items-center justify-center absolute top-[10px] right-[10px]",
    modaleTitre : "font-fontsona3 text-[20px]",
    modaleTexte : "font-fontsonaQ text-[12px] relative top-4",
    modaleLink : "font-bold hover:bg-yellow-600 hover:text-lime-50 hover:decoration-lime-50 decoration-wavy decoration-yellow-600 underline",
    modaleToRegister : "font-fontsonaQ text-[12px] relative top-5 ",
    // formulaire
    form : "font-fontsonaQ text-[12px] relative top-4",
    formDivInput : "relative z-0 w-full mb-5 group",
    formInput : "block py-0 px-0 w-full font-fontsonaQ text-[12px] text-gray-900 bg-transparent border-0 border-b-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    formLabel : "peer-focus:font-medium absolute font-fontsonaQ text-[12px] text-gray-500 duration-300 transform -translate-y-3 scale-75 top-0 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3",
    formButton : "font-fontsona4 text-[12px] text-lime-50 bg-yellow-600 hover:bg-amber-400 ring-1 ring-amber-400 focus:outline-none font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2",
    */

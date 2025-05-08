import { 
  setZone, 
  resizeDocument
} from './frontZones.ts'

let outDocumentHandler: EventListener | null = null;
let overzoneTopHandler: EventListener | null = null;
let overPongHandler: EventListener | null = null;
let overTetrisHandler: EventListener | null = null;
let clickPongHandler: EventListener | null = null;
let clickTetrisHandler: EventListener | null = null;
let clickLogoHomeHandler: EventListener | null = null;

///////////////////////////////////////////
// mouseout - HOME
export const evAdOutDocument = () => {
  if (window && !outDocumentHandler) {
    outDocumentHandler = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (!mouseEvent.relatedTarget) {
        setZone('HOME');
      }
    };
    window.addEventListener('mouseout', outDocumentHandler);
  }

  const target = document.querySelector<HTMLDivElement>('div[name="zoneTop"]');
  if (target && !overzoneTopHandler) {
    /*
    overzoneTopHandler = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (mouseEvent.relatedTarget) {
        console.log('over');
        setZone('HOME');
      }
    };
    */
    overzoneTopHandler = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (mouseEvent.relatedTarget !== target) {
        setZone('HOME');
      }
    };
      
    target.addEventListener('mouseover', overzoneTopHandler);    
  }
}
export const evRemOutDocument = () => {
  if (window && outDocumentHandler) {
    window.removeEventListener('mouseout', outDocumentHandler);
    outDocumentHandler = null;
  }

  const target = document.querySelector<HTMLDivElement>('div[name="zoneTop"]');
  if (target && overzoneTopHandler) {
    target.removeEventListener('mouseover', overzoneTopHandler);
    overzoneTopHandler = null;
  }
}

///////////////////////////////////////////
// click - PONG
export const evAdClickPong = () => {
  const target = document.querySelector<HTMLDivElement>('div[name="zonePong"]');
  if (target && !clickPongHandler) {
    clickPongHandler = () => {
      setZone('PONG');
    };
    target.addEventListener('click', clickPongHandler);    
  }
}
export const evRemClickPong = () => {
  const target = document.querySelector<HTMLDivElement>('div[name="zonePong"]');
  if (target && clickPongHandler) {
    target.removeEventListener('click', clickPongHandler);  
    clickPongHandler = null;
  };
}

///////////////////////////////////////////
// click - Tetris
export const evAdClickTetris = () => {
  const target = document.querySelector<HTMLDivElement>('div[name="zoneTetris"]');
  if (target && !clickTetrisHandler) {
    clickTetrisHandler = () => {
      setZone('TETRIS');
    };
    target.addEventListener('click', clickTetrisHandler);    
  }
}
export const evRemClickTetris = () => {
  const target = document.querySelector<HTMLDivElement>('div[name="zoneTetris"]');
  if (target && clickTetrisHandler) {
    target.removeEventListener('click', clickTetrisHandler);
    clickTetrisHandler = null;
  };
}

///////////////////////////////////////////
// over - Pong
export const evAdOverPong = () => {
  const target = document.querySelector<HTMLDivElement>('div[name="zonePong"]');
  if (target && !overPongHandler) {
    overPongHandler = () => {
      setZone('OVER_PONG');
    };
    target.addEventListener('mouseover', overPongHandler);
  }
}
export const evRemOverPong = () => {
  const target = document.querySelector<HTMLDivElement>('div[name="zonePong"]');
  if (target && overPongHandler) {
    target.removeEventListener('mouseover', overPongHandler);
    overPongHandler = null;
  };
}

///////////////////////////////////////////
// over - Tetris
export const evAdOverTetris = () => {
  const target = document.querySelector<HTMLDivElement>('div[name="zoneTetris"]');
  if (target && !overTetrisHandler) {
    overTetrisHandler = () => {
      setZone('OVER_TETRIS');
    };
    target.addEventListener('mouseover', overTetrisHandler);
  }
}
export const evRemOverTetris = () => {
  const target = document.querySelector<HTMLDivElement>('div[name="zoneTetris"]');
  if (target && overTetrisHandler) {
    target.removeEventListener('mouseover', overTetrisHandler);
    overTetrisHandler = null;
  };
}

///////////////////////////////////////////
// click - Home
export const evAdClickLogoHome = () => {
  const target = document.querySelector<HTMLImageElement>('#logoImmanence');
  if (target && !clickLogoHomeHandler) {
    clickLogoHomeHandler = () => {
      setZone('HOME');
    };
    target.addEventListener('click', clickLogoHomeHandler);
  }
}
export const evRemClickLogoHome = () => {
  const target = document.querySelector<HTMLImageElement>('#logoImmanence');
  if (target && clickLogoHomeHandler) {
    target.removeEventListener('click', clickLogoHomeHandler);
    clickLogoHomeHandler = null;
  };
}

// Écouteur d'événement pour redimensionner
export const evAddDocResize = () => {
  window.addEventListener('resize', resizeDocument);
}

export interface Game {
    seed: any;
    getSeed(): any;
    createGame(seed: any, user: string): any;
    addEvent(type: string, data: any): any;
    loadGame(user: string, room:string|null): any;
    addEventCallback(callback: any): any;
    addUserCallback(callback: any): any;
    subscribeUserData(): any;
    getAllEvents():any;
    setUserData(data: any):any;
    getUserData():any;
    logout():any;
  }
  
  // Export the actual values the module provides
  declare const game: Game;
  
  export default game;
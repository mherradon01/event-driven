import userState from './auth/user';
import game from './game/game';

const events = {

    // AUTH FUNCTIONS
    getUser: () => {
        try {
            return userState.getUser();
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    isLoggedIn: () => {
        try {
            return userState.isLogged();
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    addAuthCallback: (callback) => {
        try {
            userState.addAuthCallback(callback);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    googleLogIn: async () => {
        try {
            const user = await userState.googleLogIn();
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    endgame: () => {
        try {
            game.logout();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    logOut: () => {
        try {
            game.logout()
            userState.logOut();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    // SEED FUNCTIONS
    getSeed() { 
        try {
            return game.getSeed();
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // GAME FUNCTIONS
    async createGame(seed) {
        try {
            return game.createGame(seed, userState.getUser().uid);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    loadGame(room) {
        try {
            return game.loadGame(room, userState.getUser().uid);
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // EVENT FUNCTIONS
    async addEvent(type, data) {
        try {
            return game.addEvent(type, data);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async addEventCallback(callback) {
        try {
            game.addEventCallback(callback);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async clearEventCallbacks() {
        try {
            game.clearEventCallbacks();
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async suscribeEvents(date=null) {
        try {
            game.subscribeEvents(date);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async getAllEvents() {
        try {
            return game.getAllEvents();
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // USER FUNCTIONS
    async setUserData(user) {
        try {
            game.setUserData(user);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async getUserData() {
        try {
            return game.getUserData();
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async suscribeUserData() {
        try {
            game.suscribeUserData();
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async addUserCallback(callback) {
        try {
            game.addUserCallback(callback);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async clearUserCallbacks() {
        try {
            game.clearUserCallbacks();
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    init() {
        userState.initAuth();
    }
}



export default events;
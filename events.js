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
    googleLogIn: async () => {
        try {
            const user = await userState.googleLogIn();
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    logOut: () => {
        try {
            userState.logOut();
            return true;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // EVENTS FUNCTIONS
    getSeed() {
        try {
            return game.getSeed();
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    createGame(seed) {

    },
    loadGame(seed) {

    }
}

export default events;
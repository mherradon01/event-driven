import { setAuthCallback, logInWithGoogle, logOut } from '../firebase/fireinit.js';

const userState = {
    //user: null, // Aquí se almacena el usuario logeado
    user: null,//JSON.parse(localStorage.getItem('user')) || null,
    authInit: false, // Indica si la autenticación ya se inicializó

    displayName: "",
    name: "",
    uid:  "",
    email: "",

    isLogged() {
        if (!this.authInit) {
            this.initAuth();
        }
        if (this.user === null) {
            return false;
        }
        return !!this.user;
    },

    getUser() {
        return this.user;
    },

    setUser(user) {
        if (user) {
            this.user = user;
            this.displayName = user.displayName;
            this.name = user.name;
            this.uid = user.uid;
            this.email = user.email;
            // localStorage.setItem('user', JSON.stringify(user));
        } else {
            // localStorage.removeItem('user');
            this.user = null;
            this.displayName = "";
            this.name = "";
            this.uid = "";
            this.email = "";
        }
    },

    // Función para establecer el usuario logeado
    async googleLogIn() {
        try {
            const user = await logInWithGoogle();
            this.setUser(user);
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // Función para limpiar el estado del usuario (logout)
    logOut() {
        try {
            this.setUser(null);
            return logOut();
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    addAuthCallback(callback) {
        setAuthCallback(callback);
    },
    initAuth() {
        if (!this.authInit) {
            this.authInit = true;
            setAuthCallback((user) => {
                this.setUser(user);
            });
        }
    }
};

export default userState;
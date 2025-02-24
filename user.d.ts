export interface User {
    displayName: string;
    name: string;
    uid:  string;
    
    email: string; // Add optional fields if applicable
    initAuth(): any;
    getUser(): any;
    isLogged(): boolean;
    logOut(): any;
    googleLogIn(): any;
    googleLogout(): any;
  }
  
  // Export the actual values the module provides
  declare const userState: User;
  
  export default userState;
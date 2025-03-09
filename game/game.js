import { subscribe } from 'firebase/data-connect';
import { getCalls, getDB, logOut } from '../firebase/fireinit'
import { FieldValue, Timestamp, addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, serverTimestamp, setDoc, query, QuerySnapshot, deleteDoc, where, or, Firestore} from "firebase/firestore";

import userState from '../auth/user';

const game = {
    DEFAULT_PATH: 'rooms/',
    path: 'rooms/',
    seed: '',
    unsubscribeEvents: null,
    unsubscribeUsers: null,
    eventCallbacks: [],
    userCallbacks: [],
    useruid: '',
    getSeed() {
        console.log("Returning seed: ", this.seed);
        return this.seed;
    },
    async loadGame(room, user) {
        if (room == null || room == "") {
            alert("Please introduce a room code");
            throw new Error("Room code is empty");
        }
        this.eventCallbacks = [];
        this.userCallbacks = [];
        this.path = this.DEFAULT_PATH + room;
        console.log("Loading game from: ", this.path);
        const docRef = doc(getDB(), this.path);
        const docSnap = await getDoc(docRef);
        this.useruid = user
        if (docSnap.exists()) {
            this.seed = docSnap.data().seedData;
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            alert("No such room or unauthorized access!");
            this.path = this.DEFAULT_PATH;
            return;
        }
        return room;
    },

    async createGame(seed, user) {
        this.seed = seed;
        this.useruid = user;
        this.eventCallbacks = [];
        this.userCallbacks = [];

        function generateRandomCode() {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Letters only
            let code = "";
            for (let i = 0; i < 5; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        }
        let roomCode = generateRandomCode();
        this.path = this.DEFAULT_PATH + roomCode//room.data;
        // Set the document with the seed and an empty events array
        // delete doc first
        const docRef = doc(getDB(), this.path);

        await setDoc(docRef, {
            seedData: this.seed,
        });

        this.subscribeEvents(Date.now());
        return roomCode;
    },

    async addEvent(type, data) {
        const date = Date.now();
        const docRef = await addDoc(
            collection(getDB(), this.path, 'events'),
            { 
                type: type,
                data: data,
                user: userState.uid,
                username: userState.displayName, // Add display name
                localTimestamp: date, 
                timestamp: serverTimestamp() 
            }
        );
        return date;
    },

    addEventCallback(callback) {
        this.eventCallbacks.push(callback);
    },
    clearEventCallbacks() {
        this.eventCallbacks = [];
    },
    addUserCallback(callback) {
        this.userCallbacks.push(callback);
    },
    clearUserCallbacks() {
        this.userCallbacks = [];
    },
    subscribeEvents(date=null) {
        if (!this.unsubscribeEvents) {
            let millisdate
            if (date !== null) {
                millisdate = Timestamp.fromMillis(date);
            } else {
                millisdate = Timestamp.fromMillis(new Date(2020,1,1))
            }
            console.log(millisdate)
            const q = query(
                collection(getDB(), this.path + "/events"),
                orderBy('timestamp', 'asc'),
                or( 
                    where("localTimestamp", ">=", date),
                    where("timestamp", ">=", millisdate)
                )
            );
            this.unsubscribeEvents = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    for (let i = 0; i < this.eventCallbacks.length; i++) {
                        this.eventCallbacks[i](change.type, change.doc.data());
                    }
                });
            });
        }
    },

    async getAllEvents() {
        // const querySnapshot = await getDocs(collection(getDB(), this.path, 'events').orderBy('timestamp', 'desc'));
        const q = query(collection(getDB(), this.path + "/events"), orderBy('timestamp', 'asc'));

        const querySnapshot = await getDocs(q);
        const events = [];
        // const q = query(citiesRef, orderBy("state"), orderBy("population", "desc"));
        // extract data of all docs and make an array
        //const events = [];
        /*setTimeout(() => {
            this.subscribeEvents(Date.now());
        }, 1000);*/
        const date = Date.now();
        events.push(querySnapshot.docs.map(doc => doc.data()));
        return {events: events[0], date: date};
    },
    async setUserData(data) {
        data.username = userState.displayName;
        data.useruid = userState.uid;
        const docRef = await setDoc(doc(collection(getDB(), this.path, 'users'), this.useruid), data);
    },
    async getUserData() {
        const docRef = doc(collection(getDB(), this.path, 'users'), this.useruid);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    },
    async subscribeUserData() {
        const docRef = collection(getDB(), this.path, 'users');
        this.unsubscribeUsers = onSnapshot(docRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                for (let i = 0; i < this.userCallbacks.length; i++) {
                    this.userCallbacks[i](change.type, change.doc.data());
                }
            });
        });
    },
    async logout() {
        if (this.unsubscribeEvents) {
            this.unsubscribeEvents()
            this.unsubscribeEvents = null
        }
        if (this.unsubscribeUsers) {
            this.unsubscribeUsers()
            this.unsubscribeUsers = null
        }
    }
}

export default game;
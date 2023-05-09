import { initializeApp } from 'firebase/app';
import {getDatabase} from 'firebase/database'

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCyKutCuKf9rOG1ON32Nh3A-uMBSqKZy_8",
    authDomain: "putmeon-2f5f6.firebaseapp.com",
    projectId: "putmeon-2f5f6",
    storageBucket: "putmeon-2f5f6.appspot.com",
    messagingSenderId: "525090382662",
    appId: "1:525090382662:web:9ac079514e32e84e597b47",
    databaseURL: "https://putmeon-2f5f6-default-rtdb.firebaseio.com/"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export default database;
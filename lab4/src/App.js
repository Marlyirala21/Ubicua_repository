import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import TareaForm from "./componentes/TareaForm";
import Tarea from "./componentes/Tarea";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYeS9EN7IMdD06-nJOf4dPSqdtQWYZmT4",
  authDomain: "lab4-100405994.firebaseapp.com",
  projectId: "lab4-100405994",
  storageBucket: "lab4-100405994.appspot.com",
  messagingSenderId: "1060798621624",
  appId: "1:1060798621624:web:ad6a5d4de5af959719514d",
  databaseURL:"https://lab4-100405994-default-rtdb.europe-west1.firebasedatabase.app/"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

console.log(app);

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      const userRef = ref(db, `/users/${user.uid}`);
      const snapshot = await get(userRef);

      const data = snapshot.val();

      if (data) {
        console.log(data);
      } else {
        await set(ref(db, "users/" + user.uid),{
          username: user.displayName,
          email: user.email
        });
      }
      setLoggedIn(true);
      setUserName(user.displayName);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  // const [listaTareas, setListaTareas] = useState([]);

  // const nuevaTarea = (tarea) => {
  //   setListaTareas([tarea, ...listaTareas]);
  // };

  // const borrar = (id) => {
  //   const listaFiltrada = listaTareas.filter((e, index) => index !== id);
  //   setListaTareas(listaFiltrada);
  // };

  return (
    <div className="App">
      {/* <TareaForm nuevaTarea={nuevaTarea} />
      <div className="lista">
        {listaTareas.map((e, index) => (
          <Tarea tarea={e} borrar={borrar} id={index}/>
        ))}
      </div> */}
      {isLoggedIn && <h1>Welcome, {userName}</h1>}
      {!isLoggedIn && (
        <button onClick={signInWithGoogle}>Sign-in with Google</button>
      )}
    </div>
  );
}

export default App;

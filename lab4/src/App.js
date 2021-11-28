import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import TareaForm from "./componentes/TareaForm";
import Tarea from "./componentes/Tarea";
import "./App.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYeS9EN7IMdD06-nJOf4dPSqdtQWYZmT4",
  authDomain: "lab4-100405994.firebaseapp.com",
  projectId: "lab4-100405994",
  storageBucket: "lab4-100405994.appspot.com",
  messagingSenderId: "1060798621624",
  appId: "1:1060798621624:web:ad6a5d4de5af959719514d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

console.log(app);

function App() {

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      console.log(user);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const [listaTareas, setListaTareas] = useState([]);

  const nuevaTarea = (tarea) => {
    setListaTareas([tarea, ...listaTareas]);
  };

  const borrar = (id) => {
    const listaFiltrada = listaTareas.filter((e, index) => index !== id);
    setListaTareas(listaFiltrada);
  };

  return (
    <div className="App">
      <TareaForm nuevaTarea={nuevaTarea} />

      <div className="lista">
        {listaTareas.map((e, index) => (
          <Tarea tarea={e} borrar={borrar} id={index}/>
        ))}
      </div>
    </div>
  );
}

export default App;

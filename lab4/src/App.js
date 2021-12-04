import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get, push, remove, onChildAdded, query, onValue, startAt, orderByChild, update, equalTo, limitToFirst, orderByKey} from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYeS9EN7IMdD06-nJOf4dPSqdtQWYZmT4",
  authDomain: "lab4-100405994.firebaseapp.com",
  projectId: "lab4-100405994",
  storageBucket: "lab4-100405994.appspot.com",
  messagingSenderId: "1060798621624",
  appId: "1:1060798621624:web:ad6a5d4de5af959719514d",
  databaseURL: "https://lab4-100405994-default-rtdb.europe-west1.firebasedatabase.app/"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

console.log(app);

function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isDone, setDone] = useState(false);
  const [userName, setUserName] = useState(null);
  const ulTaskList = document.querySelector("#ulTaskList");

  const uid = useRef(null);
  const inputRef = useRef("");
  const inputRefFilter = useRef("");


  const [taskList, setTaskList] = useState([]);
  let timer;

  let start_x = 0;
  let end_x = 0;
  let prev_x = 0;
  let start_time = 0;
  const TIME_THRESHOLD = 500;
  const SPACE_THRESHOLD = 200;

  //autenticación con google 
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      uid.current = user.uid;

      const userRef = ref(db, `/users/${user.uid}`);
      const snapshot = await get(userRef);

      const data = snapshot.val();

      if (data) {
        console.log(data);
      } else {
        await set(ref(db, "users/" + user.uid), {
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

//cada vez que un usuario se registre, recuperamos la lista de tareas de ese usuario
  useEffect(() => {
    if (isLoggedIn) {
      const tasksRef = ref(db, "tasks/" + uid.current);
      //cuando se detecta que se añade una nueva tarea, lo añadimos a nuestra lista de tareas
      onChildAdded(tasksRef, (data) => {
        console.log("data.key", data.key);
        console.log("data.val", data.val);
        setTaskList((oldList) => [
          ...oldList,
          { val: data.val(), key: data.key }
        ]);
      });
    }
  }, [isLoggedIn]);

  // useEffect(() =>{
  //    //long touch
  //   ulTaskList.addEventListener('touchstart', () => { 
  //     timer = setTimeout(() => {
  //       timer = null;
  //       console.log("completado");
  //       // handleTaskDone()
  //     }, 2000);
  //   });

  //   function cancel() {
  //     clearTimeout(timer);
  //   }

  // ulTaskList.addEventListener('touchend', cancel);
  // ulTaskList.addEventListener('touchmove', cancel);
  // }, [isLoggedIn])

//damos el valor del input a la referencia que hemos creado para mantener este valor entre renderizaciones
  function handleOnInput(e) {
    inputRef.current = e.target.value;
  }
  
//añadimos la tarea para el usuario en concreto
  function handleAddTask() {
      const taskListRef = ref(db, "tasks/" + uid.current);
      const newTaskRef = push(taskListRef, { title: inputRef.current, done: isDone });
    }

//eliminamos la tarea 
  function handleRemoveTask(pos, key) {
    console.log("Remove", key);
    const taskRef = ref(db, "tasks/" + uid.current + "/" + key);
    remove(taskRef);
    setTaskList((oldList) => {
      console.log("oldlist", oldList);
      const newList = [...oldList];
      newList.splice(pos, 1);
      console.log("newList", newList);
      return newList;
    });
  }

//marcamos la tarea como resuelta
  function handleTaskDone (i, key){
    const taskDoneRef = ref(db, "tasks/" + uid.current + "/" + key);
    console.log(taskDoneRef);
    setDone(true);
    update(taskDoneRef, { title: inputRef.current, done: isDone })
    setTaskList((oldList) => {
      console.log(oldList);
      const newList = [...oldList];
      console.log("newlist", newList);
      newList[i].val.done = true;
      return newList;
    }); 
  }

  function filter() {
    const titlesRef = query(ref(db, "tasks/" + uid.current), orderByChild("title"), equalTo("d"));
    onValue(titlesRef, (snapshot) => {
      snapshot.forEach((el) => {
        console.log("on value", el.val());
      });
    });
  }
     

  return (
    <div className="App">
      {
        (isLoggedIn) ?
          (<div>
            <h1>Welcome, {userName} 🙋🏻‍♀️</h1>
            <input onInput={handleOnInput}></input>
            <button onClick={handleAddTask}>añadir tarea</button>
            <button onClick={filter}>añadir tarea</button>
            
        

            <ul id={ulTaskList}>
              {taskList.map((el, i) => {
                return (
                  <li className={el.val.done ? "done" : ""} key={el.key} >
                    {el.val.title}
                    {console.log("elemento", el)}
                    <button onClick={() => handleRemoveTask(i, el.key)}>
                      remove
                    </button>
                    <button onClick={() => handleTaskDone(i, el.key)}>done</button>
                  </li>
                );
              })}
            </ul>
          </div>
          )
          : (
            <button onClick={signInWithGoogle}>Sign-in with Google</button>)

      }
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get, push, remove, onChildAdded, query, onValue, startAt, orderByChild, update, equalTo, limitToFirst, orderByKey } from "firebase/database";

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
  const [isFilter, setFilter] = useState(false);
  const [userName, setUserName] = useState(null);

  const uid = useRef(null);
  const inputRef = useRef("");
  const inputRefFilter = useRef("");


  const [taskList, setTaskList] = useState([]);
  const [taskListFilter, setTaskListFilter] = useState([]);


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
        setTaskList((oldList) => [
          ...oldList,
          { val: data.val(), key: data.key }
        ]);
      });
    }
  }, [isLoggedIn]);

  function functions(e) {
    handleOnInput(e);
  }

  function handleOnInput(e) {
    inputRef.current = e.target.value;
    console.log("input", inputRef);
  }

  //añadimos la tarea para el usuario en concreto
  function handleAddTask() {

    if (isFilter) {
      alert("Para añadir una tarea, primero haz click en el botón 'Mostrar Lista Completa'")
    } else {
      const taskListRef = ref(db, "tasks/" + uid.current);
      if (inputRef.current) {
        const newTaskRef = push(taskListRef, { title: inputRef.current, done: false });
        setTaskList("");
        onValue(taskListRef, (snapshot) => {
          snapshot.forEach((el) => {
            setTaskList((oldList) => {
              const newList = [...oldList, { val: el.val(), key: el.key }];
              console.log("newlist", newList);
              return newList;
            });
          });
        });
      }
      else {
        alert("Introduce primero una tarea")
      }

    }
  }

  //eliminamos la tarea 
  function handleRemoveTask(pos, key) {
    const taskRef = ref(db, "tasks/" + uid.current + "/" + key);
    remove(taskRef);

    setTaskList("");
    const taskListRef = ref(db, "tasks/" + uid.current);
    onValue(taskListRef, (snapshot) => {
      snapshot.forEach((el) => {
        setTaskList((oldList) => {
          const newList = [...oldList, { val: el.val(), key: el.key }];
          console.log("newlist", newList);
          return newList;
        });
      });
    });
  }

  //eliminamos la tarea de los elementos filtrados
  function handleRemoveTaskFilter(key) {
    const taskRef = ref(db, "tasks/" + uid.current + "/" + key);
    remove(taskRef);

    filter();

    //actualizamos la lista original
    const titlesRef = query(ref(db, "tasks/" + uid.current));
    setTaskList("")
    onValue(titlesRef, (snapshot) => {
      snapshot.forEach((el) => {
        setTaskList((oldList) => {
          const newList = [...oldList, { val: el.val(), key: el.key }];
          console.log("newlist", newList);
          return newList;
        });
      });
    });
  }

  //marcamos la tarea como resuelta
  function handleTaskDone(i, key) {
    const taskDoneRef = ref(db, "tasks/" + uid.current + "/" + key);
    update(taskDoneRef, { title: inputRef.current, done: true });

    const titlesRef = query(ref(db, "tasks/" + uid.current));
    setTaskList("")
    onValue(titlesRef, (snapshot) => {
      snapshot.forEach((el) => {
        setTaskList((oldList) => {
          const newList = [...oldList, { val: el.val(), key: el.key }];
          console.log("newlist", newList);
          return newList;
        });
      });
    });
  }

  //marcamos la tarea como resuelta de los elementos filtrados
  function handleTaskDoneFilter(i, key) {
    const taskDoneRef = ref(db, "tasks/" + uid.current + "/" + key);
    update(taskDoneRef, { title: inputRef.current, done: true })

    filter()

    //actualizamos también la lista original
    const taskDoneFilterRef = query(ref(db, "tasks/" + uid.current));
    setTaskList("")
    onValue(taskDoneFilterRef, (snapshot) => {
      snapshot.forEach((el) => {
        setTaskList((oldList) => {
          const newList = [...oldList, { val: el.val(), key: el.key }];
          return newList;
        });
      });
    });
  }

  //filtramos los datos
  function filter() {
    const titlesRefFilter = query(ref(db, "tasks/" + uid.current), orderByChild("title"), equalTo(inputRef.current));
    setFilter(true);
    setTaskListFilter("");
    onValue(titlesRefFilter, (snapshot) => {
      snapshot.forEach((el) => {
        setTaskListFilter((oldList) => {
          const newListFilter = [...oldList, { val: el.val(), key: el.key }];
          console.log("newlist Filter", newListFilter);
          return newListFilter;
        });
      });
    });
  }

  function undoFilter() {
    setFilter(false);
    setTaskListFilter("");
  }


  return (
    <div className="App">
      {
        (isLoggedIn) ?
          (<div>
            <h1>Welcome, {userName}</h1>
            <h2>Lista de Tareas</h2>
            <input onInput={functions}></input>
            <button onClick={handleAddTask} className={"btnI"}>Añadir Tarea</button>
            <button onClick={filter} className={"btnI"}>Filtrar</button>
            {isFilter && taskListFilter &&
              (
                <ul>
                  {taskListFilter.map((el, i) => {
                    return (
                      <li className={el.val.done ? "done" : ""} key={el.key} >
                        {el.val.title}
                        <button onClick={() => handleRemoveTaskFilter(el.key)} className={"btnX"}>✖</button>
                        <button onClick={() => handleTaskDoneFilter(i, el.key)} className={"btnDone"}>✔</button>
                      </li>

                    );
                  })}
                  <button onClick={undoFilter} className={"btnMostrarLista"}>Mostrar Lista Completa</button>
                </ul>)}
            {!isFilter && taskList &&
              (<ul>
                {taskList.map((el, i) => {
                  return (
                    <li className={el.val.done ? "done" : ""} key={el.key} >
                      {el.val.title}
                      {console.log("elemento", el)}
                      <button onClick={() => handleRemoveTask(i, el.key)} className={"btnX"}>✖</button>
                      <button onClick={() => handleTaskDone(i, el.key)} className={"btnDone"}>✔</button>
                    </li>
                  );
                })}
              </ul>)}
            {isFilter && !taskListFilter && (
              <div>
                <p>No hay coincidencias</p>
                <button onClick={undoFilter} className={"btnMostrarLista"}>Mostrar Lista Completa</button>

              </div>

            )}
            {!taskList && !isFilter && <p>Añada una nueva tarea</p>}

          </div>
          )
          : (
            <div className={"registro"}>
              <h1>Bienvenid@, para ver tu lista de tareas inicia sesión con tu cuenta de Google </h1>
              <button onClick={signInWithGoogle} className={"btnRegistro"}>Iniciar sesion con Google</button>
            </div>)
      }
    </div>
  );
}

export default App;

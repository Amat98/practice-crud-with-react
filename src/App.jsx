import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const newUser = () => {
    fetch(`https://playground.4geeks.com/todo/users/Vy-om`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  const getUser = () => {
    fetch(`https://playground.4geeks.com/todo/users/Vy-om`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 404) {
          newUser();
        }
        console.log(res);
        return res.json();
      })
      .then((data) => setTasks(data.todos))
      .catch((err) => console.log(err));
  };

  const newTask = (input) => {
    fetch(`https://playground.4geeks.com/todo/todos/Vy-om`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: input,
        is_done: false,
      }),
    })
      .then((res) => res.json())
      .then((data) => getUser())
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.newTask.value !== "") {
      const valueTask = e.target.newTask.value;
      newTask(valueTask);
      e.target.newTask.value = "";
    }
  };

  const deleteTask = async (id) => {
    await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    getUser();
  };

  const deleteAll = async (items) => {
    const deletePromises = items.map((item) => {
      return fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    try {
      await Promise.all(deletePromises);
      getUser(); // Suponiendo que esta función maneja la actualización de la UI o el estado
    } catch (error) {
      console.error("Error deleting items:", error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje de error al usuario
    }
  };

  const printShadow = (arr) => {
    let result =
      " rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px";
    let sum = 0;
    for (let i = 1; i <= arr.length; i++) {
      let initial = i * 10;
      sum += 10;
      result += `, ${initial}px -${initial}px 0px -2px,  rgba(0, 0, 0, 0.2) ${
        initial + 2
      }px -${initial - 2}px 5px`;
    }
    return result;
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <main className="text-white min-h-screen flex justify-center items-center flex-col">
      <h1 className="text-6xl z-10 text-red-500 font-light">Lista de Tareas</h1>
      <div
        className="shadow-container w-full text-2xl max-w-3xl p-4 rounded-md bg-white"
        style={{
          boxShadow: `${printShadow(tasks)}`,
          maxWidth: "900px",
        }}
      >
        <form className="mx-auto" onSubmit={handleSubmit}>
          <input
            id="newTask"
            className="p-4 text-black w-full bg-white/0 mx-auto rounded-md outline-none"
            placeholder="Crear nueva tarea..."
          />
        </form>
        <ul className="text-black">
          {tasks.map((task) => (
            <li
              className="p-4 flex justify-between w-full h-16 items-center rounded-md "
              key={task.id}
              id={task.id}
            >
              <p>{task.label}</p>
              <div className="flex items-center justify-center gap-2 text-3xl">
                <button className="text-green-500 flex items-center">
                  <i class="bx bxs-edit"></i>
                </button>
                <button
                  className="text-red-500 font-bold"
                  onClick={() => deleteTask(task.id)}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-center items-center mt-5">
          <button
            onClick={() => deleteAll(tasks)}
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2"
          >
            Eliminar tareas
          </button>
        </div>
        <p className="text-gray-500 text-[20px]">
          <span className="text-red-500 font-bold">{tasks.length}</span> Tasks
        </p>
      </div>
    </main>
  );
}

export default App;

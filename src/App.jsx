
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:8082/api/habits";

function App() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");

  async function loadHabits() {
    try {
      const response = await axios.get(API);
      setHabits(response.data);
    } catch (error) {
      console.error("Error loading habits:", error);
    }
  }

  useEffect(() => {
    loadHabits();
  }, []);

  async function addHabit(event) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter a habit name");
      return;
    }

    try {
      await axios.post(API, {
        name: name,
        completed: false
      });
      setName("");
      loadHabits();
    } catch (error) {
      alert("Could not add habit. Check the backend.");
    }
  }

  async function toggleHabit(habit) {
    try {
      await axios.put(`${API}/${habit.id}`, {
        name: habit.name,
        completed: !habit.completed
      });
      loadHabits();
    } catch (error) {
      alert("Could not update habit");
    }
  }

  async function deleteHabit(id) {
    try {
      await axios.delete(`${API}/${id}`);
      loadHabits();
    } catch (error) {
      alert("Could not delete habit");
    }
  }

  return (
    <div className="container">
      <h1>Daily Habit Tracker</h1>
      <p>Build good habits every day!</p>

      <form onSubmit={addHabit}>
        <input
          type="text"
          placeholder="Enter a habit"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit">Add Habit</button>
      </form>

      <h3>
        Total: {habits.length} | Completed:{" "}
        {habits.filter((habit) => habit.completed).length}
      </h3>

      {habits.length === 0 ? (
        <p>No habits yet. Add your first habit!</p>
      ) : (
        habits.map((habit) => (
          <div className="habit" key={habit.id}>
            <span
              style={{
                textDecoration: habit.completed ? "line-through" : "none"
              }}
            >
              {habit.name}
            </span>

            <div>
              <button onClick={() => toggleHabit(habit)}>
                {habit.completed ? "Undo" : "Complete"}
              </button>
              <button onClick={() => deleteHabit(habit.id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
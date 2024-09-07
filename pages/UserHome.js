import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  addDoc,
  updateDoc,
  doc,
  getFirestore,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Alert from "@mui/material/Alert";
import "../styling/UserHome.Modules.css";

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("high");
  const [userData, setUserData] = useState([]);
  const [newData, setNewData] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState("");
  const [editDate, setEditDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [maxTasksReached, setMaxTasksReached] = useState(false);
  const [taskTooLong, setTaskTooLong] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      const db = getFirestore();
      if (user) {
        const userDocRef = collection(
          db,
          "users",
          user.uid,
          selectedPriority + "Data"
        );
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
          const updatedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserData(updatedData);
        });
        return () => unsubscribe();
      }
    };
    fetchDataFromFirestore();
  }, [user, selectedPriority]);

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
  };

  const handleTextboxSubmit = async () => {
    if (newData === "" || selectedDate === "") return;

    if (newData.length > 100) {
      setTaskTooLong(true);
      setTimeout(() => setTaskTooLong(false), 3000);
      return;
    }

    const db = getFirestore();

    const highTasksRef = collection(db, "users", user.uid, "highData");
    const mediumTasksRef = collection(db, "users", user.uid, "mediumData");
    const lowTasksRef = collection(db, "users", user.uid, "lowData");

    const highTasksSnapshot = await getDocs(highTasksRef);
    const mediumTasksSnapshot = await getDocs(mediumTasksRef);
    const lowTasksSnapshot = await getDocs(lowTasksRef);

    const totalTasks =
      highTasksSnapshot.size + mediumTasksSnapshot.size + lowTasksSnapshot.size;

    if (totalTasks >= 11) {
      setMaxTasksReached(true);
      setTimeout(() => setMaxTasksReached(false), 3000);
      return;
    }

    await addDoc(collection(db, "users", user.uid, selectedPriority + "Data"), {
      rand: newData,
      date: selectedDate,
    });

    setNewData("");
    setSelectedDate("");
  };

  const handleEditTaskSubmit = async (id) => {
    const db = getFirestore();
    const docRef = doc(db, "users", user.uid, selectedPriority + "Data", id);
    await updateDoc(docRef, { rand: editData, date: editDate });
    setEditIndex(null);
    setEditData("");
    setEditDate("");
  };

  const handleDelete = async (id) => {
    const db = getFirestore();
    await deleteDoc(doc(db, "users", user.uid, selectedPriority + "Data", id));
  };

  const handleEdit = (index, data) => {
    setEditIndex(index);
    setEditData(data.rand);
    setEditDate(data.date);
  };

  const handleDateClick = (date) => {
    const tasksForDate = userData.filter(
      (task) => task.date === date.toISOString().split("T")[0]
    );
    setCalendarTasks(tasksForDate);
  };

  return (
    <div>
      <div className="appbar">
        <h1>Task Manager</h1>
        <div className="appbar-links">
          <Link href="/">
            <button onClick={() => auth.signOut()} className="submitButton">
              Logout
            </button>
          </Link>
        </div>
      </div>

      {maxTasksReached && (
        <Alert
          severity="error"
          onClose={() => setMaxTasksReached(false)}
          style={{
            position: "fixed",
            top: "15vh",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "80%",
            maxWidth: "600px",
          }}
        >
          Maximum of 10 tasks reached. Please delete a task to add a new one.
        </Alert>
      )}

      {taskTooLong && (
        <Alert
          severity="error"
          onClose={() => setTaskTooLong(false)}
          style={{
            position: "fixed",
            top: "15vh",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "80%",
            maxWidth: "600px",
          }}
        >
          Task is too long! Please limit to 100 characters.
        </Alert>
      )}

      <div className="sidebar">
        <h2>Priority</h2>
        <select onChange={handlePriorityChange} value={selectedPriority}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button
          className="submitButton"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? "Show Tasks" : "Show Calendar"}
        </button>
      </div>

      <div className="main-content">
        {showCalendar ? (
          <>
          <div className="calndiv">
            <h2>Calendar: pick a date to see tasks.</h2>
            
              <Calendar
                onClickDay={handleDateClick}
                className="teal-calendar"
              />
            </div>

            {calendarTasks.length > 0 && (
              <div className="tasksSection">
                <h3>Tasks on Selected Date</h3>
                {calendarTasks.map((task, index) => (
                  <div key={index} className="dataBorder">
                    <p>{task.rand}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="tasks">
              Tasks -{" "}
              {selectedPriority.charAt(0).toUpperCase() +
                selectedPriority.slice(1)}{" "}
              Priority
            </h1>

            <div className="tasksSection">
              {userData.map((data, index) => (
                <div className="dataBorder" key={index}>
                  {editIndex === index ? (
                    <div className="editContainer">
                      <TextField
                        label="Edit Task"
                        variant="outlined"
                        value={editData}
                        onChange={(e) => setEditData(e.target.value)}
                      />
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                      />
                      <button
                        onClick={() => handleEditTaskSubmit(data.id)}
                        className="submitButton"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <p>{data.rand}</p>
                      <p>Due: {data.date}</p>
                      <IconButton onClick={() => handleDelete(data.id)}>
                        <FaTrash />
                      </IconButton>
                      <button
                        onClick={() => handleEdit(index, data)}
                        className="submitButton"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="textBox">
              <TextField
                label="Enter Task"
                variant="outlined"
                value={newData}
                onChange={(e) => setNewData(e.target.value)}
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="submitDiv">
              <button onClick={handleTextboxSubmit} className="submitButton">
                Submit Task
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserHome;

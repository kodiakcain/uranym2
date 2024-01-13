import React, { useState, useEffect, use } from "react";
import { auth } from "../firebase";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import "../styling/UserHome.Modules.css";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import { motion } from "framer-motion";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { FaTrash } from "react-icons/fa";

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [newData, setNewData] = useState("");
  const [maxUserAlert, setAlert] = useState(false);
  const [open, setOpen] = React.useState(true);
  const [maxTextAlert, setMaxTextAlert] = useState(false);
  const [lessTextAlert, setLessTextAlert] = useState(false);
  const [editIndex, setEditIndex] = useState(null); 
  const [editPriority, setEditPriority] = useState(null);
  const [editData, setEditData] = useState("");
  const [maxEditData, setMaxEditData] = useState(false);
  const [editAlertOpen, setEditAlertOpen] = React.useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [priorityAlert, setPriorityAlert] = useState(false);
  const [userDataMedium, setUserDataMedium] = useState([]);
  const [userDataLow, setUserDataLow] = useState([]);
  const [highAmount, setHighAmount] = useState(0);
  const [mediumAmount, setMediumAmount] = useState(0);
  const [lowAmount, setLowAmount] = useState(0);


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
        try {
          const userDocRef3 = collection(db, "users", user.uid, "highData");
          const unsubscribeHigh = onSnapshot(userDocRef3, (snapshot) => {
            const updatedData = snapshot.docs.map((doc) => doc.data());
            setUserData(updatedData);
            setHighAmount(snapshot.size);
          });

          const userDocRef5 = collection(db, "users", user.uid, "mediumData");
          const unsubscribeMedium = onSnapshot(userDocRef5, (snapshot) => {
            const updatedDataMedium = snapshot.docs.map((doc) => doc.data());
            setUserDataMedium(updatedDataMedium);
            setMediumAmount(snapshot.size);
          });

          const userDocRef6 = collection(db, "users", user.uid, "lowData");
          const unsubscribeLow = onSnapshot(userDocRef6, (snapshot) => {
            const updatedDataLow = snapshot.docs.map((doc) => doc.data());
            setUserDataLow(updatedDataLow);
            setLowAmount(snapshot.size);
          });

          return () => {
            unsubscribeHigh();
            unsubscribeMedium();
            unsubscribeLow();
          };
        } catch (error) {
          console.error("Error fetching data from Firestore:", error.message);
        }
      }
    };

    fetchDataFromFirestore();
  }, [user]);

  const buttonVariants = {
    rest: {
      scale: 1,
      boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
    },
    hover: {
      scale: 1.1,
      boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.2)",
    },
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleTextboxChange = (e) => {
    setNewData(e.target.value);
  };

  const handleEditTaskChange = (e, index) => {
    setEditData(e.target.value);
  };

  const handleEditSubmit = async (index, priority) => {
    if (editData.length > 200) {
      setEditAlertOpen(true);
      setMaxEditData(true);
      return;
    }
    const db = getFirestore();

    if (priority == 'low') {
      try {
        const userDocRef = collection(db, "users", user.uid, "lowData");
        const snapshot = await getDocs(userDocRef);
        const docToUpdate = snapshot.docs[index];
  
        if (docToUpdate) {
          await updateDoc(doc(userDocRef, docToUpdate.id), {
            rand: editData,
          });
        }
      } catch (error) {
        console.error("Error updating document:", error.message);
      }
    }
    if (priority == 'medium') {
      try {
        const userDocRef = collection(db, "users", user.uid, "mediumData");
        const snapshot = await getDocs(userDocRef);
        const docToUpdate = snapshot.docs[index];
  
        if (docToUpdate) {
          await updateDoc(doc(userDocRef, docToUpdate.id), {
            rand: editData,
          });
        }
      } catch (error) {
        console.error("Error updating document:", error.message);
      }
    }
    if (priority == 'high') {
      try {
        const userDocRef = collection(db, "users", user.uid, "highData");
        const snapshot = await getDocs(userDocRef);
        const docToUpdate = snapshot.docs[index];
  
        if (docToUpdate) {
          await updateDoc(doc(userDocRef, docToUpdate.id), {
            rand: editData,
          });
        }
      } catch (error) {
        console.error("Error updating document:", error.message);
      }
    }
    
  };

  const handleTextboxSubmit = async () => {
    if (selectedPriority == "") {
      setPriorityAlert(true);
      return;
    }
    if (newData.length > 200) {
      setMaxTextAlert(true);
      return;
    }

    if (newData.length <= 0) {
      setLessTextAlert(true);
      return;
    }

    const db = getFirestore();
    const userDocRef4 = await getDocs(
      collection(db, "users", user.uid, "lowData")
    );

    const userDocRef6 = await getDocs(
      collection(db, "users", user.uid, "mediumData")
    );

    const userDocRef5 = await getDocs(
      collection(db, "users", user.uid, "highData")
    );
    let totalData2 = 0;

    userDocRef4.forEach((doc) => {
      totalData2++;
    });

    userDocRef5.forEach((doc) => {
      totalData2++;
    });

    userDocRef6.forEach((doc) => {
      totalData2++;
    });

    if (totalData2 >= 20) {
      setOpen(true);
      setAlert(true);
      return;
    }

    if (user) {
      if (selectedPriority == "high") {
        console.log('working high');
        try {
          await addDoc(collection(db, "users", user.uid, "highData"), {
            rand: newData,
            date: selectedDate,
            priority: selectedPriority,
          });
          console.log("Document written with ID");
          setNewData("");
        } catch (error) {
          console.error("Error writing document:", error.message);
        }
      }
      if (selectedPriority == "low") {
        console.log('working low');
        try {
          await addDoc(collection(db, "users", user.uid, "lowData"), {
            rand: newData,
            date: selectedDate,
            priority: selectedPriority,
          });
          console.log("Document written with ID");
          setNewData("");
        } catch (error) {
          console.error("Error writing document:", error.message);
        }
      }

      if (selectedPriority == "medium") {
        console.log('working medium');
        try {
          await addDoc(collection(db, "users", user.uid, "mediumData"), {
            rand: newData,
            date: selectedDate,
            priority: selectedPriority,
          });
          console.log("Document written with ID");
          setNewData("");
        } catch (error) {
          console.error("Error writing document:", error.message);
        }
      }
    }

    setSelectedDate("");
    setSelectedPriority("");
    setNewData("");
  };

  const handleDelete = async (index, priority) => {
    const db = getFirestore();

    if (priority == 'high') {
      try {
        const userDocRef = collection(db, "users", user.uid, "highData");
        const snapshot = await getDocs(userDocRef);
        const docToDelete = snapshot.docs[index];
  
        if (docToDelete) {
          await deleteDoc(doc(userDocRef, docToDelete.id));
        }
      } catch (error) {
        console.error("Error deleting document:", error.message);
      }
    }
    if (priority == 'medium') {
      try {
        const userDocRef = collection(db, "users", user.uid, "mediumData");
        const snapshot = await getDocs(userDocRef);
        const docToDelete = snapshot.docs[index];
  
        if (docToDelete) {
          await deleteDoc(doc(userDocRef, docToDelete.id));
        }
      } catch (error) {
        console.error("Error deleting document:", error.message);
      }
    }
    if (priority == 'low') {
      try {
        const userDocRef = collection(db, "users", user.uid, "lowData");
        const snapshot = await getDocs(userDocRef);
        const docToDelete = snapshot.docs[index];
  
        if (docToDelete) {
          await deleteDoc(doc(userDocRef, docToDelete.id));
        }
      } catch (error) {
        console.error("Error deleting document:", error.message);
      }
    }
  };

  const handleEdit = (index, priority) => {
    setEditIndex(index);
    setEditPriority(priority);
  };

  const closeEdit = () => {
    setEditIndex(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 blackText">
      <div className="mainDiv">
        <div className="logoutDiv">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="rest"
          >
            {user ? (
              <Link href="/">
                <button onClick={handleLogout} className="logoutBorder">
                  Logout
                </button>
              </Link>
            ) : (
              <p>User not logged in</p>
            )}
          </motion.button>
        </div>
        {maxUserAlert && (
          <Collapse in={maxUserAlert}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Max Data Reached.
            </Alert>
          </Collapse>
        )}
        { highAmount == 0 && mediumAmount == 0 && lowAmount == 0 && <div className="tasksBorder">
          <h2 className="tasksText">No Tasks - Enter a Task</h2>
        </div> }
        { highAmount != 0 && <div className="tasksBorder">
          <h2 className="tasksText"><u>High Priority Tasks</u></h2>
        </div> }

        { highAmount != 0 &&<div className="dataDivHigh">
          {userData.map((data, index) => (
            <div className="dataBorder" style={{ overflow: "hidden" }}>
              <p key={index} className="dataSize">
                {data.rand}
              </p>
              {data.date != "" && <p>Due: {data.date}</p>}
              <p>Priority: {data.priority}</p>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="rest"
              >
                <IconButton onClick={() => handleDelete(index, data.priority)}>
                  <FaTrash />
                </IconButton>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="rest"
              >
                <button
                  className="submitButton"
                  onClick={() => handleEdit(index, data.priority)}
                >
                  edit
                </button>
              </motion.button>
              {editIndex === index && editPriority == 'high' && (
                <>
                  <button
                    className="submitButton"
                    style={{ paddingTop: "10px" }}
                    onClick={closeEdit}
                  >
                    Close edit menu
                  </button>
                  <div>
                    {maxEditData && (
                      <Collapse in={editAlertOpen}>
                        <Alert
                          severity="error"
                          action={
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                              onClick={() => {
                                setEditAlertOpen(false);
                              }}
                            >
                              <CloseIcon fontSize="inherit" />
                            </IconButton>
                          }
                          sx={{ mb: 2 }}
                        >
                          Maximum of 200 characters.
                        </Alert>
                      </Collapse>
                    )}
                  </div>
                  <TextField
                    id="outlined-basic"
                    label="Enter Updated Task"
                    variant="outlined"
                    color="secondary"
                    style={{ paddingTop: "10px" }}
                    value={editData}
                    onChange={(e) => handleEditTaskChange(e, index)}
                  />

                  <button
                    className="submitButton"
                    onClick={() => handleEditSubmit(index, data.priority)}
                  >
                    Set Updated task
                  </button>
                </>
              )}
            </div>
          ))}
        </div> }
        <div style={{paddingTop: '10px'}}>

        </div>
        { mediumAmount != 0 && <div className="tasksBorder">
          <h2 className="tasksText"><u>Medium Priority Tasks</u></h2>
        </div> }
        { mediumAmount != 0 && <div className="dataDivMedium">
          {userDataMedium.map((data, index) => (
            <div className="dataBorder" style={{ overflow: "hidden" }}>
              <p key={index} className="dataSize">
                {data.rand}
              </p>
              {data.date != "" && <p>Due: {data.date}</p>}
              <p>Priority: {data.priority}</p>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="rest"
              >
                <IconButton onClick={() => handleDelete(index,data.priority)}>
                  <FaTrash />
                </IconButton>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="rest"
              >
                <button
                  className="submitButton"
                  onClick={() => handleEdit(index, data.priority)}
                >
                  edit
                </button>
              </motion.button>
              {editIndex === index && editPriority == 'medium' && (
                <>
                  <button
                    className="submitButton"
                    style={{ paddingTop: "10px" }}
                    onClick={closeEdit}
                  >
                    Close edit menu
                  </button>
                  <div>
                    {maxEditData && (
                      <Collapse in={editAlertOpen}>
                        <Alert
                          severity="error"
                          action={
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                              onClick={() => {
                                setEditAlertOpen(false);
                              }}
                            >
                              <CloseIcon fontSize="inherit" />
                            </IconButton>
                          }
                          sx={{ mb: 2 }}
                        >
                          Maximum of 200 characters.
                        </Alert>
                      </Collapse>
                    )}
                  </div>
                  <TextField
                    id="outlined-basic"
                    label="Enter Updated Task"
                    variant="outlined"
                    color="secondary"
                    style={{ paddingTop: "10px" }}
                    value={editData}
                    onChange={(e) => handleEditTaskChange(e, index)}
                  />

                  <button
                    className="submitButton"
                    onClick={() => handleEditSubmit(index, data.priority)}
                  >
                    Set Updated task
                  </button>
                </>
              )}
            </div>
          ))}
        </div> }
        <div style={{paddingTop: '10px'}}>

        </div>
        { lowAmount != 0 && <div className="tasksBorder">
          <h2 className="tasksText"><u>Low Priority Tasks</u></h2>
        </div> }
        { lowAmount != 0 && <div className="dataDivLow">
          {userDataLow.map((data, index) => (
            <div className="dataBorder" style={{ overflow: "hidden" }}>
              <p key={index} className="dataSize">
                {data.rand}
              </p>
              {data.date != "" && <p>Due: {data.date}</p>}
              <p>Priority: {data.priority}</p>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="rest"
              >
                <IconButton onClick={() => handleDelete(index, data.priority)}>
                  <FaTrash />
                </IconButton>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="rest"
              >
                <button
                  className="submitButton"
                  onClick={() => handleEdit(index, data.priority)}
                >
                  edit
                </button>
              </motion.button>
              {editIndex === index && editPriority == 'low' && (
                <>
                  <button
                    className="submitButton"
                    style={{ paddingTop: "10px" }}
                    onClick={closeEdit}
                  >
                    Close edit menu
                  </button>
                  <div>
                    {maxEditData && (
                      <Collapse in={editAlertOpen}>
                        <Alert
                          severity="error"
                          action={
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                              onClick={() => {
                                setEditAlertOpen(false);
                              }}
                            >
                              <CloseIcon fontSize="inherit" />
                            </IconButton>
                          }
                          sx={{ mb: 2 }}
                        >
                          Maximum of 200 characters.
                        </Alert>
                      </Collapse>
                    )}
                  </div>
                  <TextField
                    id="outlined-basic"
                    label="Enter Updated Task"
                    variant="outlined"
                    color="secondary"
                    style={{ paddingTop: "10px" }}
                    value={editData}
                    onChange={(e) => handleEditTaskChange(e, index)}
                  />

                  <button
                    className="submitButton"
                    onClick={() => handleEditSubmit(index, data.priority)}
                  >
                    Set Updated task
                  </button>
                </>
              )}
            </div>
          ))}
        </div> }
        <div style={{paddingTop: '40px'}}>

        </div>
        <div>
          {maxTextAlert && (
            <Collapse in={open}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setMaxTextAlert(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Task cannot exceed 200 characters.
              </Alert>
            </Collapse>
          )}
          {lessTextAlert && (
            <Collapse in={open}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setLessTextAlert(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Task cannot be 0 characters.
              </Alert>
            </Collapse>
          )}
          {priorityAlert && (
            <Collapse in={open}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setPriorityAlert(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Must select priority for task.
              </Alert>
            </Collapse>
          )}
        </div>
        <div className="textBox">
          <TextField
            id="outlined-basic"
            label="Enter Task"
            variant="outlined"
            color="secondary"
            value={newData}
            onChange={handleTextboxChange}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <div className="submitDiv">
        </div>
        <div className="submitDiv">
          <select
            onChange={(e) => setSelectedPriority(e.target.value)}
            value={selectedPriority}
          >
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="submitDiv">
          <label for="datepicker">
          </label>
        </div>
        <div className="submitDiv">
          <input
            type="date"
            id="datepicker"
            name="datepicker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        </div>
        
        <div className="submitDiv">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="rest"
          >
            <button
              onClick={handleTextboxSubmit}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded submitButton"
            >
              Submit Task
            </button>
          </motion.button>
        </div>
      </div>
      <div style={{paddingTop: '30px'}}>

      </div>

    </main>
  );
};

export default UserHome;

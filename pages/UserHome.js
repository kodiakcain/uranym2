import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc
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
  const [editIndex, setEditIndex] = useState(null); // New state variable
  const [editData, setEditData] = useState("");
  const [maxEditData, setMaxEditData] = useState(false);
  const [editAlertOpen, setEditAlertOpen] = React.useState(true);

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
          const userDocRef3 = collection(db, "users", user.uid, "data");
          const unsubscribe = onSnapshot(userDocRef3, (snapshot) => {
            const updatedData = snapshot.docs.map((doc) => doc.data());
            setUserData(updatedData);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching data from Firestore:", error.message);
        }
      }
    };

    fetchDataFromFirestore();
  }, [user]);

  useEffect(() => {
    console.log('use effect');
  }, [lessTextAlert]);

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
  }

  const handleEditSubmit = async (index) => {

    if (editData.length > 200) {
      setEditAlertOpen(true);
      setMaxEditData(true);
      return;
    }
    const db = getFirestore();
  
    try {
      const userDocRef = collection(db, "users", user.uid, "data");
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
  };

  const handleTextboxSubmit = async () => {
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
      collection(db, "users", user.uid, "data")
    );
    let totalData2 = 0;

    userDocRef4.forEach((doc) => {
      totalData2++;
    });

    if (totalData2 >= 10) {
      setOpen(true);
      setAlert(true);
      return;
    }

    if (user) {
      try {
        await addDoc(collection(db, "users", user.uid, "data"), {
          rand: newData,
        });
        console.log("Document written with ID");
        setNewData("");
      } catch (error) {
        console.error("Error writing document:", error.message);
      }
    }
  };

  const handleDelete = async (index) => {
    const db = getFirestore();

    try {
      const userDocRef = collection(db, "users", user.uid, "data");
      const snapshot = await getDocs(userDocRef);
      const docToDelete = snapshot.docs[index];

      if (docToDelete) {
        await deleteDoc(doc(userDocRef, docToDelete.id));
      }
    } catch (error) {
      console.error("Error deleting document:", error.message);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  }

  const closeEdit = () => {
    setEditIndex(null);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
          <Collapse in={editOpen}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setEditOpen(false);
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
        <div className="tasksBorder">
          <h2 className="tasksText">Tasks</h2>
        </div>

        <div className="dataDiv">
          {userData.map((data, index) => (
            <div className="dataBorder" style={{overflow: 'hidden'}}>
              <p key={index} className="dataSize">{data.rand}</p>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="rest"
              >
                  <IconButton onClick={() => handleDelete(index)}>
                    <FaTrash />
                  </IconButton>
              </motion.button>
              
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="rest"
              >
              <button className='submitButton' onClick={() => handleEdit(index)}>
                edit
              </button>
              </motion.button>
              {editIndex === index && (
                <>
                  <button className="submitButton" style={{ paddingTop: '10px' }} onClick={closeEdit}>
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
                  </Collapse>)}
                  </div>
                  <TextField
                    id="outlined-basic"
                    label="Enter Updated Task"
                    variant="outlined"
                    color="secondary"
                    style={{ paddingTop: '10px' }}
                    value={editData}
                    onChange={(e) => handleEditTaskChange(e, index)}
                  />
                  
                  <button className="submitButton" onClick={() => handleEditSubmit(index)}>
                    Set Updated task
                  </button>
                </>
              )}
            </div>
          ))}
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
              Submit Tasks
            </button>
          </motion.button>
          </div>
      </div>
    </main>
  );
};

export default UserHome;
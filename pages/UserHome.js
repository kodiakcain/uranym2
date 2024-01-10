'use client'
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Adjust the path accordingly
import { getFirestore, doc, setDoc, addDoc, collection, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';
import '../styling/UserHome.Modules.css';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import { motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { FaTrash } from "react-icons/fa";

const UserHome = () => {

  //Hooks
  const [user, setUser] = useState(null); //User
  const [userData, setUserData] = useState([]); //User data
  const [newData, setNewData] = useState(""); //New data being entered
  const [maxUserAlert, setAlert] = useState(false); //Maximum users
  const [open, setOpen] = React.useState(true); //Alert
  const [maxTextAlert, setMaxTextAlert] = useState(false); //Max text alert
  const [lessTextAlert, setLessTextAlert] = useState(false); //Less text alert

  //Sub changes in auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, []);

  //Get data in real time using OnSnapshot
  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      const db = getFirestore();
      if (user) {
        try {
          const userDocRef3 = collection(db, 'users', user.uid, 'data');

          // Subscribe to real-time updates
          const unsubscribe = onSnapshot(userDocRef3, (snapshot) => {
            const updatedData = snapshot.docs.map((doc) => doc.data());
            setUserData(updatedData);
          });

          // Cleanup the subscription when the component unmounts
          return () => unsubscribe();
        } catch (error) {
          console.error('Error fetching data from Firestore:', error.message);
        }
      }
    };

    // Fetch data when the component mounts or when the user changes
    fetchDataFromFirestore();
  }, [user]);

  //Button Hover
  const buttonVariants = {
    rest: {
      scale: 1,
      boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
    },
    hover: {
      scale: 1.1,
      boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.2)',
    },
  };

  //Logout functionality
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirect to the home page or perform any other actions after logout
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

const handleTextboxChange = (e) => {
  setNewData(e.target.value);
};

const handleTextboxSubmit = async () => {

  //Task cannot exceed 200 characters.
  if (newData.length > 200 ) {
    setMaxTextAlert(true);
    return;
  }

  //Task cannot be 0 characters.
  if (newData.length <= 0) {
    setLessTextAlert(true);
    return;
  }

  //Get the database.
  const db = getFirestore();

  //Get data collection to count how much data.
  const userDocRef4 = await getDocs(collection(db, 'users', user.uid, 'data'));
    let totalData2 = 0;

    //Count each data.
    userDocRef4.forEach((doc) => {
      totalData2++;
    })

  //Max data is 10, alert user if trying to exceed.
  if (totalData2 >= 10) {
    setOpen(true);
    setAlert(true);
    return;
  }

  //If the user is logged in.
  if (user) {

    try {
      await addDoc(collection(db, 'users', user.uid, 'data'), {
        rand: newData,
      });
      console.log('Document written with ID');
      setNewData(""); // Clear the textbox after submission
    } catch (error) {
      console.error('Error writing document:', error.message);
    }
  }
};

const handleDelete = async (index) => {
  const db = getFirestore();

  try {
    const userDocRef = collection(db, 'users', user.uid, 'data');
    const snapshot = await getDocs(userDocRef);
    const docToDelete = snapshot.docs[index];

    if (docToDelete) {
      await deleteDoc(doc(userDocRef, docToDelete.id));
    }
  } catch (error) {
    console.error('Error deleting document:', error.message);
  }
};

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mainDiv">
        <div className='logoutDiv'>
        <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="rest"
        >
          {user ? (
          <Link href='/'>
            <button onClick={handleLogout} className='logoutBorder'>
            Logout
          </button>
          </Link>
        ) : (
          <p>User not logged in</p>
        )}
        </motion.button>
        </div>
        {maxUserAlert && <Collapse in={open}>
        <Alert
          severity='error'
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Max Data Reached.
        </Alert>
      </Collapse>}
      <div className='tasksBorder'>
        <h2 className='tasksText'>Tasks</h2>
      </div>
        
        <div className='dataDiv'>
        {userData.map((data, index) => (
          <div className='dataBorder'>
            <p key={index} >{data.rand}</p>
            <IconButton onClick={() => handleDelete(index)}>
              <FaTrash />
            </IconButton>
          </div>
          ))}
      </div>
      <div>
      {maxTextAlert && <Collapse in={open}>
        <Alert
          severity='error'
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
      </Collapse>}
      {lessTextAlert && <Collapse in={open}>
        <Alert
          severity='error'
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
      </Collapse>}
      </div>
      <div className='textBox'>
      
        <TextField id="outlined-basic" label="Enter Task" variant="outlined" color='secondary' value={newData}
          onChange={handleTextboxChange} />
      </div>
      <div className='submitDiv'>
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
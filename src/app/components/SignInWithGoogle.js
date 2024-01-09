import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth } from '../../../firebase';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import Alert from '@mui/material/Alert';
import { motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';


const SignInWithGoogle = ({ onSignIn }) => {

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
  
  const [open, setOpen] = React.useState(true);

  const db = getFirestore();
  const [userCredential, setUserCredential] = useState(null);
  const [maxUserAlert, setAlert] = useState(false);

  useEffect(() => {
    // ... (unchanged code for getRedirectResult)
  }, []);

  const handleSignInWithGoogle = async () => {
    const collectionRef = await getDocs(collection(db, 'users'));
    let totalUsers = 0;
    collectionRef.forEach((doc) => {
      totalUsers++;
    })

    console.log(totalUsers);

    if (totalUsers <= 20) {
      try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        const user = result.user;
        setUserCredential(result);
  
        // Store user information in Firestore
        const firestore = getFirestore();
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
          email: user.email,
          uid: user.uid,
        });
  
        // Pass the user information to the parent component
        onSignIn(user);
  
        // Redirect to UserHome page
        window.location.href = '/UserHome'
      } catch (error) {
        // Handle errors if needed
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      }
    } else {
      setAlert(true);
    }

    
  };

  return (
    <div>
      <br></br>
      <div>
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
          Max users reached - Try again later.
        </Alert>
      </Collapse>}
      </div>
      <br></br>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="rest"
        ><button onClick={handleSignInWithGoogle} className='bigText'>Sign in with Google</button></motion.button>
    </div>
  );
};

export default SignInWithGoogle;
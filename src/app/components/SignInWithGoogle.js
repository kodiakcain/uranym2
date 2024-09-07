import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth } from '../../../firebase';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

const SignInWithGoogle = ({ onSignIn }) => {
  const [open, setOpen] = useState(true);
  const [userCredential, setUserCredential] = useState(null);
  const [maxUserAlert, setAlert] = useState(false);

  const db = getFirestore();

  const handleSignInWithGoogle = async () => {
    const collectionRef = await getDocs(collection(db, 'users'));
    let totalUsers = 0;
    collectionRef.forEach(() => {
      totalUsers++;
    });

    if (totalUsers <= 20) {
      try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        const user = result.user;
        setUserCredential(result);

        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          email: user.email,
          uid: user.uid,
        });

        onSignIn(user);

        window.location.href = '/UserHome';
      } catch (error) {
        console.error(error.code, error.message);
      }
    } else {
      setOpen(true);
      setAlert(true);
    }
  };

  return (
    <div>
      <div>
        {maxUserAlert && (
          <Collapse in={open}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Max users reached - Try again later.
            </Alert>
          </Collapse>
        )}
      </div>
      <button onClick={handleSignInWithGoogle} className="google-signin-btn">
        Sign in with Google
      </button>
    </div>
  );
};

export default SignInWithGoogle;

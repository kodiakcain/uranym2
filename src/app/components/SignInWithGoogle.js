'use client'
import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth } from '../../../firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';

const SignInWithGoogle = ({ onSignIn }) => {
  const [userCredential, setUserCredential] = useState(null);

  useEffect(() => {
    // ... (unchanged code for getRedirectResult)
  }, []);

  const handleSignInWithGoogle = async () => {
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

    } catch (error) {
      // Handle errors if needed
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    }
  };

  return (
    <div>
      <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
      {userCredential && (
        <div>
          {/* Additional JSX goes here */}
        </div>
      )}
    </div>
  );
};

export default SignInWithGoogle;
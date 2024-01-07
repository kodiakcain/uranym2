'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import SignInWithGoogle from './components/SignInWithGoogle';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import '../../styling/Home.Modules.css';
import Particle from './components/Particle';
const Home = () => {
  const [user, setUser] = useState(null);

  const addCoolData = async () => {
    if (!user) {
      // User not authenticated
      return;
    }

    const db = getFirestore();
    const userUid = user.uid;

    try {
      // Create a reference to the user's 'cooldata' subcollection
      const coolDataCollectionRef = collection(db, 'users', userUid, 'cooldata');

      // Add or update the document within the 'cooldata' subcollection
      const coolDataDocRef = doc(coolDataCollectionRef, 'coolDataDocument');
      await setDoc(coolDataDocRef, {
        // Add your cool data here, for example:
        coolField: 'Cool value',
        // Add other fields as needed
      });

      console.log('Cool data added for UID: ', userUid);
    } catch (e) {
      console.error('Error adding cool data: ', e);
    }
  };

  const handleSignIn = (userData) => {
    setUser(userData);
  };

  return (
    <header>
      <title>Uranym</title>
    <main className="flex min-h-screen flex-col ">
        <div className='midDiv'>
          <Particle></Particle>
          <h1 className='bigTextTitle'>Uranym</h1>
          <SignInWithGoogle onSignIn={handleSignIn} />
        </div>
    </main>
    </header>
  );
};

export default Home;
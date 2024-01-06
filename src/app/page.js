'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import SignInWithGoogle from './components/SignInWithGoogle';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <SignInWithGoogle onSignIn={setUser} />
        {user && (
          <button onClick={addCoolData}>Add Cool Data</button>
        )}
      </div>
    </main>
  );
};

export default Home;
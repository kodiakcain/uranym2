import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Adjust the path accordingly
import { getFirestore, doc, setDoc, addDoc, collection } from 'firebase/firestore';
import '../styling/UserHome.Modules.css';
import Link from 'next/link';

const UserHome = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscribe to changes in authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirect to the home page or perform any other actions after logout
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // Example of interacting with Firestore
  const handleFirestoreInteraction = async () => {
    const db = getFirestore();
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      
      try {
        await setDoc(userDocRef, { data: 'urahgar' });
        console.log('Document written with ID: ', userDocRef.id);
      } catch (error) {
        console.error('Error writing document:', error.message);
      }
    }
  };

  const handleFirestoreInteraction2 = async () => {
  const db = getFirestore();
  if (user) {
    const userDocRef2 = doc(db, 'users', user.uid);

    try {
      await addDoc(collection(db, 'users', user.uid, 'data'), {
        rand: "hi",
      });
      console.log('Document written with ID: ', userDocRef2.id);
    } catch (error) {
      console.error('Error writing document:', error.message);
    }
  }
};

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {user ? (
          <Link href='/'>
<button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
          </Link>
        ) : (
          <p>User not logged in</p>
        )}
        <button onClick={handleFirestoreInteraction} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Firestore Interaction
        </button>
        <button onClick={handleFirestoreInteraction2} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Firestore Interaction 2
        </button>
      </div>
      <p>HOME</p>
    </main>
  );
};

export default UserHome;
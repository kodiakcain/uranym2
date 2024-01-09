'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import SignInWithGoogle from './components/SignInWithGoogle';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import '../../styling/Home.Modules.css';
import Particle from './components/Particle';
import { motion } from 'framer-motion';

const Home = () => {
  const [user, setUser] = useState(null);

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
          <h2 className='bigTextTitle'>Task Management</h2>
        <SignInWithGoogle onSignIn={handleSignIn} />
      
        </div>
    </main>
    </header>
  );
};

export default Home;
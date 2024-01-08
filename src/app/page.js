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

  return (
    <header>
      <title>Uranym</title>
    <main className="flex min-h-screen flex-col ">
        <div className='midDiv'>
          <Particle></Particle>
          <h1 className='bigTextTitle'>Uranym</h1>
          <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="rest"
        >
        <SignInWithGoogle onSignIn={handleSignIn} />
        </motion.button>
        </div>
    </main>
    </header>
  );
};

export default Home;
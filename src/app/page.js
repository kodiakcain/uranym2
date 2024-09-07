"use client";
import React, { useState } from "react";
import SignInWithGoogle from "./components/SignInWithGoogle";
import "../../styling/Home.Modules.css";

const Home = () => {
  const [user, setUser] = useState(null);

  const handleSignIn = (userData) => {
    setUser(userData);
  };

  return (
    <header>
      <title>Uranym</title>
      <main className="flex min-h-screen flex-col ">

        <div className="appbar">
          <h1 className="bigTextTitle">Uranym Task Management</h1>
        </div>

 
        <div className="midDiv">
          <h1 className="featuresText">Our Features:</h1>
          

          <div className="features-container">
            <div className="feature-card">
              <h3>Set Priorities</h3>
              <p>Organize tasks based on importance and stay focused on the highest-priority items.</p>
            </div>

            <div className="feature-card">
              <h3>Collaborate with Teams</h3>
              <p>Work with your team efficiently by assigning tasks and tracking progress in real-time.</p>
            </div>

            <div className="feature-card">
              <h3>Track Progress</h3>
              <p>Monitor your task completion status with visual progress indicators.</p>
            </div>
          </div>


          <SignInWithGoogle onSignIn={handleSignIn} />
        </div>
      </main>
    </header>
  );
};

export default Home;
import React from 'react';
import './App.css';
import DockerPage from './components/dockerPage'; // Import the FruitList component
import { BrowserRouter } from 'react-router-dom';


const App = () => {
  return (
    <BrowserRouter>
      <main>
        <DockerPage />
      </main>
    </BrowserRouter>
  );
};

export default App;
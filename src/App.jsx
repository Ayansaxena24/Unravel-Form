import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EmissionCounter from './EmissionCounter'
// import bg from './assets/bg.jpg';


function App() {

  return (
    <div 
    className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-100 py-8 px-4 sm:px-6 lg:px-8"
    >
      <EmissionCounter />
    </div>
  )
}

export default App

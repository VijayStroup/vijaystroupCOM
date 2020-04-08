import React from 'react'

import Nav from './components/Nav' 
import Landing from './components/Landing'
import About from './components/About'
import Projects from './components/Projects'

import ProjectContextProvider from './contexts/ProjectContext'

import 'bulma/css/bulma.css'
import '@fortawesome/fontawesome-free/js/all.js'
import './App.css'

function App() {
  return (
    <div className="App">
      <Nav />
      <Landing />
      <About />
      <ProjectContextProvider>
        <Projects />
      </ProjectContextProvider>
    </div>
  )
}

export default App

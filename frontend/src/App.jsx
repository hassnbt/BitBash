import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import JobListings from './job-listings'
import { ChakraProvider } from '@chakra-ui/react'
import JobList from './components/JobList'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  
       <div className="app">
      <h1>Job Listings</h1>
      <JobList/>
    </div>

    </>
  )
}

export default App

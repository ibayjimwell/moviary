import React, { useState } from 'react'
import Search from './components/Search'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
 
  return (
    <>
      <main>
        <div className='pattern'></div>

        <div className='wrapper'>
          <header>
            <img src="./hero.png" alt="Movies Banner" />
            <h1>Your Personal <span className='text-gradient'>Movie Diary</span> Anytime Anywhere</h1>
          </header>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Search>
        </div>
      </main>
    </>
  )
}

export default App
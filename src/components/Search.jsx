import React, { useState } from 'react'

const Search = () => {

  const [url, setUrl] = useState("")

  const handleSubmit = (e)=>{
    e.preventDefault()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url-field" className='label-search'>Solana Blockchain Explorer</label>
        <input
          type="url"
          value={url}
          placeholder="Search By Solana's Public Key"
          onChange={(e) => setUrl(e.target.value)}
          className='input-search'
        />
        <button className="btn-primary">Search</button>
      </form>
    </div>
  );
}

export default Search

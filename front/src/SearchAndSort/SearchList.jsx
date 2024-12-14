import React from 'react'
import './SearchList.css'

function SearchList({results}) {
    const handleClickList = (result) => {
        console.log(result.name);        //gets the element at index id from results
    }

  return (
    <div className='results-list'>
        {
            results.map((result, id) => {
                return <div key={id} onClick={() => handleClickList(result)}>{result.name}</div>;
              })    
        }      
    </div>
  )
}

export default SearchList
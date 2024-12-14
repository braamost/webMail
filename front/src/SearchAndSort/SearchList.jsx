import React from 'react'
import './SearchList.css'
import { useState } from 'react';

function SearchList({results ,onClickRemoveList}) {
    const handleClickList = (result) => {
        console.log(result.name);        //gets the element at index id from results
        onClickRemoveList();
    }

    return (
      <div className='results-list'>
        {
          results.map((result, id) => {
            return <div key={id} onClick={() => handleClickList(result)}>{result.name}</div>;
          })    
        }      
      </div>
    );
}

export default SearchList
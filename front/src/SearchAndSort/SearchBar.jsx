import React from 'react'
import './SearchBar.css'
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import SearchList from './SearchList.jsx';

function SearchBar() {
    const [inputSearch, setInputSearch] = useState('');
    const [results, setResults] = useState([]);
    const [showList, setShowList] = useState(false);

    const fetchData = (value) => {
        fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(json =>{
            const result = json.filter(user => {
                return value &&user && user.name && user.name.toLowerCase().includes(value.toLowerCase())});
            setResults(result);
            });
    }     

    const handleOnChange = (value) => {
        setInputSearch(value);
        fetchData(value);
        setShowList(true);
      };

    const handleOnClickUser = () => {
        setInputSearch('');
        setShowList(false);
    }
  return (
    <div className = "search-bar-container">
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input 
            className ="inputStyle" 
            type="text" 
            placeholder="Type to search ..." 
            onChange={(e) => {handleOnChange(e.target.value)}} 
            value = {inputSearch} 
            />
        </div>
        {showList && <SearchList results={results}  onClickRemoveList={handleOnClickUser}/>}
    </div>
  )
}

export default SearchBar
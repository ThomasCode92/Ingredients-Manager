import React, { useEffect, useRef, useState } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const fetchIngredients = async () => {
      const query =
        enteredFilter.length === 0 ? '' : `?filterBy=${enteredFilter}`;
      const response = await fetch('/api/ingredients' + query);
      const responseData = await response.json();

      const loadedIngredients = responseData.data;

      console.log(responseData.message);
      onLoadIngredients(loadedIngredients);
    };

    setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        fetchIngredients();
      }
    }, 500);
  }, [enteredFilter, onLoadIngredients]);

  const filterChangeHandler = event => {
    setEnteredFilter(event.target.value);
  };

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={filterChangeHandler}
          />
        </div>
      </Card>
    </section>
  );
};

export default React.memo(Search);

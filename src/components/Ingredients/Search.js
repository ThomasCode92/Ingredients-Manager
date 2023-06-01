import React, { useEffect, useRef, useState } from 'react';

import ErrorModal from '../UI/ErrorModal';
import Card from '../UI/Card';
import './Search.css';

import useHttp from '../hooks/useHttp';

const Search = props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  const { data, isLoading, error, sendRequest, reset } = useHttp();

  useEffect(() => {
    const fetchIngredients = () => {
      const query =
        enteredFilter.length === 0 ? '' : `?filterBy=${enteredFilter}`;

      sendRequest('/api/ingredients' + query, 'GET');
    };

    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        fetchIngredients();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, sendRequest]);

  const filterChangeHandler = event => {
    setEnteredFilter(event.target.value);
  };

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = data.httpData;

      console.log(data.message);
      onLoadIngredients(loadedIngredients);
    }
  }, [data, error, isLoading, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={reset}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Searching...</span>}
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

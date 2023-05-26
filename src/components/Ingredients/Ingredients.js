import React, { useCallback, useState } from 'react';

import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = async ingredient => {
    setIsLoading(true);
    const response = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredient),
    });

    setIsLoading(false);
    const responseData = await response.json();

    console.log(responseData.message);
    setIngredients(prevIngredients => [...prevIngredients, responseData.data]);
  };

  const removeIngredientHandler = async ingredientId => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ingredients/' + ingredientId, {
        method: 'DELETE',
      });

      const responseData = await response.json();

      if (response.status !== 200) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);

      console.log(responseData.message);
      setIngredients(responseData.data);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientsList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;

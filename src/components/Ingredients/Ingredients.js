import React, { useCallback, useReducer, useState } from 'react';

import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList';
import Search from './Search';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET_INGREDIENTS':
      return [...action.payload];
    case 'ADD_INGREDIENT':
      return [...currentIngredients, action.payload];
    case 'DELETE_INGREDIENT':
      return [...currentIngredients].filter(
        ingredient => ingredient.id !== action.payload
      );
    default:
      throw new Error('No matching identifier found');
  }
};

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET_INGREDIENTS', payload: filteredIngredients });
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
    dispatch({ type: 'ADD_INGREDIENT', payload: responseData.data });
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
      dispatch({ type: 'DELETE_INGREDIENT', payload: responseData.data.id });
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

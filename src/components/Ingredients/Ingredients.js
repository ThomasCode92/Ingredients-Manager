import React, { useCallback, useEffect, useMemo, useReducer } from 'react';

import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList';
import Search from './Search';

import useHttp from '../hooks/useHttp';

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
  const { data, isLoading, error, sendRequest } = useHttp();

  useEffect(() => {
    if (!data) return;

    if (data.httpMethod === 'POST') {
      return dispatch({ type: 'ADD_INGREDIENT', payload: data.httpData });
    }

    if (data.httpMethod === 'DELETE') {
      return dispatch({ type: 'DELETE_INGREDIENT', payload: data.httpData.id });
    }
  }, [data]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({
      type: 'SET_INGREDIENTS',
      payload: filteredIngredients,
    });
  }, []);

  const addIngredientHandler = useCallback(
    async ingredient => {
      sendRequest('/api/ingredients', 'POST', JSON.stringify(ingredient));
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    async ingredientId => {
      sendRequest('/api/ingredients/' + ingredientId, 'DELETE');
    },
    [sendRequest]
  );

  const clearError = useCallback(() => {}, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientsList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;

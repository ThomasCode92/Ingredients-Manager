import React, { useCallback, useMemo, useReducer } from 'react';

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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { isLoading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, isLoading: false };
    case 'ERROR':
      return { isLoading: false, error: action.payload };
    default:
      throw new Error('No matching identifier found');
  }
};

const Ingredients = () => {
  const [ingredients, dispatchIngredients] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttpState] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
  });

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatchIngredients({
      type: 'SET_INGREDIENTS',
      payload: filteredIngredients,
    });
  }, []);

  const addIngredientHandler = useCallback(async ingredient => {
    dispatchHttpState({ type: 'SEND' });
    const response = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredient),
    });

    dispatchHttpState({ type: 'RESPONSE' });
    const responseData = await response.json();

    console.log(responseData.message);
    dispatchIngredients({ type: 'ADD_INGREDIENT', payload: responseData.data });
  }, []);

  const removeIngredientHandler = useCallback(async ingredientId => {
    try {
      dispatchHttpState({ type: 'SEND' });
      const response = await fetch('/api/ingredients/' + ingredientId, {
        method: 'DELETE',
      });

      const responseData = await response.json();

      if (response.status !== 200) {
        throw new Error(responseData.message);
      }

      console.log(responseData.message);
      dispatchHttpState({ type: 'RESPONSE' });
      dispatchIngredients({
        type: 'DELETE_INGREDIENT',
        payload: responseData.data.id,
      });
    } catch (error) {
      console.log(error);
      dispatchHttpState({ type: 'ERROR', payload: error.message });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatchHttpState({ type: 'ERROR', payload: null });
  }, []);

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
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;

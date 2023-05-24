import React, { useEffect, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      const response = await fetch('/api/ingredients');
      const responseData = await response.json();

      const loadedIngredients = responseData.data;

      console.log(responseData.message);
      setIngredients(loadedIngredients);
    };

    fetchIngredients();
  }, []);

  const filteredIngredientsHandler = filteredIngredients => {
    setIngredients(filteredIngredients);
  };

  const addIngredientHandler = async ingredient => {
    const response = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredient),
    });

    const responseData = await response.json();

    console.log(responseData.message);
    setIngredients(prevIngredients => [...prevIngredients, responseData.data]);
  };

  const removeIngredientHandler = ingredientId => {
    setIngredients(prevIngredients => {
      const updatedIngredients = prevIngredients.filter(
        ingredient => ingredient.id !== ingredientId
      );
      return updatedIngredients;
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

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

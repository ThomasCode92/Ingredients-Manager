import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const addIngredientHandler = ingredient => {
    setIngredients(prevIngredients => [
      ...prevIngredients,
      { id: Math.random(), ...ingredient },
    ]);
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientsList ingredients={ingredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
};

export default Ingredients;

import { rest } from 'msw';

const ingredients = [{ id: 123, title: 'Apples', amount: 5 }];

export const handlers = [
  rest.get('/api/ingredients', (req, res, ctx) => {
    const searchParams = req.url.searchParams;
    const filter = searchParams.get('filterBy');

    let filteredIngredients;

    if (filter) {
      filteredIngredients = ingredients.filter(
        ingredient => ingredient.title === filter
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        message: 'Ingredients fetched successfully',
        data: filteredIngredients || ingredients,
      })
    );
  }),
  rest.post('/api/ingredients', async (req, res, ctx) => {
    const { title, amount } = await req.json();
    const ingredient = { id: Math.random(), title, amount };

    ingredients.push(ingredient);

    return res(
      ctx.status(201),
      ctx.json({
        message: 'Ingredient created successfully',
        data: ingredient,
      })
    );
  }),
  rest.delete('/api/ingredients/:id', async (req, res, ctx) => {
    const ingredientId = parseFloat(req.params.id);

    const ingredientIdx = ingredients.findIndex(
      ingredient => ingredient.id === ingredientId
    );

    ingredients.splice(ingredientIdx, 1);

    return res(
      ctx.status(200),
      ctx.json({
        message: 'Ingredient delete successfully',
        data: ingredients,
      })
    );
  }),
];

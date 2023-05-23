import { rest } from 'msw';

const ingredients = [];

export const handlers = [
  rest.get('/api/ingredients', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Ingredients fetched successfully',
        data: ingredients,
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
];

import { useCallback, useReducer } from 'react';

const initialState = { data: null, isLoading: false, error: null };

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { isLoading: true, error: null, data: null };
    case 'RESPONSE':
      return { ...httpState, isLoading: false, data: action.payload };
    case 'ERROR':
      return { isLoading: false, error: action.payload };
    case 'CLEAR':
      return { ...initialState };
    default:
      throw new Error('No matching identifier found');
  }
};

const useHttp = () => {
  const [httpState, dispatch] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const sendRequest = useCallback(async (url, method, body) => {
    try {
      dispatch({ type: 'SEND' });
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      console.log(responseData.message);
      dispatch({
        type: 'RESPONSE',
        payload: { httpData: responseData.data, httpMethod: method },
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'ERROR', payload: error.message });
    }
  }, []);

  return {
    data: httpState.data,
    isLoading: httpState.isLoading,
    error: httpState.error,
    sendRequest: sendRequest,
    reset: clear,
  };
};

export default useHttp;

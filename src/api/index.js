const API_URL = 'https://api.exchangeratesapi.io/latest';

export const fetchExchangeRate = async (source, pockets) => {
  try {
    const response = await fetch(
      `${API_URL}?base=${source}&symbols=${pockets.join(',')}`
    );

    return response.json();
  } catch (e) {
    throw new Error(e);
  }
};

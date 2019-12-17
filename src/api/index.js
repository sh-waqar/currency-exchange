const API_URL = 'https://api.exchangeratesapi.io/latest';

export const fetchRate = async (source, pockets) => {
  try {
    return fetch(
      `${API_URL}?base=${source}&symbols=${pockets.join(',')}`
    ).then(res => res.json());
  } catch (e) {
    return {};
  }
};

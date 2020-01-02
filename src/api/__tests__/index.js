import { fetchExchangeRate } from 'api';

const mock = { base: 'EUR', rates: { GBP: 1.9, USD: 1.9 } };

beforeEach(() => {
  window.fetch = jest.fn();
});

it('should fetch the exchange rate based on source and target currencies', async () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve(mock)
    })
  );

  const response = await fetchExchangeRate('EUR', ['USD', 'GBP']);

  expect(response).toEqual(mock);

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenLastCalledWith(
    'https://api.exchangeratesapi.io/latest?base=EUR&symbols=USD,GBP'
  );
});

it('should throw error on failure', async () => {
  fetch.mockImplementationOnce(() => Promise.reject());

  await expect(fetchExchangeRate('EUR', ['USD'])).rejects.toThrow();
});

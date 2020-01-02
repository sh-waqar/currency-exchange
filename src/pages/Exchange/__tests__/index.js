import React from 'react';
import {
  fireEvent,
  wait,
  waitForElement,
  waitForElementToBeRemoved,
  cleanup,
  getAllByRole
} from '@testing-library/react';

import renderWithRedux from 'helpers/renderWithRedux';
import Exchange from 'pages/Exchange';
import { fetchExchangeRate } from 'api';

jest.mock('api');

function changePageVisibility({ hidden = true } = {}) {
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    get() {
      return hidden;
    },
    set(bool) {
      hidden = Boolean(bool);
    }
  });

  document.dispatchEvent(new Event('visibilitychange'));
}

beforeEach(() => {
  fetchExchangeRate.mockImplementation((source, pockets) =>
    Promise.resolve({
      rates: { [pockets[0]]: 1.123456, [pockets[1]]: 1.654321 },
      base: source
    })
  );
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('exchange button should be disabled', () => {
  it('when there is no input', () => {
    const { getByTestId } = renderWithRedux(<Exchange />);

    const exchangeButton = getByTestId('exchange-button');
    const sourceInput = getByTestId('source-input');

    expect(sourceInput).toHaveValue('');

    expect(exchangeButton.innerHTML).toEqual('Exchange');
    expect(exchangeButton).toBeDisabled();

    fireEvent.change(sourceInput, { target: { value: '0.00' } });

    expect(sourceInput).toHaveValue('0.00');
    expect(exchangeButton).toBeDisabled();
  });

  it('when there is not enough money in pocket', async () => {
    const { getByTestId } = renderWithRedux(<Exchange />);

    const exchangeButton = getByTestId('exchange-button');
    const sourceInput = getByTestId('source-input');

    await waitForElement(() => getByTestId('current-rate'));

    fireEvent.change(sourceInput, { target: { value: '3000' } });

    expect(sourceInput).toHaveValue('3000');

    expect(exchangeButton.innerHTML).toEqual('Exchange');
    expect(exchangeButton).toBeDisabled();
  });
});

it('should show error message and hide submit button when the latest exchange rate is not fetched', async () => {
  jest.useFakeTimers();

  const { getByTestId } = renderWithRedux(<Exchange />);

  const exchangeButton = getByTestId('exchange-button');
  const sourceInput = getByTestId('source-input');

  await waitForElement(() => getByTestId('current-rate'));

  fireEvent.change(sourceInput, { target: { value: '3000' } });

  expect(sourceInput).toHaveValue('3000');
  expect(exchangeButton.innerHTML).toEqual('Exchange');
  expect(exchangeButton).toBeDisabled();

  fetchExchangeRate.mockRejectedValueOnce(new Error('Fetch error'));

  jest.advanceTimersByTime(20000);

  await waitForElementToBeRemoved(() => getByTestId('exchange-button'));

  const errMsg = await waitForElement(() => getByTestId('error-message'));
  expect(errMsg).toBeInTheDocument();
});

it('should show the formated current exchange rate', async () => {
  const { getByTestId } = renderWithRedux(<Exchange />);

  const sourceRate = await waitForElement(() =>
    getByTestId('source-currency-rate')
  );
  const currentRate = await waitForElement(() => getByTestId('current-rate'));

  expect(sourceRate.innerHTML).toEqual('€1');
  expect(currentRate.innerHTML).toEqual('£1.6543');
});

it('should show the loading indicator', async () => {
  const { getByTestId } = renderWithRedux(<Exchange />);

  const currentRate = getByTestId('current-rate');

  expect(currentRate.innerHTML).toEqual('...');

  await waitForElement(() => getByTestId('current-rate'));

  expect(currentRate.innerHTML).toEqual('£1.6543');
});

it('should request the exchange rate every 10 seconds', async () => {
  jest.useFakeTimers();

  const { getByTestId, unmount } = renderWithRedux(<Exchange />);

  await waitForElement(() => getByTestId('current-rate'));

  expect(fetchExchangeRate).toHaveBeenCalledTimes(1);
  expect(fetchExchangeRate).toHaveBeenLastCalledWith('EUR', ['USD', 'GBP']);

  jest.advanceTimersByTime(10000);

  expect(fetchExchangeRate).toHaveBeenCalledTimes(2);
  expect(fetchExchangeRate).toHaveBeenLastCalledWith('EUR', ['USD', 'GBP']);

  jest.advanceTimersByTime(30000);

  expect(fetchExchangeRate).toHaveBeenCalledTimes(5);
  expect(fetchExchangeRate).toHaveBeenLastCalledWith('EUR', ['USD', 'GBP']);

  unmount();

  jest.advanceTimersByTime(50000);

  expect(fetchExchangeRate).toHaveBeenCalledTimes(5);
});

it('should not request the exchange rate if page is not active', async () => {
  jest.useFakeTimers();

  const { getByTestId } = renderWithRedux(<Exchange />);

  await waitForElement(() => getByTestId('current-rate'));

  expect(fetchExchangeRate).toHaveBeenCalledTimes(1);
  expect(fetchExchangeRate).toHaveBeenLastCalledWith('EUR', ['USD', 'GBP']);

  changePageVisibility({ hidden: true });

  jest.advanceTimersByTime(100000);

  expect(fetchExchangeRate).toHaveBeenCalledTimes(1);

  changePageVisibility({ hidden: false });

  jest.advanceTimersByTime(10000);

  expect(fetchExchangeRate).toHaveBeenCalledTimes(3);
  expect(fetchExchangeRate).toHaveBeenLastCalledWith('EUR', ['USD', 'GBP']);
});

it('should re-fetch the exchange rate if source currency is changed', async () => {
  const { getByTestId } = renderWithRedux(<Exchange />);

  await waitForElement(() => getByTestId('current-rate'));

  const sourceCurrencySelector = getByTestId('source-currency-selector');
  fireEvent.change(sourceCurrencySelector, { target: { value: 'USD' } });

  expect(sourceCurrencySelector).toHaveValue('USD');
  expect(fetchExchangeRate).toHaveBeenCalledTimes(2);
  expect(fetchExchangeRate).toHaveBeenLastCalledWith('USD', ['EUR', 'GBP']);
});

it('should update the target rate when target currency is changed', async () => {
  const { getByTestId } = renderWithRedux(<Exchange />);

  const sourceRate = await waitForElement(() =>
    getByTestId('source-currency-rate')
  );
  const currentRate = await waitForElement(() => getByTestId('current-rate'));

  const sourceBalance = getByTestId('source-balance');
  const targetBalance = getByTestId('target-balance');
  const targetCurrencySelector = getByTestId('target-currency-selector');

  fireEvent.change(targetCurrencySelector, { target: { value: 'USD' } });

  expect(targetCurrencySelector).toHaveValue('USD');

  expect(fetchExchangeRate).toHaveBeenCalledTimes(1);
  expect(fetchExchangeRate).toHaveBeenLastCalledWith('EUR', ['USD', 'GBP']);

  expect(sourceRate.innerHTML).toEqual('€1');
  expect(currentRate.innerHTML).toEqual('$1.1235');

  expect(sourceBalance).toHaveTextContent('€230.00');
  expect(targetBalance).toHaveTextContent('$350.00');
});

it('should update the source rate format and re-fetch rate when source currency is changed', async () => {
  const { getByTestId } = renderWithRedux(<Exchange />);

  const sourceRate = await waitForElement(() =>
    getByTestId('source-currency-rate')
  );
  const currentRate = await waitForElement(() => getByTestId('current-rate'));

  const sourceBalance = getByTestId('source-balance');
  const targetBalance = getByTestId('target-balance');
  const sourceCurrencySelector = getByTestId('source-currency-selector');
  const targetCurrencySelector = getByTestId('target-currency-selector');

  fireEvent.change(sourceCurrencySelector, { target: { value: 'USD' } });

  expect(sourceCurrencySelector).toHaveValue('USD');
  expect(targetCurrencySelector).toHaveValue('GBP');

  expect(fetchExchangeRate).toHaveBeenLastCalledWith('USD', ['EUR', 'GBP']);

  await waitForElement(() => getByTestId('current-rate'));

  expect(sourceRate.innerHTML).toEqual('$1');
  expect(currentRate.innerHTML).toEqual('£1.6543');

  expect(sourceBalance).toHaveTextContent('$350.00');
  expect(targetBalance).toHaveTextContent('£650.00');
});

it('should swap currencies when swap button is clicked', async () => {
  fetchExchangeRate.mockImplementationOnce(() =>
    Promise.resolve({
      rates: { USD: 1.1186, GBP: 0.852741 },
      base: 'EUR'
    })
  );

  const { getByTestId } = renderWithRedux(<Exchange />);

  const sourceRate = await waitForElement(() =>
    getByTestId('source-currency-rate')
  );
  const currentRate = await waitForElement(() => getByTestId('current-rate'));

  expect(fetchExchangeRate).toHaveBeenCalledTimes(1);
  expect(fetchExchangeRate).toHaveBeenLastCalledWith('EUR', ['USD', 'GBP']);

  const swapButton = getByTestId('swap-button');

  const sourceCurrencySelector = getByTestId('source-currency-selector');
  const targetCurrencySelector = getByTestId('target-currency-selector');
  const sourceInput = getByTestId('source-input');
  const targetInput = getByTestId('target-input');
  const sourceBalance = getByTestId('source-balance');
  const targetBalance = getByTestId('target-balance');

  fireEvent.change(sourceInput, { target: { value: '100' } });

  expect(sourceInput).toHaveValue('100');
  expect(targetInput).toHaveValue('85.27');

  expect(sourceCurrencySelector).toHaveValue('EUR');
  expect(targetCurrencySelector).toHaveValue('GBP');

  expect(sourceRate.innerHTML).toEqual('€1');
  expect(currentRate.innerHTML).toEqual('£0.8527');

  expect(sourceBalance).toHaveTextContent('€230.00');
  expect(targetBalance).toHaveTextContent('£650.00');

  fetchExchangeRate.mockImplementationOnce(() =>
    Promise.resolve({
      rates: { USD: 1.31177, EUR: 1.17269 },
      base: 'GBP'
    })
  );

  fireEvent.click(swapButton);

  const updatedCurrentRate = await waitForElement(() =>
    getByTestId('current-rate')
  );

  expect(fetchExchangeRate).toHaveBeenCalledTimes(2);
  expect(fetchExchangeRate).toHaveBeenLastCalledWith('GBP', ['EUR', 'USD']);

  expect(sourceInput).toHaveValue('85.27');
  expect(targetInput).toHaveValue('100');

  expect(sourceCurrencySelector).toHaveValue('GBP');
  expect(targetCurrencySelector).toHaveValue('EUR');

  expect(sourceRate.innerHTML).toEqual('£1');
  expect(updatedCurrentRate.innerHTML).toEqual('€1.1727');

  expect(sourceBalance).toHaveTextContent('£650.00');
  expect(targetBalance).toHaveTextContent('€230.00');
});

it('should update the target input when source input is changed', async () => {
  const { getByTestId } = renderWithRedux(<Exchange />);

  await waitForElement(() => getByTestId('source-currency-rate'));

  const sourceInput = getByTestId('source-input');
  const targetInput = getByTestId('target-input');

  fireEvent.change(sourceInput, { target: { value: '100' } });

  expect(sourceInput).toHaveValue('100');
  expect(targetInput).toHaveValue('165.43');
});

it('should allow to exchange money properly', async () => {
  const { getByTestId } = renderWithRedux(<Exchange />);

  await waitForElement(() => getByTestId('source-currency-rate'));

  const exchangeButton = getByTestId('exchange-button');

  const sourceInput = getByTestId('source-input');
  const targetInput = getByTestId('target-input');
  const sourceBalance = getByTestId('source-balance');
  const targetBalance = getByTestId('target-balance');

  fireEvent.change(sourceInput, { target: { value: '100' } });

  expect(sourceBalance).toHaveTextContent('€230.00');
  expect(targetBalance).toHaveTextContent('£650.00');
  expect(sourceInput).toHaveValue('100');
  expect(targetInput).toHaveValue('165.43');

  fireEvent.click(exchangeButton);

  expect(sourceBalance).toHaveTextContent('€130.00');
  expect(targetBalance).toHaveTextContent('£815.43');
  expect(sourceInput).toHaveValue('');
  expect(targetInput).toHaveValue('');
});

it('should not allow to select target currency in source and vice-versa', async () => {
  const { getByTestId } = renderWithRedux(<Exchange />);

  await waitForElement(() => getByTestId('current-rate'));

  const sourceCurrencySelector = getByTestId('source-currency-selector');
  const targetCurrencySelector = getByTestId('target-currency-selector');

  const sourceOptions = getAllByRole(sourceCurrencySelector, 'option');
  const targetOptions = getAllByRole(sourceCurrencySelector, 'option');

  expect(sourceCurrencySelector).toHaveValue('EUR');
  expect(targetCurrencySelector).toHaveValue('GBP');

  expect(sourceOptions).not.toContain('GBP');
  expect(targetOptions).not.toContain('EUR');
});

it('should update the opposite input value in real-time', async () => {
  jest.useFakeTimers();

  const { getByTestId } = renderWithRedux(<Exchange />);

  const sourceInput = getByTestId('source-input');
  const targetInput = getByTestId('target-input');

  const currentRate = await waitForElement(() => getByTestId('current-rate'));

  fireEvent.change(sourceInput, { target: { value: '100' } });

  expect(currentRate).toHaveTextContent('1.6543');
  expect(sourceInput).toHaveValue('100');
  expect(targetInput).toHaveValue('165.43');

  fetchExchangeRate.mockImplementation((source, pockets) =>
    Promise.resolve({
      rates: { [pockets[0]]: 1.3321, [pockets[1]]: 1.8895 },
      base: source
    })
  );

  jest.advanceTimersByTime(20000);

  const updatedCurrentRate = await waitForElement(() =>
    getByTestId('current-rate')
  );

  expect(updatedCurrentRate).toHaveTextContent('1.8895');
  expect(sourceInput).toHaveValue('100');
  expect(targetInput).toHaveValue('188.95');
});

it('should trigger alert message when close button is clicked', async () => {
  const { getByTestId } = renderWithRedux(<Exchange />);

  window.alert = jest.fn();

  const closeButton = getByTestId('close-button');

  fireEvent.click(closeButton);

  expect(window.alert).toHaveBeenCalledTimes(1);
});

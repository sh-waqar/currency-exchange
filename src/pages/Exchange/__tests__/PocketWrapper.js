import React from 'react';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from 'helpers/renderWithRedux';
import PocketWrapper from 'pages/Exchange/PocketWrapper';
import colors from 'colors';

afterEach(cleanup);

describe('Input validation', () => {
  it('should allow small numbers as input', () => {
    const { getByTestId } = renderWithRedux(
      <PocketWrapper
        origin="source"
        currency="EUR"
        supportedPockets={['USD', 'EUR']}
      />
    );

    const input = getByTestId('source-input');

    userEvent.type(input, '0.');
    expect(input).toHaveValue('0.');

    userEvent.type(input, '0.');
    expect(input).toHaveValue('0.');

    userEvent.type(input, '0.0');
    expect(input).toHaveValue('0.0');

    userEvent.type(input, '0.00');
    expect(input).toHaveValue('0.00');

    userEvent.type(input, '0.000');
    expect(input).toHaveValue('0.00');
  });

  it('should only allow numbers as input', () => {
    const { getByTestId } = renderWithRedux(
      <PocketWrapper
        origin="source"
        currency="EUR"
        supportedPockets={['USD', 'EUR']}
      />
    );

    const input = getByTestId('source-input');

    userEvent.type(input, 'abc');
    expect(input).toHaveValue('');

    userEvent.type(input, '1a');
    expect(input).toHaveValue('1');

    userEvent.type(input, '-1');
    expect(input).toHaveValue('');

    userEvent.type(input, '+1');
    expect(input).toHaveValue('');

    userEvent.type(input, '#@%^1');
    expect(input).toHaveValue('');
  });

  it('should only 2 decimal places as input', () => {
    const { getByTestId } = renderWithRedux(
      <PocketWrapper
        origin="source"
        currency="EUR"
        supportedPockets={['USD', 'EUR']}
      />
    );

    const input = getByTestId('source-input');

    userEvent.type(input, '22');
    expect(input).toHaveValue('22');

    userEvent.type(input, '22.');
    expect(input).toHaveValue('22.');

    userEvent.type(input, '22.5');
    expect(input).toHaveValue('22.5');

    userEvent.type(input, '22.56');
    expect(input).toHaveValue('22.56');

    userEvent.type(input, '22.567');
    expect(input).toHaveValue('22.56');

    userEvent.type(input, '22.2.');
    expect(input).toHaveValue('22.2');

    userEvent.type(input, '22.2.1');
    expect(input).toHaveValue('22.2');
  });

  it('should only allow increasing positive numbers as input', () => {
    const { getByTestId } = renderWithRedux(
      <PocketWrapper
        origin="source"
        currency="EUR"
        supportedPockets={['USD', 'EUR']}
      />
    );

    const input = getByTestId('source-input');

    userEvent.type(input, '0');
    expect(input).toHaveValue('0');

    userEvent.type(input, '00');
    expect(input).toHaveValue('0');

    userEvent.type(input, '000');
    expect(input).toHaveValue('0');

    userEvent.type(input, '01');
    expect(input).toHaveValue('1');
  });
});

describe('style', () => {
  it('should indicate for low balance', () => {
    const { getByTestId } = renderWithRedux(
      <PocketWrapper
        origin="source"
        currency="EUR"
        supportedPockets={['USD', 'EUR']}
      />
    );

    const input = getByTestId('source-input');
    const balance = getByTestId('source-balance');

    expect(balance).toHaveStyle(`
      color: ${colors.lightGray};
    `);

    userEvent.type(input, '1000');

    expect(balance).toHaveStyle(`
      color: red;
    `);
  });

  it('should have right background color based on origin', () => {
    const SourcePocket = renderWithRedux(
      <PocketWrapper
        origin="source"
        currency="EUR"
        supportedPockets={['USD', 'EUR']}
      />
    );
    const TargetPocket = renderWithRedux(
      <PocketWrapper
        origin="target"
        currency="EUR"
        supportedPockets={['USD', 'EUR']}
      />
    );

    expect(SourcePocket.container.firstChild).toHaveStyle(`
      background-color: #fff;
    `);
    expect(TargetPocket.container.firstChild).toHaveStyle(`
      background-color: ${colors.gray};
    `);
  });

  it('should show respective signs on numbers greater than 0', () => {
    const SourcePocket = renderWithRedux(
      <PocketWrapper
        origin="source"
        currency="EUR"
        supportedPockets={['USD', 'EUR']}
      />
    );
    const TargetPocket = renderWithRedux(
      <PocketWrapper
        origin="target"
        currency="EUR"
        supportedPockets={['USD', 'EUR']}
      />
    );

    const sourceInput = SourcePocket.getByTestId('source-input');
    const targetInput = SourcePocket.getByTestId('target-input');

    expect(SourcePocket.container).not.toHaveTextContent('-');
    expect(TargetPocket.container).not.toHaveTextContent('+');

    userEvent.type(sourceInput, '0');
    userEvent.type(targetInput, '0');

    expect(SourcePocket.container).not.toHaveTextContent('-');
    expect(TargetPocket.container).not.toHaveTextContent('+');

    userEvent.type(sourceInput, '0.00');
    userEvent.type(targetInput, '0.00');

    expect(SourcePocket.container).not.toHaveTextContent('-');
    expect(TargetPocket.container).not.toHaveTextContent('+');

    userEvent.type(sourceInput, '0.01');
    userEvent.type(targetInput, '0.01');

    expect(SourcePocket.container).toHaveTextContent('-');
    expect(TargetPocket.container).toHaveTextContent('+');

    userEvent.type(sourceInput, '112.12');
    userEvent.type(targetInput, '112.12');

    expect(SourcePocket.container).toHaveTextContent('-');
    expect(TargetPocket.container).toHaveTextContent('+');
  });
});

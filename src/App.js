import React from 'react';
import { Provider } from 'react-redux';

import 'normalize.css';
import 'index.css';

import configureStore from 'redux/configureStore';

import Container from 'components/Container';
import AppShell from 'components/AppShell';
import Exchange from 'pages/Exchange';

const store = configureStore({});

const App = () => (
  <Provider store={store}>
    <Container>
      <AppShell>
        <Exchange />
      </AppShell>
    </Container>
  </Provider>
);

export default App;

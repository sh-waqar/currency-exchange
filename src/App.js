import React from 'react';
import 'normalize.css';

import './index.css';

import Container from './components/Container';
import AppShell from './components/AppShell';
import Exchange from './pages/Exchange';

function App() {
  return (
    <Container>
      <AppShell>
        <Exchange />
      </AppShell>
    </Container>
  );
}

export default App;

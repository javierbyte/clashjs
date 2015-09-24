import React from 'react';
import App from './App.jsx';

import seedrandom from 'seedrandom';
seedrandom('nodejs-meetup', { global: true });

React.render(<App />, document.getElementById('root'));

// Button.js
import React, { useContext } from 'react';
import ThemeContext from './ContextExample';

const Button = () => {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme === 'light' ? 'white' : 'black', color: theme === 'light' ? 'black' : 'white' }}>
      Toggle Theme
    </button>
  );
};

export default Button;

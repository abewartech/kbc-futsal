/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<App />);
  // Unmount to clear pending Splash-screen navigation timers.
  // Otherwise they fire after the Jest environment tears down and crash the worker.
  tree.unmount();
});

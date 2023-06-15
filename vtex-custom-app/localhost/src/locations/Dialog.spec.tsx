import React from 'react';
import { render } from '@testing-library/react';
import Dialog from '../locations/Dialog';

describe('Dialog component', () => {
  it('Component text exists', () => {
    const onClose = jest.fn();
    const onProductSelect = jest.fn();

    const { getByText } = render(
      <Dialog onClose={onClose} onProductSelect={onProductSelect} />
    );

    expect(getByText('Hello Dialog Component (AppId: test-app)')).toBeInTheDocument();
  });
});

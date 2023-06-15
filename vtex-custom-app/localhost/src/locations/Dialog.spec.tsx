import React from 'react';
import { render } from '@testing-library/react';
import Dialog from '../locations/Dialog';

describe('Dialog component', () => {
  it('Component text exists', () => {
    const onClose = jest.fn();
    const onProductSelect = jest.fn();
    const parameters = {
      'X-VTEX-API-AppKey': 'your-app-key',
      'X-VTEX-API-AppToken': 'your-app-token',
      'vtexHostname': 'your-vtex-hostname'
    };

    const { getByText } = render(
      <Dialog parameters={parameters} onClose={onClose} onProductSelect={onProductSelect} />
    );

    expect(getByText('Hello Dialog Component (AppId: test-app)')).toBeInTheDocument();
  });
});

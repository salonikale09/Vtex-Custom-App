import React, { useCallback, useState, useEffect } from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import { Heading, Form, Paragraph, Flex, FormControl, TextInput, Grid } from '@contentful/f36-components';
import { css } from 'emotion';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

export interface AppInstallationParameters {}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const sdk = useSDK<ConfigAppSDK>();
  // const cma = useCMA();

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();

    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      sdk.app.setReady();
    })();
  }, [sdk]);

  const limit = 20;

  return (
    <Flex flexDirection="column" className={css({})}>
      <div>
        <div style={{ marginLeft: '1rem' }}>
          <Heading>Vtex Connector App Configuration</Heading>
          <Paragraph>Welcome to your contentful app. This is your config page.</Paragraph>
        </div>
        <hr />
        <h3>Configuration</h3>
        <h5>Storefront Access Token</h5>
        <FormControl>
          <FormControl.Label isRequired>Storefront Access Token</FormControl.Label>
          <TextInput defaultValue="Initial value" maxLength={limit} />
          <Grid columns="auto 80px">
            <FormControl.HelpText>The storefront access token for your Vtex Account</FormControl.HelpText>
            <FormControl.Counter />
          </Grid>
        </FormControl>

        <FormControl>
          <FormControl.Label isRequired>API Endpoint</FormControl.Label>
          <TextInput defaultValue="Initial value" maxLength={limit} />
          <Grid columns="auto 80px">
            <FormControl.HelpText>The Vtex API endpoint</FormControl.HelpText>
            <FormControl.Counter />
          </Grid>
        </FormControl>

        <h3>Assign to fields</h3>
        <h6>The App can be used with any content type</h6>

        <button
          className={css({
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          })}
          onClick={() => {
            // Implement your button click logic here
          }}
        >
          Save Configuration
        </button>
      </div>
    </Flex>
  );
};

export default ConfigScreen;

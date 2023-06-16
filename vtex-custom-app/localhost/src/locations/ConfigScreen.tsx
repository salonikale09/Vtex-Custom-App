import React, { useCallback, useState, useEffect } from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import { Heading, Paragraph, Flex, FormControl, TextInput, Grid } from '@contentful/f36-components';
import { css } from 'emotion';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';


export interface AppInstallationParameters {
  'X-VTEX-API-AppKey': string;
  'X-VTEX-API-AppToken': string;
  'vtexHostname': string
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    'X-VTEX-API-AppKey': '',
    'X-VTEX-API-AppToken': '',
    'vtexHostname': ''
  });
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

  const saveConfiguration = async () => {
    const apiUrl = `https://api.contentful.com/spaces/${process.env.REACT_APP_SPACE_ID}/environments/${process.env.REACT_APP_ENVIRONMENT_ID}/app_installations/64K57K80SNwbR9TvDKR1pO`;
    const authToken = process.env.REACT_APP_AUTH_TOKEN;
    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
    };


    const body = {
      parameters: {
        'X-VTEX-API-AppKey': parameters['X-VTEX-API-AppKey'],
        'X-VTEX-API-AppToken': parameters['X-VTEX-API-AppToken'],
        'vtexHostname': parameters['vtexHostname']
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        // Configuration saved successfully
      } else {
        // Handle error case
      }
    } catch (error) {
      // Handle error case
    }
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center" /* Center content vertically */
      justifyContent="center" /* Center content horizontally */
      className={css({
        minHeight: '100vh', /* Set a minimum height to fill the viewport */
        border: '1px solid #ccc', /* Add a border */
        padding: '1rem', /* Add padding */
      })}
    >
      <div>
        <div style={{ marginLeft: '1rem' }}>
          <Heading>Vtex Connector App Configuration</Heading>
          <Paragraph>Welcome to your Contentful app. This is your config page.</Paragraph>
        </div>
        <hr />
        <h3>Configuration</h3>
        <h5>Storefront Access Token</h5>
        <FormControl>
          <FormControl.Label isRequired>X-VTEX-API-AppKey</FormControl.Label>
          <TextInput
            value={parameters['X-VTEX-API-AppKey']}
            onChange={(e) =>
              setParameters((prevParams) => ({
                ...prevParams,
                'X-VTEX-API-AppKey': e.target.value,
              }))
            }
          />
          <Grid columns="auto 80px">
            <FormControl.HelpText>The storefront access token for your Vtex Account</FormControl.HelpText>
            <FormControl.Counter />
          </Grid>
        </FormControl>

        <FormControl>
          <FormControl.Label isRequired>X-VTEX-API-AppToken</FormControl.Label>
          <TextInput
            value={parameters['X-VTEX-API-AppToken']}
            onChange={(e) =>
              setParameters((prevParams) => ({
                ...prevParams,
                'X-VTEX-API-AppToken': e.target.value,
              }))
            }
          />
        </FormControl>

        <FormControl>
          <FormControl.Label isRequired>Vtex Hostname</FormControl.Label>
          <TextInput
            value={parameters['vtexHostname']}
            onChange={(e) =>
              setParameters((prevParams) => ({
                ...prevParams,
                'vtexHostname': e.target.value,
              }))
            }
          />
        </FormControl>
      </div>
    </Flex>
  );
};

export default ConfigScreen;
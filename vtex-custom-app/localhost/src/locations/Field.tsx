import React, { useState,useEffect } from 'react';
import { Button, TextInput } from '@contentful/f36-components';
import { useFieldValue, useSDK } from '@contentful/react-apps-toolkit';
import Dialog from './Dialog';
import './contentful.css';
import UpdateVtexProduct from '../locations/UpdateVtexProduct';


const Field = () => {
  const sdk = useSDK();
  const [value, setValue] = useFieldValue();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string, id: string, skuIds: string[] } | null>(null);

  interface AppInstallationParameters {
    'X-VTEX-API-AppKey': string;
    'X-VTEX-API-AppToken': string;
    'vtexHostname': string
  }

  const [parameters, setParameters] = useState<AppInstallationParameters>({
    'X-VTEX-API-AppKey': '',
    'X-VTEX-API-AppToken': '',
    'vtexHostname': ''
  });

  // Fetch Contentful app configurations details
  const fetchAppConfiguration = async () => {
    const apiUrl = `https://api.contentful.com/spaces/${process.env.REACT_APP_SPACE_ID}/environments/${process.env.REACT_APP_ENVIRONMENT_ID}/app_installations/${process.env.REACT_APP_CUSTOM_APP_ID}`;
    const authToken = process.env.REACT_APP_AUTH_TOKEN;
    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
    };

    try {
      const responseFromApp = await fetch(apiUrl, {
        method: 'GET',
        headers,
      });

      if (responseFromApp.ok) {
        const data = await responseFromApp.json();
        const appParameters = data.parameters;
        console.log(appParameters,"data from config")
        setParameters({
          'X-VTEX-API-AppKey': appParameters['X-VTEX-API-AppKey'],
          'X-VTEX-API-AppToken': appParameters['X-VTEX-API-AppToken'],
          'vtexHostname': appParameters['vtexHostname'],
        });
      } else {
        // Handle error case
        console.error('Failed to fetch app configuration');
      }
      console.log(responseFromApp,"responseFromApp");
    } catch (error) {
      // Handle error case
      console.error('Failed to fetch app configuration', error);
    }
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleProductSelect = (product: { name: string, id: string, skuIds: string[] }) => {
    setSelectedProduct(product);
    setValue(product.id);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    fetchAppConfiguration();
  },[]);

  return (
    <>
      <TextInput value={value as any} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={handleDialogOpen}>Search Product</Button>
      <div><UpdateVtexProduct parameters={parameters} /></div>
      {isDialogOpen && <Dialog parameters={parameters} onClose={handleDialogClose} onProductSelect={handleProductSelect} />}
      {selectedProduct && (
        <div className="selected-product">
          <h3>Product Information : </h3><br></br>
        <p className="product-name">Selected Product: {selectedProduct.name}</p>
        <p className="product-id">Product ID: {selectedProduct.id}</p>
        <p className="sku-ids">SKU IDs: {selectedProduct.skuIds.join(', ')}</p>
      </div>
      
      )}
    </>
  );
};

export default Field;
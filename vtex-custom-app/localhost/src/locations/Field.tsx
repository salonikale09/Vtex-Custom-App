import React, { useState } from 'react';
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

  return (
    <>
      <TextInput value={value as any} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={handleDialogOpen}>Search Product</Button>
      <div><UpdateVtexProduct/></div>
      {isDialogOpen && <Dialog onClose={handleDialogClose} onProductSelect={handleProductSelect} />}
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
import React, { useState, useEffect } from 'react';
import { EntityList, Spinner } from '@contentful/f36-components';
import { useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
import axios from 'axios';

export interface DialogProps {
  onClose: () => void;
  onProductSelect: (product: { name: string; id: string; skuIds: string[] }) => void;
}

const Dialog: React.FC<DialogProps> = ({ onClose, onProductSelect }) => {
  const sdk = useSDK();
  useAutoResizer();

  const [storeArray, setStoreArray] = useState<any[]>([]);
  const [nameArray, setNameArray] = useState<any[]>([]);
  const [skuIdsArray, setSkuIdsArray] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getVtexProductId = async () => {
    const apiKey = 'vtexappkey-skillnet-VOZXMR';
    const apiSecret = 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT';
    const baseUrl = 'https://skillnet.vtexcommercestable.com.br';
    const endpoint = '/api/catalog_system/pub/products/search?_from=1&_to=50';

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
    };

    try {
      const response = await axios.get(`${baseUrl}${endpoint}`, { headers });
      const data = response.data;

      console.log(data, "salonidata");
      const storeArray: any[] = [];
      const nameArray: any[] = [];
      const skuIdsArray: any[] = [];

      data.forEach(function (item: any) {
        storeArray.push(item.productId);
        nameArray.push(item.productName);
        const skuIds: string[] = item.items.map((item: any) => item.itemId);
        skuIdsArray.push(skuIds);
      });

      console.log(skuIdsArray, 'skuIdsArray');

      setStoreArray(storeArray);
      setNameArray(nameArray);
      setSkuIdsArray(skuIdsArray);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVtexProductId();
  }, []);

  const handleSelectProduct = (productName: string) => {
    const productIndex = nameArray.findIndex((name) => name === productName);
    const productId = storeArray[productIndex];
    const skuIds = skuIdsArray[productIndex];
    onProductSelect({ name: productName, id: productId, skuIds: skuIds });
    onClose();
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <EntityList>
      {storeArray.map((item, index) => (
        <EntityList.Item
          key={index}
          title={`ProductID: ${item}`}
          description={`ProductName: ${nameArray[index]}\nSKU IDs: ${skuIdsArray[index].join(', ')}`}
          onClick={() => handleSelectProduct(nameArray[index])}
        />
      ))}
    </EntityList>
  );
};

export default Dialog;

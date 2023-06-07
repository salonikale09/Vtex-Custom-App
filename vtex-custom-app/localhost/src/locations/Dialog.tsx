// import React, { useState, useEffect } from 'react';
// import { Paragraph } from '@contentful/f36-components';
// import { DialogAppSDK } from '@contentful/app-sdk';
// import { useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
// import axios from 'axios';

// const Dialog = () => {
//   const sdk = useSDK<DialogAppSDK>();
//   useAutoResizer();

//   // Getting products from VTEX
//   const getVtexProductId = async () => {
//     const apiKey = 'vtexappkey-skillnet-VOZXMR';
//     const apiSecret = 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT';
//     const baseUrl = 'https://skillnet.vtexcommercestable.com.br';
//     const endpoint = '/api/catalog_system/pub/products/search?_from=1&_to=50';

//     // Add authentication headers
//     const headers = {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//       Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
//     };

//     try {
//       // Make the GET request to retrieve data
//       const response = await axios.get(`${baseUrl}${endpoint}`, { headers });
//       // Process the API response
//       const data = response.data;
//       const Store:any[] = [];
//       // Handle the retrieved data as needed

//       data.forEach(function(item:any){
//         Store.push(item.productId)
//       });
//       console.log(Store, 'sallo');
//     } catch (error) {
//       // Handle errors
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     getVtexProductId();
//   }, []);

//   return(
//   <>
//    {Store.map((item) => (
//         <Paragraph>{item}</Paragraph>
//       ))}
//   </>)
// };

// export default Dialog;

import React, { useState, useEffect } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { DialogAppSDK } from '@contentful/app-sdk';
import { useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
import axios from 'axios';

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>();
  useAutoResizer();

  const [storeArray, setStoreArray] = useState<any[]>([]);
  const [nameArray, setNameArray] = useState<any[]>([]);

  // Getting products from VTEX
  const getVtexProductId = async () => {
    const apiKey = 'vtexappkey-skillnet-VOZXMR';
    const apiSecret = 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT';
    const baseUrl = 'https://skillnet.vtexcommercestable.com.br';
    const endpoint = '/api/catalog_system/pub/products/search?_from=1&_to=50';

    // Add authentication headers
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
    };

    try {
      // Make the GET request to retrieve data
      const response = await axios.get(`${baseUrl}${endpoint}`, { headers });
      // Process the API response
      const data = response.data;
      const storeArray: any[] = [];
      const nameArray: any[] = [];
      // Handle the retrieved data as needed

      data.forEach(function(item: any) {
        storeArray.push(item.productId);
        nameArray.push(item.productName);
      });
      console.log(data, 'sallo');
      setStoreArray(storeArray);
      setNameArray(nameArray);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  useEffect(() => {
    getVtexProductId();
  });

  return (
    <>
     <div>
      {storeArray.map((item, index) => (
        <div key={index}>
          <Paragraph>ProductID : {item}</Paragraph>
          <Paragraph>ProductName : {nameArray[index]}</Paragraph>
        </div>
      ))}
    </div>
    </>
  );
};

export default Dialog;

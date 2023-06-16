// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const UpdateVtexProductFromContentful: React.FC = () => {
//   const [fileArrayData, setFileArrayData] = useState<any[]>([]);
//   const [updatedSkuFromContentful, setUpdatedSkuFromContentful] = useState<{
//     skuId: string;
//     imageUrl: string;
//   }[]>([]);

  


//   // Get contentful product data with skuid and images
//   useEffect(() => {
//     const getContentById = async () => {
//       console.log('step1-Get contentful product data with skuid and images');

//       try {
//         const response = await axios.post(
//             'https://graphql.contentful.com/content/v1/spaces/cp3b8ygfr8vj/environments/master?access_token=han2JFRAHW29fPTXp-2tIonLLKQicrfxfH6rFW-f9oY',
//             {
//             query: `
//             query {
//               connectorCollection {
//                 items {
//                   productId
//                   skuIdConfirm
//                   contentSlotBannerVideoCollection(limit: 10) {
//                     items {
//                       url
//                     }
//                   }
//                   skuImageCollection(limit: 10) {
//                     items {
//                       url
//                     }
//                   }
//                 }
//               }
//             }
//             `,
//           }
//         );

//         const items = response.data.data.connectorCollection.items;
//         console.log('itemsss',items);
        
//         const updatedSkuFromContentful = items.map((item: any) => ({
//           skuId: item.skuIdConfirm,
//           // imageUrl: item.contentSlotBannerVideoCollection.items,
//           imageUrl:item.skuImageCollection.items
//         //   productId: item.productId
        
//       }));

//         const fileData: any[] = [];
//         // get all the files ID
//         await Promise.all(
//           items.map(async (product: any) => {
//             console.log('step2 -get all the files ID');
//             const response = await fetch(`https://skillnet.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/${product.skuIdConfirm}/file`, {
//               method: 'GET',
//               headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
//                 'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
//               },
//             });

//             const responseData = await response.json();

//             responseData.forEach((item: any) => {
//               fileData.push({
//                 skuId: item.SkuId,
//                 fileId: item.Id,
//               });
//             });

//             console.log('fileData', fileData);
//             setFileArrayData(fileData);
//           })
//         );

//         setUpdatedSkuFromContentful(updatedSkuFromContentful);
//       } catch (error) {
//         console.error('Error fetching blog data:', error);
//       }
//     };
    
//     getContentById();
//   }, [updatedSkuFromContentful]);
//   console.log('fileArrayData-aamir', fileArrayData);
//   console.log(updatedSkuFromContentful, 'updatedSkuFromContentful');


//   // Update VTEX product in back office from Contentful
//   const updateVtexProduct = async (
//     updatedSkuFromContentful: { skuId: string; imageUrl: string }[],
//     fileArrayData: { skuId: string; fileId: string }[]
//   ) => {

//     try {
      

//       //step-3- For Sending Image To BackOffice of Vtex
//       await Promise.all(
//         updatedSkuFromContentful.map(async (product: any,index: number) => {

//           for (let i = 0; i < product.imageUrl.length; i++) {
//             console.log(product.imageUrl.length,fileArrayData,"product.imageUrl.length")
//             if (index <= fileArrayData.length) {
//             const imgRequestBody = {
//               IsMain: false,
//               Label: product.imageUrl[i].fileName,
//               Name: product.imageUrl[i].fileName,
//               Text: product.imageUrl[i].fileName,
//               Url: product.imageUrl[i].url
//             };
//             console.log(imgRequestBody,'imgRequestBody')
//             await fetch(`https://skillnet.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/${product.skuId}/file/${fileArrayData[i].fileId}`, {
//               method: 'PUT',
//               headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
//                 'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
//               },
//               body: JSON.stringify(imgRequestBody),
//             });
//           }
//         }
//       })
//       );
//     }
//     catch (error) {
//       console.error('Error updating product on VTEX:', error);
//     }

//   };


  

//   useEffect (()=>{
//     if (fileArrayData.length > 0) {
//       updateVtexProduct(updatedSkuFromContentful, fileArrayData);
//     }
//   }, [updatedSkuFromContentful, fileArrayData])


//   return (
//     <>
//       <h6>hiii</h6>
//     </>
//   );
// };

// export default UpdateVtexProductFromContentful;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const UpdateVtexProductFromContentful: React.FC = () => {
//   const [fileArrayData, setFileArrayData] = useState<{ skuIdConfirm: string; fileId: string }[]>([]);
//   const [updatedSkuFromContentful, setUpdatedSkuFromContentful] = useState<{
//     skuId: string;
//     imageUrl: string[];
//   }[]>([]);

//   useEffect(() => {
//     const getContentById = async () => {
//       try {
//         const response = await axios.post(
//           'https://graphql.contentful.com/content/v1/spaces/cp3b8ygfr8vj/environments/master?access_token=han2JFRAHW29fPTXp-2tIonLLKQicrfxfH6rFW-f9oY',
//           {
//             query: `
//               query {
//                 connectorCollection {
//                   items {
//                     productId
//                     skuIdConfirm
//                     contentSlotBannerVideoCollection(limit: 10) {
//                       items {
//                         url
//                       }
//                     }
//                     skuImageCollection(limit: 10) {
//                       items {
//                         url
//                       }
//                     }
//                   }
//                 }
//               }
//             `,
//           }
//         );

//         const items = response.data.data.connectorCollection.items;

//         const updatedSkuFromContentful = items.map((item: any) => ({
//           skuId: item.skuIdConfirm,
//           imageUrl: item.skuImageCollection.items.map((image: any) => image.url),
//         }));
//         setUpdatedSkuFromContentful(updatedSkuFromContentful);

//         // Get all the files ID
//         const fileData: { skuIdConfirm: string; fileId: string }[] = [];
//         await Promise.all(
//           items.map(async (product: any) => {
//             const response = await fetch(`https://skillnet.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/${product.skuIdConfirm}/file`, {
//               method: 'GET',
//               headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
//                 'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
//               },
//             });

//             const responseData = await response.json();
//             responseData.forEach((item: any) => {
//               fileData.push({
//                 skuIdConfirm: item.SkuId,
//                 fileId: item.Id,
//               });
//             });
//           })
//         );

//         setFileArrayData(fileData);
//       } catch (error) {
//         console.error('Error fetching blog data:', error);
//       }
//     };

//     getContentById();
//   }, []);


//   console.log(fileArrayData,"setFileArrayData");
//   console.log(updatedSkuFromContentful,"updatedSkuFromContentful1");

//   const updateVtexProduct = async (
//     updatedSkuFromContentful: { skuId: string; imageUrl: string[] }[],
//     fileArrayData: { skuIdConfirm: string; fileId: string }[]
//   ) => {
//     try {
//       await Promise.all(
//         updatedSkuFromContentful.map(async (product: any, index: number) => {
//           for (let i = 0; i < product.imageUrl.length; i++) {
//             if (index <= fileArrayData.length) {
//               const imgRequestBody = {
//                 IsMain: false,
//                 Label: product.imageUrl[i].fileName,
//                 Name: product.imageUrl[i].fileName,
//                 Text: product.imageUrl[i].fileName,
//                 Url: product.imageUrl[i].url,
//               };

//               await fetch(`https://skillnet.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/${product.skuId}/file/${fileArrayData[i].fileId}`, {
//                 method: 'PUT',
//                 headers: {
//                   Accept: 'application/json',
//                   'Content-Type': 'application/json',
//                   'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
//                   'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
//                 },
//                 body: JSON.stringify(imgRequestBody),
//               });
//             }
//           }
//         })
//       );
//     } catch (error) {
//       console.error('Error updating product on VTEX:', error);
//     }
//   };

//   useEffect(() => {
//     if (fileArrayData.length > 0) {
//       updateVtexProduct(updatedSkuFromContentful, fileArrayData);
//     }
//   }, [updatedSkuFromContentful, fileArrayData]);

//   return (
//     <>
//       <h6>jii</h6>
//     </>
//   );
// };

// export default UpdateVtexProductFromContentful;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateVtexProductFromContentful: React.FC = () => {
  const [fileArrayData, setFileArrayData] = useState<{ skuIdConfirm: string; fileId: string }[]>([]);
  const [updatedSkuFromContentful, setUpdatedSkuFromContentful] = useState<{
    skuId: string;
    imageUrl: string[];
  }[]>([]);

  useEffect(() => {
    const getContentById = async () => {
      try {
        const response = await axios.post(
          'https://graphql.contentful.com/content/v1/spaces/cp3b8ygfr8vj/environments/master?access_token=han2JFRAHW29fPTXp-2tIonLLKQicrfxfH6rFW-f9oY',
          {
            query: `
              query {
                connectorCollection {
                  items {
                    productId
                    skuIdConfirm
                    contentSlotBannerVideoCollection(limit: 10) {
                      items {
                        url
                      }
                    }
                    skuImageCollection(limit: 10) {
                      items {
                        url
                      }
                    }
                  }
                }
              }
            `,
          }
        );

        const items = response.data.data.connectorCollection.items;

        const updatedSkuFromContentful = items.map((item: any) => ({
          skuId: item.skuIdConfirm,
          imageUrl: item.skuImageCollection.items.map((image: any) => image.url),
        }));
        setUpdatedSkuFromContentful(updatedSkuFromContentful);
        console.log(items,"itemss")
        const fileData:any = [];
        await Promise.all(
          items.map(async (product: any) => {
            console.log(product.skuIdConfirm,"${product.skuIdConfirm}")
            const response = await axios.get(`https://skillnet.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/${product.skuIdConfirm}/file`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
              },
            });

            const responseData = response.data;
            console.log(responseData,'responseData')
            responseData?.map((item:any,index:Number)=>{
              console.log("hey",item.Id)
              fileData.push({
                skuIdConfirm: item.SkuId,
                fileId: item.Id,
              });
            })
          })
        );

        setFileArrayData(fileData);
        console.log(fileData,'fileData')
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    getContentById();
  }, []);

  
  console.log(fileArrayData,"FileArrayData");
  console.log(updatedSkuFromContentful,"updatedSkuFromContentful1");

  const updateVtexProduct = async (
    updatedSkuFromContentful: { skuId: string; imageUrl: string[] }[],
    fileArrayData: { skuIdConfirm: string; fileId: string }[]
  ) => {
    try {
      await Promise.all(
        updatedSkuFromContentful.map(async (product: any, index: number) => {
          for (let i = 0; i < product.imageUrl.length; i++) {
            if (index <= fileArrayData.length) {
              const imgRequestBody = {
                IsMain: false,
                Name: product.skuId, // Use skuId as the Name
                Text: product.skuId, // Use skuId as the Text
                Url: product.imageUrl[i], // Use imageUrl directly
              };

              console.log(imgRequestBody,"imgRequestBody")

              await axios.put(`https://skillnet.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/${product.skuId}/file/${fileArrayData[i].fileId}`, imgRequestBody, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                  'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
                },
              });
            }
          }
        })
      );
    } catch (error) {
      console.error('Error updating product on VTEX:', error);
    }
  };

  useEffect(() => {
    if (fileArrayData.length > 0) {
      updateVtexProduct(updatedSkuFromContentful, fileArrayData);
    }
  }, [updatedSkuFromContentful, fileArrayData]);

  return (
    <>
      <h6>jii</h6>
    </>
  );
};

export default UpdateVtexProductFromContentful;


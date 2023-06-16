import React, { useEffect, useState } from 'react';
import axios from 'axios';

export interface UpdateProductsProps {
  parameters: {
    'X-VTEX-API-AppKey': string;
    'X-VTEX-API-AppToken': string;
    'vtexHostname': string
  };
}
const UpdateVtexProductFromContentful: React.FC<UpdateProductsProps> = ({ parameters }) => {
  const { 'X-VTEX-API-AppKey': appKey, 'X-VTEX-API-AppToken': appToken, 'vtexHostname': vtexUrl } = parameters;
  const [fileArrayData, setFileArrayData] = useState<{ skuIdConfirm: string; fileId: string }[]>([]);
  const [updatedSkuFromContentful, setUpdatedSkuFromContentful] = useState<{
    skuId: string;
    imageUrl: string[];
  }[]>([]);

  useEffect(() => {
    const getContentById = async () => {
      try {
        const response = await axios.post(
          `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}/environments/${process.env.REACT_APP_ENVIRONMENT_ID}?access_token=${process.env.REACT_APP_ACCESS_TOKEN}`,
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
            console.log(parameters,'parametersgetfile');

            const baseUrl = `https://${vtexUrl}.vtexcommercestable.com.br`;
            const endpoint = `/api/catalog/pvt/stockkeepingunit/${product.skuIdConfirm}/file`;

            const headers = {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Basic ${btoa(`${appKey}:${appToken}`)}`,
              'X-VTEX-API-AppKey': appKey,
              'X-VTEX-API-AppToken': appToken
            };

            const response = await axios.get(`${baseUrl}${endpoint}`, { headers });
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

              const baseUrl = `https://${vtexUrl}.vtexcommercestable.com.br`;
              const endpoint = `api/catalog/pvt/stockkeepingunit/${product.skuId}/file/${fileArrayData[i].fileId}`;

              const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Basic ${btoa(`${appKey}:${appToken}`)}`,
              };

              await axios.put(`${baseUrl}${endpoint}`, { headers, body: JSON.stringify(imgRequestBody) });
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


import React, { useEffect, useState } from 'react';
import axios from 'axios';

export interface UpdateProductsProps {
  parameters: {
    'X-VTEX-API-AppKey': string;
    'X-VTEX-API-AppToken': string;
    'vtexHostname': string
  };
}

const UpdateVtexProduct: React.FC<UpdateProductsProps> = ({ parameters }) => {
  const { 'X-VTEX-API-AppKey': appKey, 'X-VTEX-API-AppToken': appToken, 'vtexHostname': vtexUrl } = parameters;
  // const [allcontent, setAllcontent] = useState<any[]>([]);
  const [fileArrayData, setFileArrayData] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [updatedSkuFromContentful, setUpdatedSkuFromContentful] = useState<{
    skuId: string;
    imageUrl: string;
    brandId: string;
    categoryId: string;
    skuVideos: string;
  }[]>([]);



  console.log(parameters, 'parametersupdate');
  // console.log(fileArrayData, 'fileArrayData1');

  // Get contentful product data with skuid and images
  useEffect(() => {
    const getContentById = async () => {
      console.log('step1-Get contentful product data with skuid and images');

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
          imageUrl: item.contentSlotBannerVideoCollection.items,
          //   contentSlotImage:item.skuImageCollection.items,
          //   productId: item.productId

        }));

        const fileData: any[] = [];
        // get all the files ID
        if(appToken && appKey){
        await Promise.all(
          items.map(async (product: any) => {
            console.log('step2 -get all the files ID');
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

            responseData.forEach((item: any) => {
              fileData.push({
                skuId: item.SkuId,
                fileId: item.Id,
              });
            });

            console.log('fileData', fileData);
            setFileArrayData(fileData);
          })
        );


        // setAllcontent(items);
        setUpdatedSkuFromContentful(updatedSkuFromContentful);
        console.log(updatedSkuFromContentful, 'updatedSkuFromContentful');
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    getContentById();
  }, []);
  console.log('fileArrayData-aamir', fileArrayData);


  // Update VTEX product in back office from Contentful
  const updateVtexProduct = async (
    updatedSkuFromContentful: { skuId: string; imageUrl: string }[],
    fileArrayData: { skuId: string; fileId: string }[]
  ) => {
    // setIsLoading(true);

    try {


      //step-3- For Sending Image To BackOffice of Vtex
      await Promise.all(
        updatedSkuFromContentful.map(async (product: any, index: number) => {

          for (let i = 0; i < product.imageUrl.length; i++) {
            console.log(product.imageUrl.length, fileArrayData, "product.imageUrl.length")
            if (index <= fileArrayData.length) {
              const imgRequestBody = {
                IsMain: false,
                Label: product.imageUrl[i].fileName,
                Name: product.imageUrl[i].fileName,
                Text: product.imageUrl[i].fileName,
                Url: product.imageUrl[i].url
              };
              console.log(imgRequestBody, 'imgRequestBody')

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
    }
    catch (error) {
      console.error('Error updating product on VTEX:', error);
    }

    // setIsLoading(false);
  };




  useEffect(() => {
    if (fileArrayData.length > 0) {
      updateVtexProduct(updatedSkuFromContentful, fileArrayData);
    }
    // updateVtexProduct(updatedSkuFromContentful, fileArrayData)
  }, [updatedSkuFromContentful, fileArrayData])


  return (
    <>
      <h6>hiii</h6>
    </>
  );
};

export default UpdateVtexProduct;
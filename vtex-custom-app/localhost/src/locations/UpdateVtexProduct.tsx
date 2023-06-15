import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateVtexProduct: React.FC = () => {
  // const [allcontent, setAllcontent] = useState<any[]>([]);
  const [fileArrayData, setFileArrayData] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [updatedSkuFromContentful, setUpdatedSkuFromContentful] = useState<{
    skuId: string;
    imageUrl: string;
    brandId:string;
    categoryId:string;
    skuVideos:string;
  }[]>([]);

  

  // console.log(allcontent, 'allcontent');
  // console.log(fileArrayData, 'fileArrayData1');

  // Get contentful product data with skuid and images
  useEffect(() => {
    const getContentById = async () => {
      console.log('step1-Get contentful product data with skuid and images');

      try {
        const response = await axios.post(
            'https://graphql.contentful.com/content/v1/spaces/5otptayivfvi/environments/master?access_token=U9-gR7JYR8FuL32S0pr8KADHRNdfSWKL80cr4Hmtbts',
            {
            query: `
            query {
              bannerVtexCollection {
                items {
                  productId
                  skuIdConfirm
                  contentSlotImageVideoCollection(limit: 10) {
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

        const items = response.data.data.vtexConnectorCollection.items;
        
        const updatedSkuFromContentful = items.map((item: any) => ({
          skuId: item.skuIdConfirm,
          imageUrl: item.contentSlotImageVideoCollection.items,
        //   contentSlotImage:item.skuImageCollection.items,
        //   productId: item.productId

        }));

        const fileData: any[] = [];
        // get all the files ID
        await Promise.all(
          items.map(async (product: any) => {
            console.log('step2 -get all the files ID');
            const response = await fetch(`https://skillnet.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/${product.skuIdConfirm}/file`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
              },
            });

            const responseData = await response.json();

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
        updatedSkuFromContentful.map(async (product: any,index: number) => {
          // if(product.imageUrl.length > fileArrayData.length){

          // }
          for (let i = 0; i < product.imageUrl.length; i++) {
            console.log(product.imageUrl.length,fileArrayData,"product.imageUrl.length")
            if (index <= fileArrayData.length) {
            const imgRequestBody = {
              IsMain: false,
              Label: product.imageUrl[i].fileName,
              Name: product.imageUrl[i].fileName,
              Text: product.imageUrl[i].fileName,
              Url: product.imageUrl[i].url
            };
            console.log(imgRequestBody,'imgRequestBody')
            await fetch(`https://skillnet.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/${product.skuId}/file/${fileArrayData[i].fileId}`, {
              method: 'PUT',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VTEX-API-AppKey': 'vtexappkey-skillnet-VOZXMR',
                'X-VTEX-API-AppToken': 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT',
              },
              body: JSON.stringify(imgRequestBody),
            });
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


  

  useEffect (()=>{
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
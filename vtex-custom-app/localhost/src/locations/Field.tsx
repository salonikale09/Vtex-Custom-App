import React, { useState, useEffect } from 'react';
import { Paragraph, Radio } from '@contentful/f36-components';
import { DialogAppSDK } from '@contentful/app-sdk';
import { useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
import axios from 'axios';

const ProductDialog = () => {
  const sdk = useSDK<DialogAppSDK>();
  useAutoResizer();

  const [skuAllArray, setSkuAllArray] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  console.log(skuAllArray, 'skuAllArray');

  const productsPerPage = 10;
  const totalPages = Math.ceil(skuAllArray.length / productsPerPage);

  // Getting products from VTEX
  const getVtexProducts = async () => {
    const apiKey = 'vtexappkey-skillnet-VOZXMR';
    const apiSecret = 'RVXQMZYNRRZNTMEURBRBHPRCWYMITOEUNUPISMZTCCAGROZIUTHBZFUCZKIVIWSHJPAREKDSZSKDTFKGQZHNBKKXLIANVJLFBTJJBUWJJNDQTJVQKXLOKCMFYHWORAVT';
    const baseUrl = 'https://skillnet.vtexcommercestable.com.br/';
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
      console.log(data, 'data1');

      const skuAllArray: any[] = [];

      // Handle the retrieved data as needed
      data.forEach(function (item: any) {
        item.items.forEach((sku: any) => {
          skuAllArray.push({
            skuId: sku.itemId,
            brandId: item.brandId,
            categoryId: item.categoryId,
            productId:item.productId,
            productName:item.productName
          });
        });
      });

      setSkuAllArray(skuAllArray);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  useEffect(() => {
    getVtexProducts();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRadioChange = (skuId: string) => {
    setSelectedProduct(skuId);
    setIsDialogOpen(false); // Close the dialog when a product is selected
  };

  const filteredProducts = skuAllArray
    .filter((product) => product.skuId) // Exclude objects without skuId
    .filter((product) =>
      product.skuId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <button onClick={handleDialogOpen}>Select Product</button>
      <input value={selectedProduct}></input>

      {isDialogOpen && (
        <div>
          <div className="dialog-overlay" />
          <div className="dialog-content">
            <input
              type="text"
              placeholder="Search Products"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ marginBottom: '16px' }}
            />

            {currentProducts.map((item: any, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <Paragraph>
                <hr/>
                  <strong>SKU ID:</strong> {item.skuId}{' '}
                  <strong>Brand ID:</strong> {item.brandId}{' '}
                  <strong>Category ID:</strong> {item.categoryId}
                  <strong>Product ID:</strong> {item.productId}
                  <strong>Name :</strong> {item.productName}

                </Paragraph>
                <Radio
                  isChecked={selectedProduct === item.skuId}
                  onChange={() => handleRadioChange(item.skuId)}
                  style={{ marginLeft: '16px' }}
                >
                  Select
                </Radio>
              </div>
            ))}

            {currentProducts.length === 0 && (
              <Paragraph>No products found.</Paragraph>
            )}

            {filteredProducts.length > productsPerPage && (
              <div style={{ marginTop: '16px' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    style={{
                      margin: '0 4px',
                      fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}

            <button onClick={handleDialogClose}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDialog;

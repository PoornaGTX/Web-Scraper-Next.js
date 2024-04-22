'use client';
import { useState } from 'react';
import useStore from '@/hooks/products';
import { scrapeProdcuts } from '@/actions/scrape-products';

const SearchBar = () => {
  const [searchPromt, setSearchPromt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const products = useStore((state: any) => state.prodcuts);
  const addProduct = useStore((state: any) => state.addProduct);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const products = await scrapeProdcuts(searchPromt);
      console.log(products);
      addProduct(products);
      setSearchPromt('');
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full item-left gap-3">
      <input
        className="w-full p-3 border-4 border-neutral-200 rounded-lg text-gray-500"
        placeholder="Search for and prodcut to scrape"
        value={searchPromt}
        onChange={(e) => setSearchPromt(e.target.value)}
      />

      <div className="flex gap-2 flex-2">
        <button
          onClick={handleSubmit}
          className={`${
            searchPromt !== '' && !isLoading ? 'cursor-pointer' : ''
          } bg-gray-800 w-[150px] disabled:bg-gray-400 rounded-md px-5 py-3 text-white`}
          disabled={searchPromt === '' || isLoading}
        >
          {isLoading ? 'Scraping...' : 'Scrape'}
        </button>

        <button
          onClick={handleSubmit}
          disabled={!products?.length || isLoading}
          className={`${
            products?.length && !isLoading ? 'cursor-pointer' : ''
          } bg-gray-800 disabled:bg-gray-400 rounded-md shadow-xs px-5 py-3 text-white`}
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

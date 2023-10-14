import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import SearchIcon from '@heroicons/react/solid/SearchIcon';

const HomePage: NextPage = () => {
  const router = useRouter();

  const handleSearch = () => {
    const query = router.query.q as string;
    router.push(`/results/${query}`);
  };

  return (
    <div className="dark">
      <Head>
        <title>WorldsBest</title>
      </Head>

      <header className=" p-4">
        <h1 className="text-2xl font-bold text-white mb-4">WorldsBest</h1>
      </header>
      <main className="flex justify-center items-center">
        <div className="flex flex-row max-w-3xl p-4 space-x-2"> {/* Added padding and space-x-2 */}
          <input
            type="text"
            placeholder="Search for the best of anything"
            value={router.query.q}
            onChange={(e) => router.replace({ query: { q: e.target.value } })}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-64"
          />
          <button
            onClick={handleSearch}
            className="flex flex-col justify-center items-center p-2 border border-gray-300 rounded-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:border-blue-700"
          >
            <SearchIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

import React, { createContext, useContext } from 'react';
import useInfiniteScroll from './useInfiniteScroll';

const InfiniteScrollContext = createContext();

export const useInfiniteScrollContext = () => useContext(InfiniteScrollContext);

const InfiniteScrollProvider = ({ children, callback }) => {
  const [isFetching, setIsFetching] = useInfiniteScroll(callback);

  return (
    <InfiniteScrollContext.Provider value={{ isFetching, setIsFetching }}>
      {children}
    </InfiniteScrollContext.Provider>
  );
};

export default InfiniteScrollProvider;
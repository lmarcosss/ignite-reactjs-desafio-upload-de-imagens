import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { GetNextPageParamFunction, useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

async function getImages({ pageParam = null }): Promise<any> {
  const params = { after: pageParam };

  const { data } = await api.get('api/images', { params });

  return data;
}

function getNextPageParam(lastPage): GetNextPageParamFunction<unknown> {
  if (lastPage?.after) return lastPage.after;

  return null;
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', getImages, { getNextPageParam });

  const formattedData = useMemo(() => {
    console.log(data)
    const images = data?.pages.map(page => page.data).flat();

    return images;
  }, [data]);

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button mt="40px" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}

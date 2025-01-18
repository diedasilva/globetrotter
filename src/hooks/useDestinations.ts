import useSWR from "swr";


export function useDestinations() {
  const { data, error, mutate } = useSWR('/api/destinations', async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch destinations');
    return res.json();
  });

  return {
    destinations: data,
    isLoading: !error && !data,
    error,
    mutate,              // Fonction pour forcer le re-fetch
  };
}

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
import MovieModal from "../MovieModal/MovieModal";
import { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setMovies(data.results);
        if (data.results.length === 0) toast.error("No movies found.");
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }
    }
  }, [data, page]);

  const handleSearch = (newQuery: string) => {
    if (newQuery === query) return;
    setQuery(newQuery);
    setPage(1);
    setMovies([]);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const showLoadMore = movies.length > 0 && data && page < data.total_pages;

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage />}

      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {isLoading && <Loader />}

      {showLoadMore && (
        <LoadMoreBtn onClick={handleLoadMore} disabled={isFetching} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default App;

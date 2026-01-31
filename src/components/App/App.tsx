import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import css from "./App.module.css";

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query && data?.results.length === 0) {
      toast.error("No movies found for your request!");
    }
  }, [data, query]);

  const handleSearch = (newQuery: string) => {
    if (newQuery === query) return;
    setQuery(newQuery);
    setPage(1);
  };

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.appContainer}>
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage />}

      {isLoading ? (
        <Loader />
      ) : (
        movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        )
      )}

      {totalPages > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={totalPages > 500 ? 500 : totalPages}
          forcePage={page - 1}
          previousLabel="< previous"
          containerClassName={css.pagination}
          activeClassName={css.active}
          pageClassName={css.pageItem}
          previousClassName={css.pageItem}
          nextClassName={css.pageItem}
          disabledClassName={css.disabled}
        />
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

import axios from "axios";
import type { Movie } from "../types/movie";

interface TMDBResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    accept: "application/json",
  },
});

export const fetchMovies = async (
  query: string,
  page: number = 1,
): Promise<TMDBResponse> => {
  const response = await instance.get<TMDBResponse>("/search/movie", {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page: page,
    },
  });
  return response.data;
};

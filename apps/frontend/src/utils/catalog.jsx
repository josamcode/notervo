import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/** The API builds a RegExp from `q`; escape it so searches match literally. */
export const escapeSearchTerm = (term = "") =>
  term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let categoriesRequest = null;

/** Active notebook categories (admin-managed), cached for the session. */
export function fetchNotebookCategories() {
  if (!categoriesRequest) {
    categoriesRequest = axios
      .get(`${API}/notebook-categories`)
      .then((res) => res.data?.data || [])
      .catch((err) => {
        categoriesRequest = null;
        throw err;
      });
  }
  return categoriesRequest;
}

export const OPEN_SEARCH_EVENT = "notervo:open-search";
export const openSearch = () =>
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));

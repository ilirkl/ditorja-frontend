// components/search/types.ts
import type { Article } from "@/types/article";
import type { Dispatch, SetStateAction } from "react";

// Search header component props
export type SearchHeaderProps = {
  searchQuery: string;
};

// Search content component props
export type SearchContentProps = {
  articles: Article[];
  expandedId: string | null;
  setExpandedId: Dispatch<SetStateAction<string | null>>;
  searchQuery: string;
};

// Search loading state props
export type SearchLoadingProps = {
  searchQuery: string;
};

// Search empty state props
export type SearchEmptyProps = {
  searchQuery: string;
};

// Search results type
export type SearchResults = {
  query: string;
  articles: Article[];
};

// Search box props (for your navbar search)
export type SearchBoxProps = {
  onSearch?: (query: string) => void;
  initialQuery?: string;
};
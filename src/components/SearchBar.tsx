import React, { useState, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search for books...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (onSearch) {
        setIsLoading(true);
        onSearch(searchQuery);
        // Simulate API call delay
        setTimeout(() => setIsLoading(false), 500);
      }
    }, 300),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) {
        onSearch(query);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {isLoading ? (
          <Loader2 size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
        ) : (
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="glass-input w-full rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder-gray-400 input-glow focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>
      {query && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <span className="text-xs text-gray-400">{query.length} characters</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

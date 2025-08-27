export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
}

const SEARCH_HISTORY_KEY = 'books-app-search-history';
const MAX_HISTORY_ITEMS = 20;

export const getSearchHistory = (): SearchHistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!historyJson) {
      return [];
    }
    const history = JSON.parse(historyJson);
    // Sort by most recent first
    return history.sort((a: SearchHistoryItem, b: SearchHistoryItem) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error loading search history:', error);
    return [];
  }
};

export const addToSearchHistory = (query: string, resultsCount: number): void => {
  try {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery || trimmedQuery.length < 2) {
      return;
    }

    const history = getSearchHistory();
    
    // Remove existing entry for this query if it exists
    const filteredHistory = history.filter(item => 
      item.query.toLowerCase() !== trimmedQuery
    );

    // Add new search to the beginning
    const newSearchItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: new Date().toISOString(),
      resultsCount
    };

    const updatedHistory = [newSearchItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error adding to search history:', error);
  }
};

export const removeFromSearchHistory = (id: string): void => {
  try {
    const history = getSearchHistory();
    const filteredHistory = history.filter(item => item.id !== id);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Error removing from search history:', error);
  }
};

export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};

export const getPopularSearches = (): string[] => {
  // Return some popular book search terms as suggestions
  return [
    'science fiction',
    'mystery thriller',
    'romance novels',
    'fantasy adventure',
    'biography',
    'self help',
    'programming',
    'history',
    'psychology',
    'cooking recipes'
  ];
};
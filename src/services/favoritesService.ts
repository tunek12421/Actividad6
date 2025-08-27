import { Book, FavoriteBook } from '../types/book';

const FAVORITES_KEY = 'books-app-favorites';

export const getFavorites = (): FavoriteBook[] => {
  try {
    const favoritesJson = localStorage.getItem(FAVORITES_KEY);
    if (!favoritesJson) {
      return [];
    }
    return JSON.parse(favoritesJson);
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const addToFavorites = (book: Book): void => {
  try {
    const favorites = getFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.id === book.id);
    
    if (isAlreadyFavorite) {
      throw new Error('This book is already in your favorites');
    }
    
    const favoriteBook: FavoriteBook = {
      ...book,
      addedAt: new Date().toISOString()
    };
    
    const updatedFavorites = [...favorites, favoriteBook];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = (bookId: string): void => {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== bookId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw new Error('Failed to remove from favorites');
  }
};

export const isBookInFavorites = (bookId: string): boolean => {
  try {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === bookId);
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};
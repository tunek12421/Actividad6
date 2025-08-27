import { GoogleBooksResponse, GoogleBookItem, Book } from '../types/book';

const API_BASE_URL = 'https://www.googleapis.com/books/v1';

export const searchBooks = async (query: string, maxResults: number = 20): Promise<Book[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${API_BASE_URL}/volumes?q=${encodedQuery}&maxResults=${maxResults}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: GoogleBooksResponse = await response.json();
    
    if (!data.items) {
      return [];
    }
    
    return data.items.map(transformGoogleBookToBook);
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Failed to search books. Please try again.');
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/volumes/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: GoogleBookItem = await response.json();
    return transformGoogleBookToBook(data);
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('Failed to fetch book details. Please try again.');
  }
};

const transformGoogleBookToBook = (item: GoogleBookItem): Book => {
  const { volumeInfo } = item;
  
  // Helper function to convert HTTP image URLs to HTTPS for Capacitor compatibility
  const ensureHttpsImage = (imageUrl?: string): string | undefined => {
    if (!imageUrl) return undefined;
    return imageUrl.replace(/^http:\/\//, 'https://');
  };
  
  return {
    id: item.id,
    title: volumeInfo.title || 'Unknown Title',
    authors: volumeInfo.authors || ['Unknown Author'],
    description: volumeInfo.description,
    publishedDate: volumeInfo.publishedDate,
    pageCount: volumeInfo.pageCount,
    categories: volumeInfo.categories,
    averageRating: volumeInfo.averageRating,
    thumbnail: ensureHttpsImage(volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail),
    language: volumeInfo.language,
    publisher: volumeInfo.publisher
  };
};
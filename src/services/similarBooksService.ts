import { Book } from '../types/book';
import { searchBooks } from './booksService';

export const getSimilarBooks = async (book: Book, limit: number = 6): Promise<Book[]> => {
  try {
    const similarBooks: Book[] = [];
    const usedBookIds = new Set([book.id]);

    // Strategy 1: Search by author
    if (book.authors && book.authors.length > 0) {
      try {
        const authorBooks = await searchBooks(`inauthor:"${book.authors[0]}"`, 10);
        const filteredAuthorBooks = authorBooks
          .filter(b => !usedBookIds.has(b.id))
          .slice(0, 2);
        
        filteredAuthorBooks.forEach(b => {
          similarBooks.push(b);
          usedBookIds.add(b.id);
        });
      } catch (error) {
        console.log('Error searching by author:', error);
      }
    }

    // Strategy 2: Search by categories
    if (book.categories && book.categories.length > 0 && similarBooks.length < limit) {
      try {
        const category = book.categories[0];
        const categoryBooks = await searchBooks(`subject:"${category}"`, 10);
        const filteredCategoryBooks = categoryBooks
          .filter(b => !usedBookIds.has(b.id))
          .slice(0, Math.min(2, limit - similarBooks.length));
        
        filteredCategoryBooks.forEach(b => {
          similarBooks.push(b);
          usedBookIds.add(b.id);
        });
      } catch (error) {
        console.log('Error searching by category:', error);
      }
    }

    // Strategy 3: Search by keywords from title
    if (similarBooks.length < limit) {
      try {
        const titleWords = book.title
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(' ')
          .filter(word => word.length > 3)
          .slice(0, 2);

        if (titleWords.length > 0) {
          const keywordQuery = titleWords.join(' OR ');
          const keywordBooks = await searchBooks(keywordQuery, 10);
          const filteredKeywordBooks = keywordBooks
            .filter(b => !usedBookIds.has(b.id))
            .slice(0, Math.min(2, limit - similarBooks.length));
          
          filteredKeywordBooks.forEach(b => {
            similarBooks.push(b);
            usedBookIds.add(b.id);
          });
        }
      } catch (error) {
        console.log('Error searching by keywords:', error);
      }
    }

    // Strategy 4: Popular books in similar rating range
    if (similarBooks.length < limit && book.averageRating) {
      try {
        const ratingQueries = ['bestseller', 'popular', 'award winning'];
        const randomQuery = ratingQueries[Math.floor(Math.random() * ratingQueries.length)];
        const popularBooks = await searchBooks(randomQuery, 8);
        const filteredPopularBooks = popularBooks
          .filter(b => !usedBookIds.has(b.id))
          .filter(b => !b.averageRating || Math.abs((b.averageRating || 0) - (book.averageRating || 0)) <= 1)
          .slice(0, limit - similarBooks.length);
        
        filteredPopularBooks.forEach(b => {
          similarBooks.push(b);
          usedBookIds.add(b.id);
        });
      } catch (error) {
        console.log('Error searching popular books:', error);
      }
    }

    // Shuffle and return limited results
    return shuffleArray(similarBooks).slice(0, limit);
  } catch (error) {
    console.error('Error getting similar books:', error);
    return [];
  }
};

export const getRecommendedBooks = async (favoriteBooks: Book[], limit: number = 10): Promise<Book[]> => {
  if (favoriteBooks.length === 0) {
    // Return popular/trending books if no favorites
    try {
      const trendingQueries = ['bestseller 2024', 'popular fiction', 'award winning books'];
      const randomQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)];
      return await searchBooks(randomQuery, limit);
    } catch (error) {
      console.error('Error getting trending books:', error);
      return [];
    }
  }

  try {
    const recommendations: Book[] = [];
    const usedBookIds = new Set(favoriteBooks.map(b => b.id));

    // Analyze favorite books to find patterns
    const favoriteAuthors = new Set<string>();
    const favoriteCategories = new Set<string>();
    
    favoriteBooks.forEach(book => {
      book.authors.forEach(author => favoriteAuthors.add(author));
      book.categories?.forEach(category => favoriteCategories.add(category));
    });

    // Get recommendations based on favorite authors
    const topAuthors = Array.from(favoriteAuthors).slice(0, 3);
    for (const author of topAuthors) {
      if (recommendations.length >= limit) break;
      try {
        const authorBooks = await searchBooks(`inauthor:"${author}"`, 5);
        const filtered = authorBooks
          .filter(b => !usedBookIds.has(b.id))
          .slice(0, 2);
        
        filtered.forEach(b => {
          if (!usedBookIds.has(b.id)) {
            recommendations.push(b);
            usedBookIds.add(b.id);
          }
        });
      } catch (error) {
        console.log(`Error getting books by ${author}:`, error);
      }
    }

    // Get recommendations based on favorite categories
    const topCategories = Array.from(favoriteCategories).slice(0, 3);
    for (const category of topCategories) {
      if (recommendations.length >= limit) break;
      try {
        const categoryBooks = await searchBooks(`subject:"${category}"`, 5);
        const filtered = categoryBooks
          .filter(b => !usedBookIds.has(b.id))
          .slice(0, 2);
        
        filtered.forEach(b => {
          if (!usedBookIds.has(b.id)) {
            recommendations.push(b);
            usedBookIds.add(b.id);
          }
        });
      } catch (error) {
        console.log(`Error getting books in ${category}:`, error);
      }
    }

    return shuffleArray(recommendations).slice(0, limit);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

// Utility function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
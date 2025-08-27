import { Book } from '../types/book';

export const shareBook = async (book: Book): Promise<boolean> => {
  const shareText = `📚 Check out this book: "${book.title}" by ${book.authors.join(', ')}
  
${book.description ? book.description.substring(0, 200).replace(/<[^>]*>/g, '') + '...' : 'Great book recommendation!'}

#BooksApp #Reading #BookRecommendation`;

  const shareUrl = `https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.authors[0] + ' book')}`;

  // Check if Web Share API is supported
  if (navigator.share) {
    try {
      await navigator.share({
        title: `📚 ${book.title}`,
        text: shareText,
        url: shareUrl,
      });
      return true;
    } catch (error) {
      // User cancelled sharing or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  } else {
    // Fallback: Copy to clipboard
    try {
      const fullShareText = `${shareText}\n\nMore info: ${shareUrl}`;
      await navigator.clipboard.writeText(fullShareText);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
};

export const shareToSocialMedia = (book: Book, platform: 'twitter' | 'facebook' | 'whatsapp') => {
  const bookTitle = encodeURIComponent(`📚 "${book.title}" by ${book.authors.join(', ')}`);
  const bookDescription = encodeURIComponent(
    book.description 
      ? book.description.substring(0, 150).replace(/<[^>]*>/g, '') + '...' 
      : 'Great book recommendation!'
  );
  const hashtags = encodeURIComponent('#BooksApp #Reading #BookRecommendation');
  const shareUrl = encodeURIComponent(`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.authors[0] + ' book')}`);

  let url = '';

  switch (platform) {
    case 'twitter':
      url = `https://twitter.com/intent/tweet?text=${bookTitle}%0A%0A${bookDescription}%0A%0A${shareUrl}%0A%0A${hashtags}`;
      break;
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${bookTitle}%0A%0A${bookDescription}`;
      break;
    case 'whatsapp':
      url = `https://wa.me/?text=${bookTitle}%0A%0A${bookDescription}%0A%0AMore info: ${shareUrl}`;
      break;
  }

  if (url) {
    window.open(url, '_blank', 'width=550,height=420');
  }
};
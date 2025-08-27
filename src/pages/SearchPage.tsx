import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonSpinner,
  IonText,
  IonToast,
  IonButtons,
  IonIcon
} from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';
import { searchBooks } from '../services/booksService';
import { Book } from '../types/book';

interface SearchPageProps {
  onBookSelect: (book: Book) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBookSelect, isDark, onToggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await searchBooks(searchQuery);
      setBooks(results);
      if (results.length === 0) {
        setError('No books found. Try a different search term.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: CustomEvent) => {
    if (e.detail === 'Enter') {
      handleSearch();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search Books</IonTitle>
          {onToggleTheme && (
            <IonButtons slot="end">
              <IonButton fill="clear" onClick={onToggleTheme}>
                <IonIcon icon={isDark ? sunny : moon} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonSearchbar
                value={searchQuery}
                onIonInput={(e) => setSearchQuery(e.detail.value!)}
                onIonClear={() => setSearchQuery('')}
                onKeyPress={handleKeyPress}
                placeholder="Search for books..."
                showClearButton="focus"
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton 
                expand="block" 
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
              >
                {isLoading ? <IonSpinner name="crescent" /> : 'Search'}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {isLoading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <IonSpinner name="crescent" />
            <IonText>
              <p>Searching for books...</p>
            </IonText>
          </div>
        )}

        {hasSearched && !isLoading && books.length === 0 && !error && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <IonText color="medium">
              <p>No books found. Try a different search term.</p>
            </IonText>
          </div>
        )}

        <IonGrid>
          <IonRow>
            {books.map((book) => (
              <IonCol size="12" size-md="6" size-lg="4" key={book.id}>
                <IonCard button onClick={() => onBookSelect(book)}>
                  <IonCardHeader>
                    {book.thumbnail && (
                      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <IonImg
                          src={book.thumbnail}
                          alt={book.title}
                          style={{ maxWidth: '100px', height: 'auto' }}
                        />
                      </div>
                    )}
                    <IonCardTitle>{book.title}</IonCardTitle>
                    <IonCardSubtitle>
                      {book.authors.join(', ')}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {book.description && (
                      <IonText>
                        <p style={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {book.description.replace(/<[^>]*>/g, '')}
                        </p>
                      </IonText>
                    )}
                    {book.publishedDate && (
                      <IonText color="medium">
                        <small>Published: {book.publishedDate}</small>
                      </IonText>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          message={error || ''}
          duration={3000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default SearchPage;
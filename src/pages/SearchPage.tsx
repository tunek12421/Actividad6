import React, { useState, useEffect } from 'react';
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
  IonIcon,
  IonChip,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { moon, sunny, time, close, search as searchIcon } from 'ionicons/icons';
import { searchBooks } from '../services/booksService';
import { Book } from '../types/book';
import { getSearchHistory, addToSearchHistory, removeFromSearchHistory, getPopularSearches, SearchHistoryItem } from '../services/searchHistoryService';

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
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [popularSearches] = useState<string[]>(getPopularSearches());

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = () => {
    const history = getSearchHistory();
    setSearchHistory(history);
  };

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
      
      // Add to search history
      addToSearchHistory(searchQuery, results.length);
      loadSearchHistory();
      setShowHistory(false);
      
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

  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
    // Auto-search when clicking history item
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleRemoveHistoryItem = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeFromSearchHistory(id);
    loadSearchHistory();
  };

  const handleSearchFocus = () => {
    if (searchHistory.length > 0 || popularSearches.length > 0) {
      setShowHistory(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow clicks on history items
    setTimeout(() => {
      setShowHistory(false);
    }, 200);
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
              <div style={{ position: 'relative' }}>
                <IonSearchbar
                  value={searchQuery}
                  onIonInput={(e) => setSearchQuery(e.detail.value!)}
                  onIonClear={() => setSearchQuery('')}
                  onKeyPress={handleKeyPress}
                  onIonFocus={handleSearchFocus}
                  onIonBlur={handleSearchBlur}
                  placeholder="Search for books..."
                  showClearButton="focus"
                />

                {/* Search History and Suggestions */}
                {showHistory && (searchHistory.length > 0 || popularSearches.length > 0) && (
                  <IonCard style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: '0',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginTop: '4px'
                  }}>
                    <IonList>
                      {/* Recent Searches */}
                      {searchHistory.length > 0 && (
                        <>
                          <IonItem>
                            <IonIcon icon={time} slot="start" color="medium" />
                            <IonLabel>
                              <strong>Recent Searches</strong>
                            </IonLabel>
                          </IonItem>
                          {searchHistory.slice(0, 5).map((item) => (
                            <IonItem
                              key={item.id}
                              button
                              onClick={() => handleHistoryItemClick(item.query)}
                            >
                              <IonIcon icon={searchIcon} slot="start" color="medium" />
                              <IonLabel>
                                <h3>{item.query}</h3>
                                <p>{item.resultsCount} results • {new Date(item.timestamp).toLocaleDateString()}</p>
                              </IonLabel>
                              <IonButton
                                fill="clear"
                                size="small"
                                slot="end"
                                onClick={(e) => handleRemoveHistoryItem(item.id, e)}
                              >
                                <IonIcon icon={close} />
                              </IonButton>
                            </IonItem>
                          ))}
                        </>
                      )}
                      
                      {/* Popular Searches */}
                      {popularSearches.length > 0 && (
                        <>
                          <IonItem>
                            <IonIcon icon={searchIcon} slot="start" color="medium" />
                            <IonLabel>
                              <strong>Popular Searches</strong>
                            </IonLabel>
                          </IonItem>
                          <div style={{ padding: '8px 16px' }}>
                            {popularSearches.slice(0, 8).map((search, index) => (
                              <IonChip
                                key={index}
                                onClick={() => handleHistoryItemClick(search)}
                                style={{ margin: '4px', cursor: 'pointer' }}
                              >
                                <IonLabel>{search}</IonLabel>
                              </IonChip>
                            ))}
                          </div>
                        </>
                      )}
                    </IonList>
                  </IonCard>
                )}
              </div>
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

        {/* Search Statistics */}
        {hasSearched && !isLoading && books.length > 0 && (
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <IonText color="medium">
              <p>Found {books.length} books for "{searchQuery}"</p>
            </IonText>
          </div>
        )}

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
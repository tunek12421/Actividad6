import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon,
  IonToast,
  IonFab,
  IonFabButton,
  IonButtons
} from '@ionic/react';
import { trash, refresh, moon, sunny } from 'ionicons/icons';
import { FavoriteBook } from '../types/book';
import { getFavorites, removeFromFavorites } from '../services/favoritesService';
import BookImage from '../components/BookImage';

interface FavoritesPageProps {
  onBookSelect: (book: FavoriteBook) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onBookSelect, isDark, onToggleTheme }) => {
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadFavorites = () => {
    const favoriteBooks = getFavorites();
    // Sort by most recently added
    favoriteBooks.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    setFavorites(favoriteBooks);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemoveFromFavorites = async (bookId: string, bookTitle: string) => {
    try {
      removeFromFavorites(bookId);
      loadFavorites(); // Reload favorites after removal
      setToastMessage(`"${bookTitle}" removed from favorites`);
    } catch (error) {
      setToastMessage('Failed to remove book from favorites');
    }
  };

  const formatAddedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Favorites</IonTitle>
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
        {favorites.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '50%', 
            transform: 'translateY(-50%)' 
          }}>
            <IonText color="medium">
              <h2>No favorite books yet</h2>
              <p>Books you mark as favorites will appear here.</p>
            </IonText>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              <IonText color="medium">
                <p>{favorites.length} book{favorites.length !== 1 ? 's' : ''} in your favorites</p>
              </IonText>
            </div>
            
            <IonGrid>
              <IonRow>
                {favorites.map((book) => (
                  <IonCol size="12" size-md="6" size-lg="4" key={book.id}>
                    <IonCard>
                      <IonCardHeader>
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                          <BookImage
                            src={book.thumbnail}
                            alt={book.title}
                            style={{ maxWidth: '100px', height: 'auto' }}
                          />
                        </div>
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
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              marginBottom: '12px'
                            }}>
                              {book.description.replace(/<[^>]*>/g, '')}
                            </p>
                          </IonText>
                        )}
                        
                        <IonText color="medium">
                          <small>Added: {formatAddedDate(book.addedAt)}</small>
                        </IonText>
                        
                        <div style={{ 
                          display: 'flex', 
                          gap: '8px', 
                          marginTop: '12px' 
                        }}>
                          <IonButton
                            size="small"
                            fill="outline"
                            expand="block"
                            onClick={() => onBookSelect(book)}
                          >
                            View Details
                          </IonButton>
                          <IonButton
                            size="small"
                            fill="clear"
                            color="danger"
                            onClick={() => handleRemoveFromFavorites(book.id, book.title)}
                          >
                            <IonIcon icon={trash} />
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={loadFavorites}>
            <IonIcon icon={refresh} />
          </IonFabButton>
        </IonFab>

        <IonToast
          isOpen={!!toastMessage}
          onDidDismiss={() => setToastMessage(null)}
          message={toastMessage || ''}
          duration={2000}
          color="success"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default FavoritesPage;
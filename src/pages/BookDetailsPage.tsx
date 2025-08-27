import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonImg,
  IonText,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonToast,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { heart, heartOutline, star, moon, sunny } from 'ionicons/icons';
import { Book } from '../types/book';
import { addToFavorites, removeFromFavorites, isBookInFavorites } from '../services/favoritesService';

interface BookDetailsPageProps {
  book: Book;
  onBack: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

const BookDetailsPage: React.FC<BookDetailsPageProps> = ({ book, onBack, isDark, onToggleTheme }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  useEffect(() => {
    setIsFavorite(isBookInFavorites(book.id));
  }, [book.id]);

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        removeFromFavorites(book.id);
        setIsFavorite(false);
        setToastMessage('Removed from favorites');
        setToastColor('success');
      } else {
        addToFavorites(book);
        setIsFavorite(true);
        setToastMessage('Added to favorites');
        setToastColor('success');
      }
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'An error occurred');
      setToastColor('danger');
    }
  };

  const formatPublishedDate = (date?: string) => {
    if (!date) return 'Unknown';
    try {
      return new Date(date).getFullYear().toString();
    } catch {
      return date;
    }
  };

  const cleanDescription = (description?: string) => {
    if (!description) return '';
    return description.replace(/<[^>]*>/g, '');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#" onClick={onBack} />
          </IonButtons>
          <IonTitle>Book Details</IonTitle>
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
            <IonCol size="12" size-md="4">
              {book.thumbnail && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <IonImg
                    src={book.thumbnail}
                    alt={book.title}
                    style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px' }}
                  />
                </div>
              )}
              <IonButton
                expand="block"
                fill={isFavorite ? 'solid' : 'outline'}
                color={isFavorite ? 'danger' : 'primary'}
                onClick={handleFavoriteToggle}
              >
                <IonIcon icon={isFavorite ? heart : heartOutline} slot="start" />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </IonButton>
            </IonCol>
            
            <IonCol size="12" size-md="8">
              <IonCard>
                <IonCardContent>
                  <IonText>
                    <h1>{book.title}</h1>
                    <h3 style={{ color: 'var(--ion-color-medium)' }}>
                      {book.authors.join(', ')}
                    </h3>
                  </IonText>
                  
                  <div style={{ margin: '16px 0' }}>
                    {book.averageRating && (
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <IonIcon icon={star} color="warning" />
                        <IonText style={{ marginLeft: '8px' }}>
                          {book.averageRating} / 5
                        </IonText>
                      </div>
                    )}
                    
                    <IonGrid className="ion-no-padding">
                      <IonRow>
                        {book.publisher && (
                          <IonCol size="12" size-sm="6">
                            <IonText color="medium">
                              <strong>Publisher:</strong> {book.publisher}
                            </IonText>
                          </IonCol>
                        )}
                        <IonCol size="12" size-sm="6">
                          <IonText color="medium">
                            <strong>Published:</strong> {formatPublishedDate(book.publishedDate)}
                          </IonText>
                        </IonCol>
                        {book.pageCount && (
                          <IonCol size="12" size-sm="6">
                            <IonText color="medium">
                              <strong>Pages:</strong> {book.pageCount}
                            </IonText>
                          </IonCol>
                        )}
                        {book.language && (
                          <IonCol size="12" size-sm="6">
                            <IonText color="medium">
                              <strong>Language:</strong> {book.language.toUpperCase()}
                            </IonText>
                          </IonCol>
                        )}
                      </IonRow>
                    </IonGrid>
                  </div>
                  
                  {book.categories && book.categories.length > 0 && (
                    <div style={{ margin: '16px 0' }}>
                      <IonText color="medium">
                        <strong>Categories:</strong>
                      </IonText>
                      <div style={{ marginTop: '8px' }}>
                        {book.categories.map((category, index) => (
                          <IonChip key={index} color="primary">
                            {category}
                          </IonChip>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {book.description && (
                    <div style={{ marginTop: '24px' }}>
                      <IonText>
                        <h3>Description</h3>
                        <p style={{ lineHeight: '1.6' }}>
                          {cleanDescription(book.description)}
                        </p>
                      </IonText>
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={!!toastMessage}
          onDidDismiss={() => setToastMessage(null)}
          message={toastMessage || ''}
          duration={2000}
          color={toastColor}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default BookDetailsPage;
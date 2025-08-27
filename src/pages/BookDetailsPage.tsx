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
  IonBackButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonSpinner,
  IonActionSheet
} from '@ionic/react';
import { heart, heartOutline, star, moon, sunny, share, logoTwitter, logoFacebook, logoWhatsapp, copy } from 'ionicons/icons';
import { Book } from '../types/book';
import { addToFavorites, removeFromFavorites, isBookInFavorites } from '../services/favoritesService';
import { shareBook, shareToSocialMedia } from '../services/shareService';
import { getSimilarBooks } from '../services/similarBooksService';

interface BookDetailsPageProps {
  book: Book;
  onBack: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onBookSelect?: (book: Book) => void;
}

const BookDetailsPage: React.FC<BookDetailsPageProps> = ({ book, onBack, isDark, onToggleTheme, onBookSelect }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  useEffect(() => {
    setIsFavorite(isBookInFavorites(book.id));
    loadSimilarBooks();
  }, [book.id]);

  const loadSimilarBooks = async () => {
    setLoadingSimilar(true);
    try {
      const similar = await getSimilarBooks(book, 4);
      setSimilarBooks(similar);
    } catch (error) {
      console.error('Error loading similar books:', error);
    } finally {
      setLoadingSimilar(false);
    }
  };

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

  const handleShare = async () => {
    try {
      const success = await shareBook(book);
      if (success) {
        if (navigator.share) {
          setToastMessage('Book shared successfully!');
        } else {
          setToastMessage('Book details copied to clipboard!');
        }
        setToastColor('success');
      }
    } catch (error) {
      setToastMessage('Failed to share book');
      setToastColor('danger');
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    shareToSocialMedia(book, platform);
    setShowActionSheet(false);
    setToastMessage(`Opening ${platform} to share...`);
    setToastColor('success');
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

              <IonGrid className="ion-no-padding" style={{ marginTop: '16px' }}>
                <IonRow>
                  <IonCol size="6">
                    <IonButton
                      expand="block"
                      fill="outline"
                      onClick={handleShare}
                    >
                      <IonIcon icon={share} slot="start" />
                      Share
                    </IonButton>
                  </IonCol>
                  <IonCol size="6">
                    <IonButton
                      expand="block"
                      fill="outline"
                      onClick={() => setShowActionSheet(true)}
                    >
                      <IonIcon icon={share} slot="start" />
                      Social
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
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

          {/* Similar Books Section */}
          {similarBooks.length > 0 && (
            <IonRow style={{ marginTop: '32px' }}>
              <IonCol size="12">
                <IonText>
                  <h2>Similar Books</h2>
                </IonText>
              </IonCol>
              {similarBooks.map((similarBook) => (
                <IonCol size="12" size-md="6" size-lg="3" key={similarBook.id}>
                  <IonCard button onClick={() => onBookSelect && onBookSelect(similarBook)}>
                    <IonCardHeader>
                      {similarBook.thumbnail && (
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                          <IonImg
                            src={similarBook.thumbnail}
                            alt={similarBook.title}
                            style={{ maxWidth: '80px', height: 'auto' }}
                          />
                        </div>
                      )}
                      <IonCardTitle style={{ fontSize: '1rem' }}>{similarBook.title}</IonCardTitle>
                      <IonCardSubtitle>
                        {similarBook.authors.join(', ')}
                      </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {similarBook.averageRating && (
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <IonIcon icon={star} color="warning" size="small" />
                          <IonText style={{ marginLeft: '4px', fontSize: '0.9rem' }}>
                            {similarBook.averageRating}
                          </IonText>
                        </div>
                      )}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          )}

          {loadingSimilar && (
            <IonRow style={{ marginTop: '32px' }}>
              <IonCol size="12" style={{ textAlign: 'center' }}>
                <IonSpinner name="crescent" />
                <IonText>
                  <p>Loading similar books...</p>
                </IonText>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>

        {/* Action Sheet for Social Sharing */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: 'Share on Twitter',
              icon: logoTwitter,
              handler: () => handleSocialShare('twitter')
            },
            {
              text: 'Share on Facebook',
              icon: logoFacebook,
              handler: () => handleSocialShare('facebook')
            },
            {
              text: 'Share on WhatsApp',
              icon: logoWhatsapp,
              handler: () => handleSocialShare('whatsapp')
            },
            {
              text: 'Copy Link',
              icon: copy,
              handler: () => {
                handleShare();
                setShowActionSheet(false);
              }
            },
            {
              text: 'Cancel',
              role: 'cancel'
            }
          ]}
        />

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
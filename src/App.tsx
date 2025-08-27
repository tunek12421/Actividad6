import React, { useState, useEffect } from 'react';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonButton,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { search, heart, moon, sunny } from 'ionicons/icons';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import BookDetailsPage from './pages/BookDetailsPage';
import { Book } from './types/book';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme.css';

setupIonicReact();

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDetails, setShowBookDetails] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('books-app-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDark(useDark);
    document.body.classList.toggle('dark', useDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.body.classList.toggle('dark', newTheme);
    localStorage.setItem('books-app-theme', newTheme ? 'dark' : 'light');
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setShowBookDetails(true);
  };

  const handleBackFromDetails = () => {
    setShowBookDetails(false);
    setSelectedBook(null);
  };

  if (showBookDetails && selectedBook) {
    return (
      <IonApp>
        <BookDetailsPage 
          book={selectedBook} 
          onBack={handleBackFromDetails}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/search">
              <SearchPage 
                onBookSelect={handleBookSelect} 
                isDark={isDark} 
                onToggleTheme={toggleTheme} 
              />
            </Route>
            <Route exact path="/favorites">
              <FavoritesPage 
                onBookSelect={handleBookSelect} 
                isDark={isDark} 
                onToggleTheme={toggleTheme} 
              />
            </Route>
            <Route exact path="/">
              <Redirect to="/search" />
            </Route>
          </IonRouterOutlet>
          
          <IonTabBar slot="bottom">
            <IonTabButton tab="search" href="/search">
              <IonIcon aria-hidden="true" icon={search} />
              <IonLabel>Search</IonLabel>
            </IonTabButton>
            <IonTabButton tab="favorites" href="/favorites">
              <IonIcon aria-hidden="true" icon={heart} />
              <IonLabel>Favorites</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
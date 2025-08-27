import React, { useState } from 'react';
import { IonImg } from '@ionic/react';

interface BookImageProps {
  src?: string;
  alt: string;
  style?: React.CSSProperties;
  fallbackIcon?: string;
}

const BookImage: React.FC<BookImageProps> = ({ 
  src, 
  alt, 
  style = {}, 
  fallbackIcon = '📖' 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // If no src provided or error occurred, show fallback
  if (!src || hasError) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '24px',
          minWidth: '80px',
          minHeight: '120px',
          ...style,
        }}
      >
        <span style={{ color: '#666' }}>{fallbackIcon}</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9f9f9',
            border: '1px solid #eee',
            borderRadius: '4px',
            minWidth: '80px',
            minHeight: '120px',
            ...style,
          }}
        >
          <div style={{ color: '#999', fontSize: '12px' }}>Loading...</div>
        </div>
      )}
      <IonImg
        src={src}
        alt={alt}
        style={{
          ...style,
          display: isLoading ? 'none' : 'block',
        }}
        onIonError={handleError}
        onIonImgDidLoad={handleLoad}
      />
    </>
  );
};

export default BookImage;
import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import BusinessCardGenerator from './components/BusinessCardGenerator';
import BusinessCard from './components/BusinessCard';
import { BusinessCardData } from './types';
import Spinner from './components/common/Spinner';
import ImageEditor from './components/ImageEditor';

function App() {
  const [cardData, setCardData] = useState<BusinessCardData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!cardRef.current) {
      alert('Card element not found.');
      return;
    }
    if (!navigator.share) {
      alert('Web Share API is not supported in your browser.');
      return;
    }

    setIsSharing(true);
    try {
      // Use a slight delay to ensure all images and styles are rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await htmlToImage.toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 2 // Increase resolution for better quality
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'business-card.png', { type: blob.type });

      await navigator.share({
        title: `${cardData?.name}'s Business Card`,
        text: `Check out ${cardData?.name}'s new business card!`,
        files: [file],
      });
    } catch (error) {
      console.error('Error sharing card:', error);
      // Don't show an alert if the user cancels the share dialog
      if ((error as Error).name !== 'AbortError') {
         alert('Could not share the card. Please try again.');
      }
    } finally {
      setIsSharing(false);
    }
  };
  
  const handleDownload = async () => {
    if (!cardRef.current) {
      alert('Card element not found.');
      return;
    }

    setIsDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // For higher quality image
      });

      const link = document.createElement('a');
      const fileName = cardData?.name ? `${cardData.name.replace(/\s+/g, '-').toLowerCase()}-card.png` : 'business-card.png';
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading card:', error);
      alert('Could not download the card. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveEditedPhoto = (newImageDataUrl: string) => {
    if (cardData) {
      setCardData({ ...cardData, imageUrl: newImageDataUrl });
    }
    setIsEditingPhoto(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">AI Business Card Generator</h1>
      </header>
      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <BusinessCardGenerator setCardData={setCardData} setQrCodeUrl={setQrCodeUrl} />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Business Card</h2>
          <BusinessCard 
            ref={cardRef} 
            data={cardData} 
            qrCodeUrl={qrCodeUrl}
            onImageClick={() => cardData?.imageUrl && setIsEditingPhoto(true)} 
          />
          {cardData && (
             <div className="mt-4 w-full max-w-lg flex flex-col sm:flex-row gap-4">
              {navigator.share && (
                <button
                  onClick={handleShare}
                  disabled={isSharing || isDownloading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isSharing ? <Spinner /> : (
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                      <span>Share Card</span>
                    </div>
                  )}
                </button>
              )}
               <button
                  onClick={handleDownload}
                  disabled={isDownloading || isSharing}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-green-400 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isDownloading ? <Spinner /> : (
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      <span>Download Card</span>
                    </div>
                  )}
                </button>
            </div>
          )}
        </div>
      </main>
      {isEditingPhoto && cardData?.imageUrl && (
        <ImageEditor 
          imageUrl={cardData.imageUrl}
          onSave={handleSaveEditedPhoto}
          onClose={() => setIsEditingPhoto(false)}
        />
      )}
    </div>
  );
}

export default App;
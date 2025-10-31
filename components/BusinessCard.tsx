import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { BusinessCardData } from '../types';

interface BusinessCardProps {
  data: BusinessCardData | null;
  qrCodeUrl: string | null;
  onImageClick?: () => void;
}

const BusinessCard = React.forwardRef<HTMLDivElement, BusinessCardProps>(({ data, qrCodeUrl, onImageClick }, ref) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset image error state when a new image URL is provided
    if (data?.imageUrl) {
      setImageError(false);
    }
  }, [data?.imageUrl]);


  if (!data) {
    return (
      <div ref={ref} className="w-full max-w-lg h-[280px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 shadow-inner">
        Your generated business card will appear here.
      </div>
    );
  }

  const { name, title, company, phone, email, website, slogan, socials, imageUrl } = data;

  const FallbackIcon = () => (
    <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
    </div>
  );

  return (
    <div ref={ref} className="w-full max-w-lg bg-gradient-to-br from-slate-50 to-blue-100 rounded-xl shadow-lg hover:shadow-2xl p-6 transform transition-all hover:scale-105 flex flex-col font-sans">
      {/* Top section: Image, Logo and QR Code */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
            <div 
              className="relative w-24 h-24 rounded-full shadow-md overflow-hidden bg-gray-200 flex-shrink-0 border-4 border-white group cursor-pointer"
              onClick={onImageClick}
              title="Edit Photo"
            >
              {imageUrl && !imageError ? (
                <img 
                  src={imageUrl} 
                  alt={`${name}'s profile`} 
                  className="w-full h-full object-cover" 
                  onError={() => setImageError(true)}
                />
              ) : <FallbackIcon />}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </div>
            </div>
            <img src="https://i.imgur.com/3IfJvBe.png" alt="Company Logo" className="h-12" />
        </div>
        {qrCodeUrl && (
          <div className="p-1 bg-white rounded-lg shadow-md border border-gray-100">
             <QRCodeSVG
              value={qrCodeUrl}
              size={80}
              bgColor={"#ffffff"}
              fgColor={"#000000"} // Black
              level={"H"}
              includeMargin={false}
            />
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="flex-grow">
        <h2 className="text-3xl font-bold text-gray-900 leading-tight">{name}</h2>
        <p className="text-md text-gray-600">{title}</p>
        <p className="text-lg font-semibold text-blue-700">{company}</p>
        
        {slogan && <p className="text-sm italic text-gray-500 mt-3">"{slogan}"</p>}
      </div>

      {/* Footer section */}
      <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between items-end">
        <div className="text-xs text-gray-700 space-y-1">
            <p><strong>P:</strong> {phone}</p>
            <p><strong>E:</strong> {email}</p>
            <p><strong>W:</strong> {website}</p>
        </div>
        {socials && (socials.linkedin || socials.twitter || socials.github) && (
          <div className="flex items-center space-x-3">
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-gray-500 hover:text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer" title="Twitter/X" className="text-gray-500 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.617l-5.21-6.817-6.022 6.817h-3.308l7.732-8.835-7.732-10.668h6.78l4.464 6.223 5.385-6.223z"/></svg>
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noopener noreferrer" title="GitHub" className="text-gray-500 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default BusinessCard;
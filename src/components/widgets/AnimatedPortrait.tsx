import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

interface AnimatedPortraitProps {
  image: string | null;
  onUpload: (file: File) => void;
  glowColor?: string;
  className?: string;
}

const AnimatedPortrait: React.FC<AnimatedPortraitProps> = ({
  image,
  onUpload,
  glowColor = 'rgba(124, 58, 237, 0.15)',
  className = ''
}) => {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Optimierte Animation mit CSS-in-JS
  const portraitStyles = {
    container: `relative w-full h-full transition-transform duration-300 ease-out 
                ${className}`,
    glowEffect: `absolute inset-0 rounded-xl opacity-70 transition-opacity 
                duration-500 ease-in-out blur-xl`,
    portraitFrame: `relative w-full h-full rounded-xl bg-white border-2 
                  border-gray-200 overflow-hidden transition-transform 
                  duration-300 hover:scale-[1.02]`,
    image: `w-full h-full object-cover transition-transform duration-300
           ${isHovered ? 'scale-105' : 'scale-100'}`,
    overlay: `absolute inset-0 bg-black/50 flex items-center justify-center
             opacity-0 transition-opacity duration-300
             ${isHovered ? 'opacity-100' : ''}`,
    placeholder: `absolute inset-0 flex flex-col items-center justify-center
                bg-white transition-colors duration-300
                hover:bg-gray-50`
  };

  const handleUploadClick = () => {
    inputRef?.click();
  };

  return (
    <div 
      className={portraitStyles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Optimierter Glow-Effekt */}
      <div 
        className={portraitStyles.glowEffect}
        style={{
          backgroundColor: glowColor,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      />

      <div className={portraitStyles.portraitFrame}>
        <input
          ref={setInputRef}
          type="file"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          className="hidden"
          accept="image/*"
        />
        
        {image ? (
          <>
            <img
              src={image}
              alt="Character Portrait"
              className={portraitStyles.image}
            />
            <div 
              className={portraitStyles.overlay}
              onClick={handleUploadClick}
            >
              <Camera className="w-6 h-6 text-white cursor-pointer" />
            </div>
          </>
        ) : (
          <div
            className={portraitStyles.placeholder}
            onClick={handleUploadClick}
          >
            <Camera className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500 mt-2">Portrait</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedPortrait;
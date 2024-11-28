// src/components/character/DeathScreen.tsx
import React, { useEffect, useState } from 'react';
import { Skull, RefreshCw } from 'lucide-react';
import './DeathScreen.css';

interface DeathScreenProps {
  isVisible: boolean;
  characterName?: string;
  onRevive?: () => void;
  customMessage?: string;
}

const DeathScreen: React.FC<DeathScreenProps> = ({
  isVisible,
  characterName = "Dein Charakter",
  onRevive,
  customMessage = "Die Dunkelheit umhüllt dich..."
}) => {
  const [showReviveButton, setShowReviveButton] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Zeige den Wiederbelebungs-Button mit Verzögerung
      const timer = setTimeout(() => setShowReviveButton(true), 50000);
      return () => clearTimeout(timer);
    } else {
      setShowReviveButton(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="death-screen-overlay">
      {/* Dark Overlay with Red Pulse */}
      <div className="death-screen-background">
        {/* Red Energy Lines */}
        <div className="death-screen-energy-lines">
          <div className="energy-grid" />
        </div>
        
        {/* Red Vignette */}
        <div className="death-screen-vignette" />
      </div>

      {/* Central Death Message */}
      <div className="death-screen-content">
        <div className="death-message scale-up">
          {/* Skull Icon */}
          <div className="skull-container">
            <div className="skull-glow" />
            <Skull className="skull-icon" />
          </div>

          {/* Death Message */}
          <div className="message-container">
            <h2 className="death-title">
              {characterName} ist gefallen
            </h2>
            <p className="death-subtitle">
              {customMessage}
            </p>
          </div>

          {/* Revival Button */}
          {showReviveButton && onRevive && (
            <button
              onClick={onRevive}
              className="revive-button"
            >
              <RefreshCw className="revive-icon" />
              <span>Wiederbelebung</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DeathScreen;
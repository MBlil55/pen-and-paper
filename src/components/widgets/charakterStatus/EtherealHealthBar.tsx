import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import './HealthBar.css';

interface EtherealHealthBarProps {
  currentHealth: number;
  maxHealth: number;
  className?: string;
  showEffects?: boolean;
}

const EtherealHealthBar: React.FC<EtherealHealthBarProps> = ({
  currentHealth,
  maxHealth,
  className = '',
  showEffects = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDamage, setShowDamage] = useState(false);
  const [showHeal, setShowHeal] = useState(false);
  const [recentChange, setRecentChange] = useState<number>(0);
  const previousHealth = useRef(currentHealth);
  const percentage = (currentHealth / maxHealth) * 100;

  useEffect(() => {
    // Berechne die Differenz zwischen aktuellem und vorherigem Wert
    const healthDifference = currentHealth - previousHealth.current;

    // Wenn sich der Wert geändert hat
    if (healthDifference !== 0) {
      setIsAnimating(true);
      setRecentChange(Math.abs(healthDifference));

      if (healthDifference < 0) {
        // Schaden wurde genommen
        setShowDamage(true);
        setShowHeal(false);
      } else {
        // Heilung wurde empfangen
        setShowHeal(true);
        setShowDamage(false);
      }

      // Animation Reset Timer
      const animationTimer = setTimeout(() => {
        setShowDamage(false);
        setShowHeal(false);
        setRecentChange(0);
      }, 1000);

      const resetTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 1200);

      // Aktualisiere den vorherigen Wert
      previousHealth.current = currentHealth;

      return () => {
        clearTimeout(animationTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [currentHealth]);

  // Statusklassen bestimmen
  const getStatusClasses = () => {
    if (showDamage) return 'status-damage';
    if (showHeal) return 'status-heal';
    if (percentage > 66) return 'status-optimal';
    if (percentage > 33) return 'status-warning';
    return 'status-critical';
  };

  // Wertklassen bestimmen
  const getValueClasses = () => {
    if (showDamage) return 'value-damage';
    if (showHeal) return 'value-heal';
    if (percentage > 66) return 'value-heal';
    if (percentage > 33) return 'value-warning';
    return 'value-critical';
  };

  // Status Text bestimmen
  const getStatusText = () => {
    if (showDamage) return 'Verwundet';
    if (showHeal) return 'Geheilt';
    if (percentage > 66) return 'Gesund';
    if (percentage > 33) return 'Verletzt';
    return 'Kritisch';
  };

  return (
    <div className={`ethereal-health-bar ${className}`}>
      {/* Header Section */}
      <div className="ethereal-health-bar__header">
        <div className="ethereal-health-bar__title-group">
          <div className="ethereal-health-bar__icon-wrapper">
            <Heart 
              className={`ethereal-health-bar__icon ${isAnimating ? 'icon-pulse' : 'icon-idle'}`} 
            />
            <div className="ethereal-health-bar__icon-aura" />
          </div>
          
          <div className="ethereal-health-bar__info">
            <span className="ethereal-health-bar__title">Lebenspunkte</span>
            <div className="ethereal-health-bar__status">
              <div className={`ethereal-health-bar__status-indicator ${getStatusClasses()}`} />
              <span className="ethereal-health-bar__status-text">{getStatusText()}</span>
            </div>
          </div>
        </div>

        <div className="ethereal-health-bar__values">
          <span className={`ethereal-health-bar__current ${getValueClasses()}`}>
            {currentHealth}
          </span>
          <span className="ethereal-health-bar__max">/ {maxHealth}</span>

          {showEffects && recentChange > 0 && (
            <>
              {showDamage && (
                <span className="ethereal-health-bar__damage-indicator">
                  -{recentChange}
                </span>
              )}
              {showHeal && (
                <span className="ethereal-health-bar__heal-indicator">
                  +{recentChange}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Health Bar Section */}
      <div className="ethereal-health-bar__container">
        {/* Background Pattern */}
        <div className="ethereal-health-bar__background-pattern" />
        
        {/* Main Health Bar */}
        <div 
          className="ethereal-health-bar__progress"
          style={{ width: `${percentage}%` }}
        >
          <div className="ethereal-health-bar__progress-gradient">
            {/* Animated Patterns */}
            <div className="ethereal-health-bar__progress-pattern" />
            <div className="ethereal-health-bar__progress-overlay" />
            
            {/* Particle Effects */}
            {showEffects && percentage > 0 && (
              <div className="ethereal-health-bar__particles">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="ethereal-health-bar__particle"
                    style={{
                      left: `${(i * 20) + Math.random() * 10}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Edge Glow */}
            <div className="ethereal-health-bar__edge-glow" />
          </div>
        </div>

        {/* Effect Overlays */}
        {showEffects && (
          <>
            {showDamage && <div className="ethereal-health-bar__damage-effect" />}
            {showHeal && <div className="ethereal-health-bar__heal-effect" />}
          </>
        )}
      </div>
    </div>
  );
};

export default EtherealHealthBar;
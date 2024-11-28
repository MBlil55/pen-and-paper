import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import './ArmorBar.css';

interface EtherealArmorBarProps {
  currentArmor: number;
  maxArmor: number;
  recentDamage?: number;
  recentRecharge?: number;
  className?: string;
  showEffects?: boolean;
  onRecharge?: () => void;
}

const EtherealArmorBar: React.FC<EtherealArmorBarProps> = ({
  currentArmor,
  maxArmor,
  recentDamage,
  recentRecharge,
  className = '',
  showEffects = true,
  onRecharge
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDamage, setShowDamage] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const percentage = (currentArmor / maxArmor) * 100;

  // Effekt-Handler für Damage und Recharge Animationen
  useEffect(() => {
    if (recentDamage || recentRecharge) {
      setIsAnimating(true);
      if (recentDamage) setShowDamage(true);
      if (recentRecharge) setShowRecharge(true);

      // Animation Reset Timer
      const animationTimer = setTimeout(() => {
        setShowDamage(false);
        setShowRecharge(false);
      }, 1000);

      const resetTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 1200);

      return () => {
        clearTimeout(animationTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [recentDamage, recentRecharge]);

  // Rüstungsstatus bestimmen
  const getArmorStatus = () => {
    if (percentage > 66) return 'optimal';
    if (percentage > 33) return 'warning';
    return 'critical';
  };

  return (
    <div className={`ethereal-armor-bar ${className}`}>
      {/* Header Section */}
      <div className="ethereal-armor-bar__header">
        <div className="ethereal-armor-bar__title-group">
          <div className="ethereal-armor-bar__icon-wrapper">
            <Shield 
              className={`ethereal-armor-bar__icon ${isAnimating ? 'icon-pulse' : 'icon-idle'}`} 
            />
            <div className="ethereal-armor-bar__icon-aura" />
          </div>
          
          <div className="ethereal-armor-bar__info">
            <span className="ethereal-armor-bar__title">Rüstung</span>
            <div className="ethereal-armor-bar__status">
              <div className={`ethereal-armor-bar__status-indicator ${
                showDamage ? 'status-damage' : 
                showRecharge ? 'status-recharge' : 
                'status-' + getArmorStatus()
              }`} />
              <span className="ethereal-armor-bar__status-text">Schutz</span>
            </div>
          </div>
        </div>

        <div className="ethereal-armor-bar__values">
          <span className={`ethereal-armor-bar__current ${
            showDamage ? 'value-damage' : 
            showRecharge ? 'value-recharge' : 
            'value-' + getArmorStatus()
          }`}>
            {currentArmor}
          </span>
          <span className="ethereal-armor-bar__max">/ {maxArmor}</span>

          {showEffects && (
            <>
              {showDamage && recentDamage && (
                <span className="ethereal-armor-bar__damage-indicator">
                  -{recentDamage}
                </span>
              )}
              {showRecharge && recentRecharge && (
                <span className="ethereal-armor-bar__recharge-indicator">
                  +{recentRecharge}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Armor Bar Section */}
      <div className="ethereal-armor-bar__container">
        {/* Background Pattern */}
        <div className="ethereal-armor-bar__background-pattern" />
        
        {/* Main Armor Bar */}
        <div 
          className="ethereal-armor-bar__progress"
          style={{ width: `${percentage}%` }}
        >
          <div className="ethereal-armor-bar__progress-gradient">
            {/* Animated Patterns */}
            <div className="ethereal-armor-bar__progress-pattern" />
            <div className="ethereal-armor-bar__progress-overlay" />
            
            {/* Particle Effects */}
            {showEffects && percentage > 0 && (
              <div className="ethereal-armor-bar__particles">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="ethereal-armor-bar__particle"
                    style={{
                      left: `${(i * 20) + Math.random() * 10}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Edge Glow */}
            <div className="ethereal-armor-bar__edge-glow" />
          </div>
        </div>

        {/* Effect Overlays */}
        {showEffects && (
          <>
            {showDamage && <div className="ethereal-armor-bar__damage-effect" />}
            {showRecharge && <div className="ethereal-armor-bar__recharge-effect" />}
          </>
        )}

        {/* Recharge Button */}
        {onRecharge && currentArmor < maxArmor && (
          <button
            onClick={onRecharge}
            className="ethereal-armor-bar__recharge-button"
            title="Rüstung wiederherstellen"
          >
            <Shield className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EtherealArmorBar;
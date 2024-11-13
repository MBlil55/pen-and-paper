interface CharacterStatus {
  currentHealth: number;
  maxHealth: number;
  currentArmor: number;
  maxArmor: number;
  portrait: string | null;
  effects: string[];
}

interface CombatEvent {
  id: string;
  type: "damage" | "heal" | "block" | "recharge";
  value: number;
  timestamp: number;
}
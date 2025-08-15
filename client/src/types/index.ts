// 👤 User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'VIEWER';
  createdAt: string;
}

// 🔐 Auth Types
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'MANAGER' | 'VIEWER';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// 🏟️ Match Types
export interface Match {
  id: string;
  date: string;
  team1Name: string;
  team2Name: string;
  team1Goals: number;
  team2Goals: number;
  location?: string;
  result: string;
  matchPlayers?: MatchPlayer[];
  createdAt: string;
}

export interface MatchPlayer {
  id: string;
  team: 'TEAM1' | 'TEAM2';
  goals: number;
  assists: number;
  player: {
    id: string;
    name: string;
  };
}

export interface CreateMatchInput {
  date: string;
  team1Name: string;
  team2Name: string;
  team1Goals: number;
  team2Goals: number;
  location?: string;
}

export interface UpdateMatchInput {
  date?: string;
  team1Name?: string;
  team2Name?: string;
  team1Goals?: number;
  team2Goals?: number;
  location?: string;
}

// 📊 Statistics Types
export interface PlayerStatistics {
  user: {
    id: string;
    name: string;
  };
  totalGoals: number;
  totalAssists: number;
  totalMatches: number;
  goalsPerMatch: number;
  assistsPerMatch: number;
  effectivenessRating: number;
}

export interface RankingInput {
  category: 'goals' | 'assists' | 'matches' | 'effectiveness';
  limit?: number;
  userId?: string;
}

// 🎨 UI Types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current: boolean;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// 📱 Mobile Types
export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavItem[];
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

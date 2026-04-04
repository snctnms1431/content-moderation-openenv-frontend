import { createContext, useContext } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

export interface ModerationItem {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio';
  content: string;
  preview?: string;
  timestamp: string;
  decision?: 'allow' | 'flag' | 'remove';
  correctDecision?: 'allow' | 'flag' | 'remove';
  confidence: number;
  score: number;
  category?: string;
  explanation?: string;
  highlightedText?: string;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  moderationItems: ModerationItem[];
  stats: {
    totalProcessed: number;
    accuracy: number;
    avgScore: number;
    mistakes: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
}

export const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  moderationItems: [],
  stats: {
    totalProcessed: 0,
    accuracy: 0,
    avgScore: 0,
    mistakes: 0,
  },
  difficulty: 'medium',
};

export type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_MODERATION_ITEMS'; payload: ModerationItem[] }
  | { type: 'UPDATE_STATS'; payload: Partial<AppState['stats']> }
  | { type: 'SET_DIFFICULTY'; payload: AppState['difficulty'] }
  | { type: 'RESET_SESSION' }
  | { type: 'RECORD_DECISION'; payload: ModerationItem };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_MODERATION_ITEMS':
      return { ...state, moderationItems: action.payload };
    case 'RECORD_DECISION':
      return {
        ...state,
        stats: {
          ...state.stats,
          totalProcessed: state.stats.totalProcessed + 1,
          mistakes: action.payload.decision !== action.payload.correctDecision
            ? state.stats.mistakes + 1
            : state.stats.mistakes,
          accuracy: Math.round(
            ((state.stats.totalProcessed - (action.payload.decision !== action.payload.correctDecision
              ? state.stats.mistakes + 1
              : state.stats.mistakes)) /
              (state.stats.totalProcessed + 1)) * 100
          ),
          avgScore: Math.round(
            ((state.stats.avgScore * state.stats.totalProcessed + action.payload.score) /
              (state.stats.totalProcessed + 1))
          ),
        },
      };
    case 'UPDATE_STATS':
      return { ...state, stats: { ...state.stats, ...action.payload } };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'RESET_SESSION':
      return { ...state, moderationItems: [], stats: initialState.stats };
    default:
      return state;
  }
}

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => {} });

export const useAppState = () => useContext(AppContext);

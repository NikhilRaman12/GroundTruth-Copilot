export interface UserContext {
  state: string;
  district: string;
  mandal?: string;
  village?: string;
  intent: string;
  cropOrTask: string;
  language: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface WeatherData {
  temp: string;
  rainfall: string;
  humidity: string;
  wind: string;
  condition: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  citations?: GroundingChunk[];
  weather?: WeatherData;
  isUpdate?: boolean;
}

export enum ApplicationState {
  SETUP = 'SETUP',
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  CONSULTING = 'CONSULTING',
  EDITING = 'EDITING'
}

export type EditType = 'location' | 'language' | 'assumptions' | 'query';
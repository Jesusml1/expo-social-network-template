export const API_URL: string =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost/api";

export const PUSHER_HOST: string =
  process.env.EXPO_PUBLIC_PUSHER_HOST || "http://localhost";

export const PUSHER_KEY_APP: string =
  process.env.EXPO_PUBLIC_PUSHER_KEY_APP || "app-key";

export const PUSHER_PORT: number =
  Number(process.env.EXPO_PUBLIC_PUSHER_PORT) || 6001;

export const PUSHER_SCHEME: string = 
  process.env.EXPO_PUBLIC_PUSHER_SCHEME || "http";

export const PUSHER_APP_CLUSTER: string = 
  process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER || "mt1";

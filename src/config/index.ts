interface Config {
  api: {
    url: string;
    timeout: number;
  };
  app: {
    name: string;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
  features: {
    analytics: boolean;
    debugMode: boolean;
  };
}

const config: Config = {
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'DocUI',
    maxFileSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760,
    allowedFileTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'pdf,doc,docx,txt').split(','),
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  },
};

export default config; 
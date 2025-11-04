import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuerySettingsProvider } from '@zenstackhq/tanstack-query/react';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <QuerySettingsProvider
                value={{ endpoint: 'http://localhost:3000/api/model' }}
            >
                <App />
            </QuerySettingsProvider>
        </QueryClientProvider>
    </StrictMode>
);

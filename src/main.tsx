import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App.tsx';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { StoreProvider } from './app/providers/StoreProvider';
import { ColorModeCtxProvider } from './app/providers/ThemeProvider';
import { SocketCtxProvider } from './app/providers/WsProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StoreProvider>
        <ErrorBoundary>
            <ColorModeCtxProvider>
                <SocketCtxProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </SocketCtxProvider>
            </ColorModeCtxProvider>
        </ErrorBoundary>
    </StoreProvider>
);

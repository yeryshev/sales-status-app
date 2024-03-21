import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { StoreProvider } from './app/providers/StoreProvider';
import { ColorModeCtxProvider } from './app/providers/ThemeProvider';
import { SocketCtxProvider } from './app/providers/WsProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <StoreProvider>
            <ErrorBoundary>
                <ColorModeCtxProvider>
                    <SocketCtxProvider>
                        <App />
                    </SocketCtxProvider>
                </ColorModeCtxProvider>
            </ErrorBoundary>
        </StoreProvider>
    </BrowserRouter>,
);

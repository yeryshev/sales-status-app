import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/redux/store.ts';
import { SocketCtxProvider } from './app/providers/WsProvider/index.ts';
import { ColorModeCtxProvider } from './app/providers/ThemeProvider/index.ts';
import App from './app/App.tsx';
import { ErrorBoundary } from './app/providers/ErrorBoundary/index.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ColorModeCtxProvider>
            <ErrorBoundary>
                <SocketCtxProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </SocketCtxProvider>
            </ErrorBoundary>
        </ColorModeCtxProvider>
    </Provider>
);

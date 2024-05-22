import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { StoreProvider } from './app/providers/StoreProvider';
import { ColorModeCtxProvider } from './app/providers/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StoreProvider>
      <ErrorBoundary>
        <ColorModeCtxProvider>
          <App />
        </ColorModeCtxProvider>
      </ErrorBoundary>
    </StoreProvider>
  </BrowserRouter>,
);

import './layouts/SentryLayout';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { StoreProvider } from './providers/StoreProvider';
import { ColorModeCtxProvider } from './providers/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StoreProvider>
      <ErrorBoundary>
        <ColorModeCtxProvider>
          <BaseLayout />
        </ColorModeCtxProvider>
      </ErrorBoundary>
    </StoreProvider>
  </BrowserRouter>,
);

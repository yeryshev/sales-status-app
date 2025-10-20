import './layouts/SentryLayout';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { StoreProvider } from './providers/StoreProvider';
import { ColorModeCtxProvider } from './providers/ThemeProvider';
import { OidcProvider } from './providers/OidcProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <OidcProvider>
      <StoreProvider>
        <ErrorBoundary>
          <ColorModeCtxProvider>
            <BaseLayout />
          </ColorModeCtxProvider>
        </ErrorBoundary>
      </StoreProvider>
    </OidcProvider>
  </BrowserRouter>,
);

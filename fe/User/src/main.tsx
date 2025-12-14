import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BookingSearchProvider } from './context/booking/BookingSearchContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BookingSearchProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BookingSearchProvider>

  </StrictMode>,
)

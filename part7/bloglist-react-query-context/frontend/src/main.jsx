import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginProvider } from './context/LoginContext';
import { BlogProvider } from './context/BlogContext';
import { NotificationContextProvider } from './context/NotificationContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <LoginProvider>
      <BlogProvider>
        <NotificationContextProvider>
          <App />
        </NotificationContextProvider>
      </BlogProvider>
    </LoginProvider>
  </QueryClientProvider>
);

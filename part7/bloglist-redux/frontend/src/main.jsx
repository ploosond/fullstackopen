import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import { current } from '@reduxjs/toolkit';

store.subscribe(() => {
  console.log(store.getState());
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);

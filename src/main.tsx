import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './assets/styles/App.scss';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
// import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
    {/* <Toaster position="bottom-right" /> */}
  </Provider>
);

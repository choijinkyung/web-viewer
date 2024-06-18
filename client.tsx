import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/layouts/App';
import { store } from './src/store';
import { Provider } from 'react-redux';
import InitCornerstone from '@components/InitCornerstone';
import { createRoot } from 'react-dom/client';
import './src/lang';

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('app') as HTMLElement
// )
declare global {
  interface Window {
    getScreenDetails : any;
  }
}
InitCornerstone();
const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
const render = () => {
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
};
render();

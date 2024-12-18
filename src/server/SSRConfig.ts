import React from 'react';

import { App } from '../App';
import { Provider } from 'react-redux';
import { Request } from 'express';
import { StaticRouter } from 'react-router-dom/server';
import { renderToString } from 'react-dom/server';

export const renderApp = (req: Request, store: any): JSX.Element => (
  <StaticRouter location={req.url}>
    <Provider store={store}>
      <App />
    </Provider>
  </StaticRouter>
);

export const serverRenderer = async (req: Request): Promise<string> => {
  const html = renderToString(renderApp(req, {}));
  return html;
};

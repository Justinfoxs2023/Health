import React from 'react';

import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';
import { renderToString } from 'react-dom/server';

export class PreRenderService {
  async preRender(route: string, store: any, Component: any) {
    const html = renderToString(
      <StaticRouter location={route}>
        <Provider store={store}>
          <Component.default />
        </Provider>
      </StaticRouter>,
    );
    return html;
  }
}

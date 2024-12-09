import React from 'react';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { createStore } from '@/store';
import { App } from '../App';

export const getSSRConfig = (req: Request, store: any) => (
  <StaticRouter location={req.url}>
    <Provider store={store}>
      <App />
    </Provider>
  </StaticRouter>
);

export async function serverRenderer(req: Request, res: Response) {
  try {
    // 创建store
    const store = createStore();
    
    // 预加载数据
    await preloadData(store, req.url);

    // 渲染应用
    const html = renderToString(
      <StaticRouter location={req.url}>
        <Provider store={store}>
          <App />
        </Provider>
      </StaticRouter>
    );

    // 获取初始状态
    const preloadedState = store.getState();

    // 返回HTML
    res.send(renderFullPage(html, preloadedState));
  } catch (error) {
    console.error('服务端渲染失败:', error);
    res.status(500).send('服务器错误');
  }
}

function renderFullPage(html: string, preloadedState: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>健康管理系统</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="preload" href="/static/css/main.chunk.css" as="style">
        <link rel="preload" href="/static/js/main.chunk.js" as="script">
        ${getCriticalCSS()}
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
            /</g,
            '\\u003c'
          )}
        </script>
        <script src="/static/js/main.chunk.js"></script>
      </body>
    </html>
  `;
} 
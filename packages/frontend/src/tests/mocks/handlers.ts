import { rest } from 'msw';

export const handlers = [
  rest.get('/api/health/trends', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            date: '2024-03-01',
            bmi: 22.5,
            healthScore: 85,
            exerciseScore: 75
          }
        ]
      })
    );
  }),
  // 添加其他 API 模拟
]; 
import { ApolloConfigService } from '@nestjs/apollo';

export class CustomApolloConfigService extends ApolloConfigService {
  createGqlOptions() {
    return {
      // ... 其他配置
      formatError: (error: any) => ({
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        path: error.path
      }),
      context: ({ req, res }) => ({
        req,
        res,
        user: req.user
      })
    };
  }
} 
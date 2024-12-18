/**
 * @fileoverview TS 文件 consul.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'consul' {
  namespace Consul {
    interface ConsulOptions {
      host: string;
      port: number;
      secure: boolean;
      promisify: boolean;
    }

    interface Consul {
      agent: {
        service: {
          register: service: any  Promisevoid;
          deregister: serviceId: string  Promisevoid;
        };
        check: {
          list: () => Promise<Record<string, any>>;
        };
      };
      catalog: {
        service: {
          nodes: (serviceName: string) => Promise<any[]>;
        };
      };
    }
  }

  const Consul: {
    new (options?: Consul.ConsulOptions): Consul.Consul;
  };

  export = Consul;
}

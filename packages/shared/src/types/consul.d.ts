declare module 'consul' {
  namespace Consul {
    interface ConsulOptions {
      host: string;
      port: number;
      secure?: boolean;
      promisify?: boolean;
    }

    interface Consul {
      agent: {
        service: {
          register: (service: any) => Promise<void>;
          deregister: (serviceId: string) => Promise<void>;
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
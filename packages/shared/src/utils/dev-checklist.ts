export class DevChecklist {
  static validateService(service: any): string[] {
    const issues: string[] = [];

    // 检查必要的方法实现
    const requiredMethods = ['init', 'validate', 'execute'];
    requiredMethods.forEach(method => {
      if (!(method in service)) {
        issues.push(`Missing required method: ${method}`);
      }
    });

    // 检查错误处理
    if (!service.handleError) {
      issues.push('Missing error handling');
    }

    // 检查类型定义
    if (!service.types) {
      issues.push('Missing type definitions');
    }

    // 检查日志实现
    if (!service.logger) {
      issues.push('Missing logger implementation');
    }

    return issues;
  }

  static validateComponent(component: any): string[] {
    const issues: string[] = [];

    // 检查属性定义
    if (!component.propTypes) {
      issues.push('Missing prop types definition');
    }

    // 检查默认属性
    if (!component.defaultProps) {
      issues.push('Missing default props');
    }

    // 检查生命周期方法
    const lifecycleMethods = ['componentDidMount', 'componentWillUnmount'];
    lifecycleMethods.forEach(method => {
      if (!(method in component)) {
        issues.push(`Missing lifecycle method: ${method}`);
      }
    });

    return issues;
  }
} 
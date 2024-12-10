describe('认证功能', () => {
  beforeEach(() => {
    // 清理本地存储
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('应该能够成功注册新用户', () => {
    cy.visit('/register');

    // 填写注册表单
    cy.get('[data-testid="username-input"]')
      .type('testuser');
    cy.get('[data-testid="email-input"]')
      .type('test@example.com');
    cy.get('[data-testid="password-input"]')
      .type('Test@123456');
    cy.get('[data-testid="confirm-password-input"]')
      .type('Test@123456');

    // 提交表单
    cy.get('[data-testid="register-submit"]')
      .click();

    // 验证注册成功
    cy.url().should('include', '/login');
    cy.get('[data-testid="success-message"]')
      .should('contain', '注册成功');
  });

  it('应该能够成功登录', () => {
    cy.visit('/login');

    // 填写登录表单
    cy.get('[data-testid="username-input"]')
      .type('testuser');
    cy.get('[data-testid="password-input"]')
      .type('Test@123456');

    // 提交表单
    cy.get('[data-testid="login-submit"]')
      .click();

    // 验���登录成功
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]')
      .should('contain', 'testuser');

    // 验证本地存储中的令牌
    cy.window().then((window) => {
      expect(window.localStorage.getItem('accessToken')).to.exist;
    });
  });

  it('应该能够自动刷新令牌', () => {
    // 登录
    cy.login('testuser', 'Test@123456');

    // 等待令牌即将过期
    cy.clock().tick(14 * 60 * 1000); // 14分钟后

    // 发起需要认证的请求
    cy.request({
      url: '/api/user/profile',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });

    // 验证令牌已刷新
    cy.window().then((window) => {
      const newToken = window.localStorage.getItem('accessToken');
      expect(newToken).to.not.eq(localStorage.getItem('accessToken'));
    });
  });

  it('应该正确处理无效的登录尝试', () => {
    cy.visit('/login');

    // 使用错误的凭据
    cy.get('[data-testid="username-input"]')
      .type('wronguser');
    cy.get('[data-testid="password-input"]')
      .type('wrongpassword');

    // 提交表单
    cy.get('[data-testid="login-submit"]')
      .click();

    // 验证错误消��
    cy.get('[data-testid="error-message"]')
      .should('contain', '用户名或密码错误');

    // 验证URL未改变
    cy.url().should('include', '/login');
  });

  it('应该能够成功登出', () => {
    // 先登录
    cy.login('testuser', 'Test@123456');

    // 点击登出按钮
    cy.get('[data-testid="logout-button"]')
      .click();

    // 验证登出成功
    cy.url().should('include', '/login');
    cy.get('[data-testid="success-message"]')
      .should('contain', '已成功登出');

    // 验证本地存储已清理
    cy.window().then((window) => {
      expect(window.localStorage.getItem('accessToken')).to.be.null;
      expect(window.localStorage.getItem('refreshToken')).to.be.null;
    });

    // 尝试访问需要认证的页面
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  it('应该正确处理CSRF攻击', () => {
    // 登录
    cy.login('testuser', 'Test@123456');

    // 模拟CSRF攻击
    cy.request({
      url: '/api/user/profile',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'X-CSRF-Token': 'invalid-token',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.body).to.have.property('error', 'CSRF令牌无效');
    });
  });

  it('应该正确处理并发请求的令牌刷新', () => {
    // 登录
    cy.login('testuser', 'Test@123456');

    // 等待令牌即将过期
    cy.clock().tick(14 * 60 * 1000);

    // 模拟多个并发请求
    const requests = Array(5).fill(null).map(() =>
      cy.request({
        url: '/api/user/profile',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
    );

    // 验证所有请求都成功
    Promise.all(requests).then((responses) => {
      responses.forEach((response) => {
        expect(response.status).to.eq(200);
      });
    });

    // 验证只刷新了一次令牌
    cy.window().then((window) => {
      const newToken = window.localStorage.getItem('accessToken');
      expect(newToken).to.not.eq(localStorage.getItem('accessToken'));
    });
  });
}); 
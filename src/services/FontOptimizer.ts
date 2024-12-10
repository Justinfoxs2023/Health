export class FontOptimizer {
  // 字体配置
  private static fontConfig = {
    primary: {
      family: 'PingFang SC',
      weights: [400, 500, 600],
      display: 'swap',
      preload: true
    },
    secondary: {
      family: 'Microsoft YaHei',
      weights: [400],
      display: 'swap',
      preload: false
    }
  };

  // 初始化字体优化
  static init() {
    this.loadFonts();
    this.setupFontObserver();
    this.optimizeFontLoading();
  }

  // 字体加载
  private static loadFonts() {
    // 预加载关键字体
    Object.entries(this.fontConfig).forEach(([key, config]) => {
      if (config.preload) {
        config.weights.forEach(weight => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'font';
          link.type = 'font/woff2';
          link.href = `/fonts/${config.family}-${weight}.woff2`;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        });
      }
    });
  }

  // 字体观察器
  private static setupFontObserver() {
    if ('FontFace' in window) {
      Object.entries(this.fontConfig).forEach(([key, config]) => {
        config.weights.forEach(weight => {
          const font = new FontFace(
            config.family,
            `url(/fonts/${config.family}-${weight}.woff2) format('woff2')`,
            { weight: String(weight), display: config.display }
          );

          font.load().then(() => {
            document.fonts.add(font);
          }).catch(error => {
            console.error(`字体加载失败: ${config.family}-${weight}`, error);
          });
        });
      });
    }
  }

  // 优化字体加载
  private static optimizeFontLoading() {
    // 使用字体显示策略
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'PingFang SC';
        font-display: swap;
        src: local('PingFang SC'),
             url('/fonts/PingFangSC-Regular.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);

    // 添加字体加载类
    document.documentElement.classList.add('fonts-loading');
    document.fonts.ready.then(() => {
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-loaded');
    });
  }
} 
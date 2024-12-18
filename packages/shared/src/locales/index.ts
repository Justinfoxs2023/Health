import enUS from './en-US';
import zhCN from './zh-CN';
import { i18n } from '../services/i18n';

// 加载语言包
i18n.loadMessages('zh-CN', zhCN);
i18n.loadMessages('en-US', enUS);

export { zhCN, enUS };

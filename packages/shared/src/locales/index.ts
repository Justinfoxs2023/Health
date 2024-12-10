import { i18n } from '../services/i18n';
import zhCN from './zh-CN';
import enUS from './en-US';

// 加载语言包
i18n.loadMessages('zh-CN', zhCN);
i18n.loadMessages('en-US', enUS);

export { zhCN, enUS }; 
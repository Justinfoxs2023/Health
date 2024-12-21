import React, { useState, useCallback } from 'react';

import type { ExportFormatType, IBackupMetadata } from '../../services/export';
import { Button } from '../Button';
import { Loading } from '../Loading';
import { Message } from '../Message';
import { Modal } from '../Modal';
import { exportService } from '../../services/export';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

/** 数据导出组件属性 */
export interface IDataExportProps {
  /** 要导出的数据 */
  data: any[];
  /** 导出按钮文本 */
  buttonText?: string;
  /** 导出按钮类型 */
  buttonType?: 'primary' | 'default' | 'text';
  /** 导出成功回调 */
  onExportSuccess?: () => void;
  /** 导出失败回调 */
  onExportError?: (error: Error) => void;
}

/** 数据导出组件 */
export const DataExport: React.FC<IDataExportProps> = ({
  data,
  buttonText = '导出数据',
  buttonType = 'default',
  onExportSuccess,
  onExportError,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormatType>('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [backupList, setBackupList] = useState<IBackupMetadata[]>([]);
  const [selectedBackupId, setSelectedBackupId] = useState<string>('');

  // 加载备份列表
  const loadBackupList = console.error(
    'Error in index.tsx:',
    async () => {
      try {
        const list = await exportService.getBackupList();
        setBackupList(list);
      } catch (error) {
        Message.error(t('加载备份列表失败'));
        console.error('Error in index.tsx:', '加载备份列表失败:', error);
      }
    },
    [t],
  );

  // 处理导出
  const handleExport = async () => {
    setIsLoading(true);
    try {
      const blob = await exportService.exportData(data, {
        format: exportFormat,
        includeMetadata,
        encrypt: isEncrypted,
        encryptionKey: isEncrypted ? encryptionKey : undefined,
      });

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-data-${new Date().toISOString()}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Message.success(t('数据导出成功'));
      onExportSuccess?.();
    } catch (error) {
      Message.error(t('数据导出失败'));
      onExportError?.(error as Error);
      console.error('Error in index.tsx:', '数据导出失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 创建备份
  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      const metadata = await exportService.createBackup(data, {
        encrypt: isEncrypted,
        encryptionKey: isEncrypted ? encryptionKey : undefined,
        description: `手动备份 - ${new Date().toLocaleString()}`,
      });
      Message.success(t('创建备份成功'));
      loadBackupList();
    } catch (error) {
      Message.error(t('创建备份失败'));
      console.error('Error in index.tsx:', '创建备份失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 恢复备份
  const handleRestoreBackup = async () => {
    if (!selectedBackupId) {
      Message.warning(t('请选择要恢复的备份'));
      return;
    }

    setIsLoading(true);
    try {
      const restoredData = await exportService.restoreBackup(
        selectedBackupId,
        isEncrypted ? encryptionKey : undefined,
      );
      Message.success(t('恢复备份成功'));
      // TODO: 处理恢复的数据
    } catch (error) {
      Message.error(t('恢复备份失败'));
      console.error('Error in index.tsx:', '恢复备份失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除备份
  const handleDeleteBackup = async () => {
    if (!selectedBackupId) {
      Message.warning(t('请选择要删除的备份'));
      return;
    }

    setIsLoading(true);
    try {
      await exportService.deleteBackup(selectedBackupId);
      Message.success(t('删除备份成功'));
      loadBackupList();
      setSelectedBackupId('');
    } catch (error) {
      Message.error(t('删除备份失败'));
      console.error('Error in index.tsx:', '删除备份失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button type={buttonType} onClick={() => setIsModalVisible(true)}>
        {buttonText}
      </Button>

      <Modal
        title={t('数据导出与备份')}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        width={600}
      >
        <div className="data-export-modal" style={styles.container}>
          {isLoading && <Loading />}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>{t('导出选项')}</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('导出格式')}</label>
              <select
                value={exportFormat}
                onChange={e => setExportFormat(e.target.value as ExportFormatType)}
                style={styles.select}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={e => setIncludeMetadata(e.target.checked)}
                />
                {t('包含元数据')}
              </label>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={isEncrypted}
                  onChange={e => setIsEncrypted(e.target.checked)}
                />
                {t('加密数据')}
              </label>
            </div>

            {isEncrypted && (
              <div style={styles.formGroup}>
                <label style={styles.label}>{t('加密密钥')}</label>
                <input
                  type="password"
                  value={encryptionKey}
                  onChange={e => setEncryptionKey(e.target.value)}
                  style={styles.input}
                  placeholder={t('请输入加密密钥')}
                />
              </div>
            )}

            <Button type="primary" onClick={handleExport} style={styles.button}>
              {t('导出')}
            </Button>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>{t('备份管理')}</h3>
            <div style={styles.backupList}>
              <select
                value={selectedBackupId}
                onChange={e => setSelectedBackupId(e.target.value)}
                style={styles.select}
              >
                <option value="">{t('请选择备份')}</option>
                {backupList.map(backup => (
                  <option key={backup.id} value={backup.id}>
                    {`${new Date(backup.createdAt).toLocaleString()} - ${
                      backup.description || t('无描述')
                    }`}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.buttonGroup}>
              <Button onClick={handleCreateBackup} style={styles.button}>
                {t('创建备份')}
              </Button>
              <Button onClick={handleRestoreBackup} style={styles.button}>
                {t('恢复备份')}
              </Button>
              <Button onClick={handleDeleteBackup} style={styles.button}>
                {t('删除备份')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  select: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  button: {
    minWidth: '80px',
  },
  backupList: {
    marginBottom: '10px',
  },
};

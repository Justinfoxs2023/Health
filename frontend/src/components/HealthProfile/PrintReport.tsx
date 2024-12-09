import React from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';

interface PrintReportProps {
  reportRef: React.RefObject<HTMLDivElement>;
}

export const PrintReport: React.FC<PrintReportProps> = ({ reportRef }) => {
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `健康报告_${new Date().toLocaleDateString()}`,
    onBeforeGetContent: () => {
      // 打印前的准备工作
    },
    onAfterPrint: () => {
      // 打印后的清理工作
    }
  });

  return (
    <Button 
      icon={<PrinterOutlined />} 
      onClick={handlePrint}
    >
      打印报告
    </Button>
  );
}; 
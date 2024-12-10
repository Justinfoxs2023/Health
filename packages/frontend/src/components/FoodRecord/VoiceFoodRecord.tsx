import React, { useState } from 'react';
import { Button, Card, List, Input, Modal, message } from 'antd';
import { AudioOutlined, EditOutlined } from '@ant-design/icons';
import { VoiceRecognitionService } from '../../services/voice-recognition.service';
import { FoodNutritionAnalysisService } from '../../services/food-nutrition-analysis.service';

export const VoiceFoodRecord: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const voiceService = new VoiceRecognitionService();
  const nutritionService = new FoodNutritionAnalysisService();

  const handleStartRecording = async () => {
    try {
      setRecording(true);
      const result = await voiceService.startRecording();
      
      if (result.foodItems) {
        setFoodItems(result.foodItems);
      }
    } catch (error) {
      message.error('语音识别失败，请重试');
    } finally {
      setRecording(false);
    }
  };

  const handleStopRecording = () => {
    voiceService.stopRecording();
    setRecording(false);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSaveEdit = async (values: any) => {
    const updatedItems = foodItems.map(item =>
      item === editingItem ? { ...item, ...values } : item
    );
    setFoodItems(updatedItems);
    setModalVisible(false);

    // 分析营养成分
    try {
      const nutritionInfo = await nutritionService.analyzeFoodNutrition(updatedItems);
      // 更新UI显示营养信息
    } catch (error) {
      message.error('营养分析失败');
    }
  };

  return (
    <Card title="语音记录食物">
      <Button
        type="primary"
        icon={<AudioOutlined />}
        onClick={recording ? handleStopRecording : handleStartRecording}
        loading={recording}
      >
        {recording ? '停止录音' : '开始录音'}
      </Button>

      <List
        dataSource={foodItems}
        renderItem={item => (
          <List.Item
            actions={[
              <Button 
                icon={<EditOutlined />}
                onClick={() => handleEditItem(item)}
              >
                编辑
              </Button>
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={`${item.quantity || ''} ${item.unit || ''}`}
            />
          </List.Item>
        )}
      />

      <Modal
        title="编辑食物信息"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSaveEdit}
      >
        {editingItem && (
          <div>
            <Input
              placeholder="食物名称"
              defaultValue={editingItem.name}
              onChange={e => editingItem.name = e.target.value}
            />
            <Input
              placeholder="数量"
              defaultValue={editingItem.quantity}
              onChange={e => editingItem.quantity = e.target.value}
            />
            <Input
              placeholder="单位"
              defaultValue={editingItem.unit}
              onChange={e => editingItem.unit = e.target.value}
            />
          </div>
        )}
      </Modal>
    </Card>
  );
}; 
import React, { useState } from 'react';
import { 
  TeamChat,
  TaskBoard,
  SharedCalendar,
  ActivityStream 
} from './components';
import { useTeamCollaboration } from '../../../hooks/useTeamCollaboration';

export const TeamCollaboration: React.FC<{
  teamId: string;
  config: CollaborationConfig;
}> = ({ teamId, config }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const { data, sendMessage, createTask, updateTask } = useTeamCollaboration(teamId);

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <TeamChat 
            messages={data.messages}
            onSend={sendMessage}
            config={config.chat}
          />
        );
      case 'tasks':
        return (
          <TaskBoard 
            tasks={data.tasks}
            onCreate={createTask}
            onUpdate={updateTask}
            config={config.tasks}
          />
        );
      case 'calendar':
        return (
          <SharedCalendar 
            events={data.events}
            config={config.calendar}
          />
        );
      case 'activity':
        return (
          <ActivityStream 
            activities={data.activities}
            config={config.activity}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="team-collaboration">
      <div className="tabs">
        {config.enabledFeatures.map(feature => (
          <button
            key={feature}
            className={`tab ${activeTab === feature ? 'active' : ''}`}
            onClick={() => setActiveTab(feature)}
          >
            {feature}
          </button>
        ))}
      </div>

      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
}; 
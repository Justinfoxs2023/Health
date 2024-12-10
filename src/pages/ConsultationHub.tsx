export const ConsultationHub: React.FC = () => {
  return (
    <div className="consultation-hub">
      <div className="consultation-header">
        <h1>在线咨询</h1>
        <ConsultationFilter 
          filters={availableFilters}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="consultation-content">
        <div className="doctor-list">
          <DoctorGrid 
            doctors={availableDoctors}
            onDoctorSelect={handleDoctorSelect}
          />
        </div>

        <div className="consultation-room">
          <VideoChat 
            sessionId={currentSession}
            onSessionEnd={handleSessionEnd}
          />
          <ChatInterface 
            messages={chatHistory}
            onSendMessage={handleSendMessage}
          />
        </div>

        <div className="health-records">
          <RecordViewer 
            records={patientRecords}
            onRecordUpdate={handleRecordUpdate}
          />
        </div>
      </div>
    </div>
  );
}; 
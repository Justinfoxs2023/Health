import { useState } from 'react';
import styled from 'styled-components';
import { SymptomAnalysis } from './components/SymptomAnalysis';
import { DiagnosisSuggestion } from './components/DiagnosisSuggestion';
import { DoctorMatching } from './components/DoctorMatching';
import { VideoConsultation } from './components/VideoConsultation';
import { FollowUpManager } from './components/FollowUpManager';

const ConsultationContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const MainSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const SideSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const SmartConsultation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'analysis' | 'diagnosis' | 'consultation'>('analysis');
  const [consultationData, setConsultationData] = useState({});

  const handleSymptomAnalysis = (symptoms: any) => {
    // 处理症状分析
    dispatch(analyzeSymptoms(symptoms));
    setCurrentStep('diagnosis');
  };

  const handleDiagnosis = (diagnosis: any) => {
    // 处理诊断建议
    dispatch(generateTreatmentPlan(diagnosis));
    setCurrentStep('consultation');
  };

  return (
    <ConsultationContainer>
      <MainSection>
        {currentStep === 'analysis' && (
          <SymptomAnalysis 
            onAnalysisComplete={handleSymptomAnalysis}
          />
        )}
        
        {currentStep === 'diagnosis' && (
          <DiagnosisSuggestion 
            symptoms={consultationData.symptoms}
            onDiagnosisComplete={handleDiagnosis}
          />
        )}
        
        {currentStep === 'consultation' && (
          <VideoConsultation 
            doctorId={consultationData.matchedDoctor.id}
            diagnosis={consultationData.diagnosis}
          />
        )}
      </MainSection>

      <SideSection>
        <DoctorMatching 
          specialties={consultationData.requiredSpecialties}
          availability={true}
        />
        
        <FollowUpManager 
          consultationHistory={consultationData.history}
          upcomingFollowUps={consultationData.followUps}
        />
      </SideSection>
    </ConsultationContainer>
  );
}; 
import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Icon, Text } from '../common';
import { useVoiceRecognition } from '../../hooks/voice';
import { VoiceWaveform } from './VoiceWaveform';
import { ResponseCard } from './ResponseCard';

export const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState(null);
  const { startRecording, stopRecording, processing } = useVoiceRecognition();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulseAnimation = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start(() => {
      if (isListening) {
        startPulseAnimation();
      }
    });
  };

  const handlePress = async () => {
    if (!isListening) {
      setIsListening(true);
      startPulseAnimation();
      const audioData = await startRecording();
      const result = await processVoiceCommand(audioData);
      setResponse(result);
    } else {
      setIsListening(false);
      stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={handlePress}
      >
        <Animated.View style={[
          styles.buttonInner,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <Icon 
            name={isListening ? 'mic' : 'mic-none'} 
            size={32} 
            color="#fff" 
          />
        </Animated.View>
      </TouchableOpacity>

      {isListening && (
        <VoiceWaveform />
      )}

      {response && (
        <ResponseCard
          type={response.type}
          text={response.text}
          data={response.data}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center'
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  buttonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center'
  }
}); 
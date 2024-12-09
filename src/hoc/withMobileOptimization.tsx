import React from 'react';
import { useGestureInteractions } from '@/hooks/useGestureInteractions';
import { OfflineManager } from '@/services/OfflineManager';
import { DeviceIntegrationManager } from '@/services/DeviceIntegrationManager';

interface MobileOptimizationProps {
  enableGestures?: boolean;
  enableOffline?: boolean;
  enableDeviceIntegration?: boolean;
}

export const withMobileOptimization = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: MobileOptimizationProps
) => {
  return function WithMobileOptimization(props: P) {
    const offlineManager = new OfflineManager();
    const deviceManager = new DeviceIntegrationManager();

    const gestureHandlers = useGestureInteractions({
      enableSwipe: options.enableGestures,
      enablePinch: options.enableGestures,
      enablePull: options.enableGestures,
      onSwipe: handleSwipe,
      onPinch: handlePinch,
      onPull: handlePull
    });

    useEffect(() => {
      if (options.enableOffline) {
        offlineManager.initDatabase();
      }
      if (options.enableDeviceIntegration) {
        deviceManager.setupDevices();
        deviceManager.setupNotifications();
      }
    }, []);

    return (
      <div {...gestureHandlers}>
        <WrappedComponent {...props} />
      </div>
    );
  };
}; 
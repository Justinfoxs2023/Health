import React from 'react';

import { DeviceIntegrationManager } from '@/services/DeviceIntegrationManager';
import { OfflineManager } from '@/services/OfflineManager';
import { useGestureInteractions } from '@/hooks/useGestureInteractions';

interface IMobileOptimizationProps {
  /** enableGestures 的描述 */
  enableGestures: false | true;
  /** enableOffline 的描述 */
  enableOffline: false | true;
  /** enableDeviceIntegration 的描述 */
  enableDeviceIntegration: false | true;
}

export const withMobileOptimization = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: IMobileOptimizationProps,
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
      onPull: handlePull,
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

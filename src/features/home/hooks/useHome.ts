import { useCallback, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  fetchHomeData,
  refreshHomeData,
  approveVisitorThunk,
  rejectVisitorThunk,
} from '../store/homeSlice';
import { homeService } from '../services/homeService';

export const useHome = () => {
  const dispatch = useAppDispatch();
  const { data, loading, refreshing, error, processingVisitors } = useAppSelector(
    (state) => state.home,
  );

  const load = useCallback(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(refreshHomeData());
  }, [dispatch]);

  const handleApprove = useCallback(
    (visitorId: string) => {
      dispatch(approveVisitorThunk(visitorId));
    },
    [dispatch],
  );

  const handleReject = useCallback(
    (visitorId: string) => {
      Alert.alert(
        'Reject Visitor',
        'Enter a reason for rejection',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: () => {
              dispatch(rejectVisitorThunk({ visitorId, reason: 'Not expected' }));
            },
          },
        ],
      );
    },
    [dispatch],
  );

  const handleCallGuard = useCallback(async () => {
    try {
      const response = await homeService.getGuardContact();
      if (response.success && response.data?.phoneNumber) {
        const url = `tel:${response.data.phoneNumber}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open dialer on this device.');
        }
      }
    } catch {
      Alert.alert('Error', 'Could not fetch guard contact.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    refreshing,
    error,
    processingVisitors,
    refresh,
    handleApprove,
    handleReject,
    handleCallGuard,
  };
};

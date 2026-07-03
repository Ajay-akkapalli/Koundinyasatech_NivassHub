import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { saveProfile, loadProfile } from '@/utils/storage';
import type { Profile } from '../types';

const DEFAULT_PROFILE: Profile = {
  name: 'Resident Name',
  flat: 'A-101',
  block: 'A',
  phone: '9876543210',
  email: 'resident@email.com',
  members: '4',
  vehicleNo: 'KA-01-AB-1234',
};

interface UseProfileReturn {
  profile: Profile;
  draft: Profile;
  editing: boolean;
  saving: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  saveEdit: () => Promise<void>;
  handleDraftChange: (key: keyof Profile, val: string) => void;
}

/**
 * Encapsulates all profile read/write logic.
 * Ready for backend API integration — replace loadProfile/saveProfile
 * calls with API calls from a profileApi module without changing the screen.
 */
export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [draft, setDraft] = useState<Profile>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile<Profile>().then((saved) => {
      if (saved) {
        setProfile(saved);
        setDraft(saved);
      }
    });
  }, []);

  const startEdit = useCallback(() => {
    setDraft({ ...profile });
    setEditing(true);
  }, [profile]);

  const cancelEdit = useCallback(() => {
    setDraft({ ...profile });
    setEditing(false);
  }, [profile]);

  const saveEdit = useCallback(async () => {
    setSaving(true);
    try {
      await saveProfile(draft);
      setProfile({ ...draft });
      setEditing(false);
      Alert.alert('Saved', 'Profile updated successfully.');
    } catch {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const handleDraftChange = useCallback((key: keyof Profile, val: string) => {
    setDraft((d) => ({ ...d, [key]: val }));
  }, []);

  return { profile, draft, editing, saving, startEdit, cancelEdit, saveEdit, handleDraftChange };
}

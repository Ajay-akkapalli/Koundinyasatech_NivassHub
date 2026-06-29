import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout';
import { Header } from '@/components/common';
import { saveProfile, loadProfile } from '@/utils/storage';
import { APP_CONFIG } from '@/config/appConfig';
import colors from '@/theme/colors';
import { getInitials } from '@/utils/formatters';
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

interface FieldProps {
  label: string;
  fieldKey: keyof Profile;
  icon: string;
  profile: Profile;
  draft: Profile;
  editing: boolean;
  onDraftChange: (key: keyof Profile, val: string) => void;
}

const Field: React.FC<FieldProps> = ({ label, fieldKey, icon, profile, draft, editing, onDraftChange }) => (
  <View style={styles.field}>
    <View style={styles.fieldLabel}>
      <Ionicons name={icon as any} size={16} color={colors.primary} />
      <Text style={styles.fieldLabelText}>{label}</Text>
    </View>
    {editing ? (
      <TextInput
        style={styles.input}
        value={draft[fieldKey] as string}
        onChangeText={(val) => onDraftChange(fieldKey, val)}
      />
    ) : (
      <Text style={styles.fieldValue}>{profile[fieldKey] as string}</Text>
    )}
  </View>
);

export const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    loadProfile<Profile>().then((saved) => {
      if (saved) {
        setProfile(saved);
        setDraft(saved);
      }
    });
  }, []);

  const startEdit = () => { setDraft({ ...profile }); setEditing(true); };
  const cancelEdit = () => { setDraft({ ...profile }); setEditing(false); };
  const saveEdit = () => {
    setProfile({ ...draft });
    saveProfile(draft);
    setEditing(false);
    Alert.alert('Saved', 'Profile updated successfully.');
  };
  const handleDraftChange = (key: keyof Profile, val: string) =>
    setDraft((d) => ({ ...d, [key]: val }));

  const fieldProps = { profile, draft, editing, onDraftChange: handleDraftChange };

  return (
    <ScreenWrapper>
      <Header
        title="My Profile"
        showBack
        rightIcon={editing ? 'close-outline' : 'create-outline'}
        onRightPress={editing ? cancelEdit : startEdit}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileFlat}>Flat {profile.flat} · Block {profile.block}</Text>
          <View style={styles.societyTag}>
            <Ionicons name="business-outline" size={13} color={colors.primary} />
            <Text style={styles.societyTagText}>{APP_CONFIG.societyName}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Field label="Full Name" fieldKey="name" icon="person-outline" {...fieldProps} />
          <Field label="Phone" fieldKey="phone" icon="call-outline" {...fieldProps} />
          <Field label="Email" fieldKey="email" icon="mail-outline" {...fieldProps} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Flat Details</Text>
          <Field label="Flat Number" fieldKey="flat" icon="home-outline" {...fieldProps} />
          <Field label="Block" fieldKey="block" icon="business-outline" {...fieldProps} />
          <Field label="Members" fieldKey="members" icon="people-outline" {...fieldProps} />
          <Field label="Vehicle No." fieldKey="vehicleNo" icon="car-outline" {...fieldProps} />
        </View>

        {editing && (
          <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
            <Text style={styles.saveBtnText}>Save Profile</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>NivassHub · Member Profile</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40 },
  avatarSection: { alignItems: 'center', backgroundColor: colors.primary, paddingTop: 24, paddingBottom: 32 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', marginBottom: 12 },
  avatarText: { fontSize: 30, fontWeight: '700', color: colors.white },
  profileName: { fontSize: 22, fontWeight: '700', color: colors.white },
  profileFlat: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  societyTag: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  societyTagText: { fontSize: 11, color: colors.white, marginLeft: 5 },
  card: { backgroundColor: colors.white, borderRadius: 12, marginHorizontal: 16, marginTop: 16, padding: 16, elevation: 2 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  field: { marginBottom: 14 },
  fieldLabel: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  fieldLabelText: { fontSize: 12, color: colors.textSecondary, marginLeft: 6, fontWeight: '500' },
  fieldValue: { fontSize: 15, color: colors.textPrimary, paddingLeft: 22 },
  input: { borderBottomWidth: 1, borderBottomColor: colors.primary, fontSize: 15, color: colors.textPrimary, paddingVertical: 4, paddingLeft: 22 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, marginHorizontal: 16, marginTop: 20, borderRadius: 12, paddingVertical: 14, gap: 8 },
  saveBtnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 12, color: colors.textLight },
});

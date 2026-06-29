import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/layout';
import { Header } from '@/components/common';
import { SocietyForm } from '../components/SocietyForm';
import { useSocieties } from '../hooks/useSocieties';
import type { SocietyFormData } from '../types';

export const AddSocietyScreen: React.FC = () => {
  const router = useRouter();
  const { create, loading } = useSocieties();

  const handleSubmit = async (formData: SocietyFormData) => {
    const result = await create(formData);
    if (result.success) {
      Alert.alert('Society Added', `"${result.data?.name}" has been successfully added.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to add society. Please try again.');
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Add Society" showBack />
      <View style={styles.content}>
        <SocietyForm
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          loading={loading}
          submitLabel="Save Society"
        />
      </View>
    </ScreenWrapper>
  );
};

export default AddSocietyScreen;

const styles = StyleSheet.create({
  content: { flex: 1, padding: 16 },
});

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/layout';
import { Header } from '@/components/common';
import { Loader } from '@/components/feedback';
import { SocietyForm } from '../components/SocietyForm';
import { useSocieties } from '../hooks/useSocieties';
import type { Society, SocietyFormData } from '../types';
import type { SocietyEditParams } from '@/types/navigation';

export const EditSocietyScreen: React.FC = () => {
  const { id } = useLocalSearchParams<SocietyEditParams>();
  const router = useRouter();
  const { societies, update, loading } = useSocieties();
  const [society, setSociety] = useState<Society | null>(null);

  useEffect(() => {
    const found = societies.find((s) => s.id === id);
    setSociety(found ?? null);
  }, [id, societies]);

  const handleSubmit = async (formData: SocietyFormData) => {
    const result = await update(id!, formData);
    if (result.success) {
      Alert.alert('Society Updated', `"${result.data?.name}" has been successfully updated.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to update society. Please try again.');
    }
  };

  if (!society) {
    return (
      <ScreenWrapper>
        <Header title="Edit Society" showBack />
        <Loader message="Loading..." />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Edit Society" showBack />
      <View style={styles.content}>
        <SocietyForm
          initialValues={society}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          loading={loading}
          submitLabel="Update Society"
        />
      </View>
    </ScreenWrapper>
  );
};

export default EditSocietyScreen;

const styles = StyleSheet.create({
  content: { flex: 1, padding: 16 },
});

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../src/components/common/ScreenWrapper';
import Header from '../../src/components/common/Header';
import SocietyForm from '../../src/components/common/SocietyForm';
import { useSocieties } from '../../src/hooks/useSocieties';

export default function AddSocietyScreen() {
  const router = useRouter();
  const { create, loading } = useSocieties();

  const handleSubmit = async (formData) => {
    const result = await create(formData);
    if (result.success) {
      Alert.alert(
        'Society Added',
        `"${result.society.name}" has been successfully added.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        'Error',
        result.error || 'Failed to add society. Please try again.'
      );
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
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
});

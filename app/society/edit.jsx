import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenWrapper from '../../src/components/common/ScreenWrapper';
import Header from '../../src/components/common/Header';
import SocietyForm from '../../src/components/common/SocietyForm';
import Loader from '../../src/components/common/Loader';
import { useSocieties } from '../../src/hooks/useSocieties';

export default function EditSocietyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { societies, update, loading } = useSocieties();
  const [society, setSociety] = useState(null);

  // Derive society from Redux store using id param
  useEffect(() => {
    const found = societies.find((s) => s.id === id);
    setSociety(found || null);
  }, [id, societies]);

  const handleSubmit = async (formData) => {
    const result = await update(id, formData);
    if (result.success) {
      Alert.alert(
        'Society Updated',
        `"${result.society.name}" has been successfully updated.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        'Error',
        result.error || 'Failed to update society. Please try again.'
      );
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
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
});

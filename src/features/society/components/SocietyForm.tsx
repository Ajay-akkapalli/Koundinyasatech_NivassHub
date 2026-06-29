import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Button } from '@components/ui/Button';
import colors from '@theme/colors';
import type { SocietyFormData, Society } from '../types';

interface FieldDef {
  key: keyof FormState;
  label: string;
  placeholder: string;
  required: boolean;
  multiline?: boolean;
  numeric?: boolean;
}

const FIELDS: FieldDef[] = [
  { key: 'name', label: 'Society Name', placeholder: 'e.g. Green Valley Residency', required: true },
  { key: 'address', label: 'Address', placeholder: 'e.g. 123, Main Street, Sector 4', required: true, multiline: true },
  { key: 'city', label: 'City', placeholder: 'e.g. Bengaluru', required: true },
  { key: 'state', label: 'State', placeholder: 'e.g. Karnataka', required: true },
  { key: 'totalBlocks', label: 'Total Blocks', placeholder: 'e.g. 4', required: true, numeric: true },
  { key: 'totalUnits', label: 'Total Units', placeholder: 'e.g. 120', required: true, numeric: true },
];

interface FormState {
  name: string;
  address: string;
  city: string;
  state: string;
  totalBlocks: string;
  totalUnits: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function buildInitial(initial: Partial<Society>): FormState {
  return {
    name: initial.name ?? '',
    address: initial.address ?? '',
    city: initial.city ?? '',
    state: initial.state ?? '',
    totalBlocks: initial.totalBlocks ? String(initial.totalBlocks) : '',
    totalUnits: initial.totalUnits ? String(initial.totalUnits) : '',
  };
}

interface SocietyFormProps {
  initialValues?: Partial<Society>;
  onSubmit: (data: SocietyFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export const SocietyForm: React.FC<SocietyFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Save',
}) => {
  const [form, setForm] = useState<FormState>(() => buildInitial(initialValues));
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Society name is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';

    const blocks = parseInt(form.totalBlocks, 10);
    if (!form.totalBlocks.trim()) e.totalBlocks = 'Total blocks is required';
    else if (isNaN(blocks) || blocks <= 0) e.totalBlocks = 'Blocks must be a number greater than 0';

    const units = parseInt(form.totalUnits, 10);
    if (!form.totalUnits.trim()) e.totalUnits = 'Total units is required';
    else if (isNaN(units) || units <= 0) e.totalUnits = 'Units must be a number greater than 0';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      totalBlocks: parseInt(form.totalBlocks, 10),
      totalUnits: parseInt(form.totalUnits, 10),
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {FIELDS.map(({ key, label, placeholder, multiline, numeric }) => (
        <View key={key} style={styles.fieldGroup}>
          <Text style={styles.label}>
            {label}<Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            style={[styles.input, multiline && styles.multilineInput, errors[key] ? styles.inputError : null]}
            placeholder={placeholder}
            placeholderTextColor={colors.textLight}
            value={form[key]}
            onChangeText={(val) => updateField(key, val)}
            keyboardType={numeric ? 'numeric' : 'default'}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            textAlignVertical={multiline ? 'top' : 'center'}
            autoCorrect={false}
          />
          {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null}
        </View>
      ))}
      <View style={styles.actions}>
        <Button title={submitLabel} onPress={handleSubmit} loading={loading} />
        <Button title="Cancel" onPress={onCancel} variant="secondary" disabled={loading} style={styles.cancelBtn} />
      </View>
    </ScrollView>
  );
};

export default SocietyForm;

const styles = StyleSheet.create({
  container: { flex: 1 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: 6 },
  required: { color: colors.danger },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14,
    color: colors.textPrimary, backgroundColor: colors.white,
  },
  multilineInput: { height: 80, paddingTop: 12 },
  inputError: { borderColor: colors.danger, borderWidth: 1.5 },
  errorText: { fontSize: 12, color: colors.danger, marginTop: 4 },
  actions: { marginTop: 8, paddingBottom: 32 },
  cancelBtn: { marginTop: 10 },
});

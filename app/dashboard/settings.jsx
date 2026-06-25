import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../src/components/common/ScreenWrapper';
import Header from '../../src/components/common/Header';
import { saveSettings, loadSettings } from '../../src/services/storageService';
import { APP_CONFIG } from '../../src/constants/appConfig';
import colors from '../../src/theme/colors';

function SettingRow({ icon, label, value, onValueChange, type = 'toggle', onPress, valueLabel }) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={type === 'nav' ? onPress : undefined}
      activeOpacity={type === 'nav' ? 0.7 : 1}
    >
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary + '80' }}
          thumbColor={value ? colors.primary : colors.textLight}
        />
      )}
      {type === 'nav' && (
        <View style={styles.rowRight}>
          {valueLabel ? <Text style={styles.valueLabel}>{valueLabel}</Text> : null}
          <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    visitorAlerts: true,
    maintenanceAlerts: true,
    paymentReminders: true,
    darkMode: false,
    soundEnabled: true,
  });

  useEffect(() => {
    loadSettings().then((saved) => {
      if (saved) setSettings(saved);
    });
  }, []);

  const toggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleAbout = () => {
    Alert.alert(
      'About NivassHub',
      `Version: ${APP_CONFIG.version}\n${APP_CONFIG.societyName}\n${APP_CONFIG.societyAddress}\n\nDeveloped by Koundinyasatech`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScreenWrapper>
      <Header title="Settings" showBack />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Notifications</Text>
        <View style={styles.card}>
          <SettingRow icon="notifications-outline" label="Push Notifications" value={settings.pushNotifications} onValueChange={() => toggle('pushNotifications')} />
          <View style={styles.divider} />
          <SettingRow icon="person-add-outline" label="Visitor Alerts" value={settings.visitorAlerts} onValueChange={() => toggle('visitorAlerts')} />
          <View style={styles.divider} />
          <SettingRow icon="build-outline" label="Maintenance Alerts" value={settings.maintenanceAlerts} onValueChange={() => toggle('maintenanceAlerts')} />
          <View style={styles.divider} />
          <SettingRow icon="cash-outline" label="Payment Reminders" value={settings.paymentReminders} onValueChange={() => toggle('paymentReminders')} />
        </View>

        <Text style={styles.section}>Appearance</Text>
        <View style={styles.card}>
          <SettingRow icon="moon-outline" label="Dark Mode" value={settings.darkMode} onValueChange={() => toggle('darkMode')} />
          <View style={styles.divider} />
          <SettingRow icon="volume-high-outline" label="Sound" value={settings.soundEnabled} onValueChange={() => toggle('soundEnabled')} />
        </View>

        <Text style={styles.section}>Society Info</Text>
        <View style={styles.card}>
          <SettingRow type="nav" icon="business-outline" label="Society Name" valueLabel={APP_CONFIG.societyName} onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow type="nav" icon="location-outline" label="Address" valueLabel="View" onPress={() => Alert.alert('Address', APP_CONFIG.societyAddress)} />
          <View style={styles.divider} />
          <SettingRow type="nav" icon="call-outline" label="Contact" valueLabel={APP_CONFIG.contactPhone} onPress={() => {}} />
        </View>

        <Text style={styles.section}>App</Text>
        <View style={styles.card}>
          <SettingRow type="nav" icon="information-circle-outline" label="About NivassHub" onPress={handleAbout} />
          <View style={styles.divider} />
          <SettingRow type="nav" icon="document-text-outline" label="Version" valueLabel={`v${APP_CONFIG.version}`} onPress={() => {}} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>NivassHub v{APP_CONFIG.version}</Text>
          <Text style={styles.footerSub}>by Koundinyasatech</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    elevation: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowLabel: { fontSize: 15, color: colors.textPrimary },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  valueLabel: { fontSize: 13, color: colors.textLight, marginRight: 4, maxWidth: 140 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 60 },
  footer: { alignItems: 'center', marginTop: 32, marginBottom: 40 },
  footerText: { fontSize: 13, color: colors.textLight },
  footerSub: { fontSize: 11, color: colors.textLight, marginTop: 2 },
});

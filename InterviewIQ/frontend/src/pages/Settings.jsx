import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import SettingsSection from '../components/settings/SettingsSection';
import ProfileSettingsForm from '../components/settings/ProfileSettingsForm';
import ChangePasswordForm from '../components/settings/ChangePasswordForm';
import SecuritySettings from '../components/settings/SecuritySettings';
import PreferencesForm from '../components/settings/PreferencesForm';
import { updateSettingsRequest, changePasswordRequest, logoutAllDevicesRequest } from '../api/settings';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DEFAULT_PREFERENCES = {
  theme: 'light',
  defaultCompany: 'general',
  interviewDifficulty: 'medium',
  defaultQuestionCount: 6,
};

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  const [preferences, setPreferences] = useState(user?.preferences || DEFAULT_PREFERENCES);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  async function handleSaveProfile(form) {
    setIsSavingProfile(true);
    try {
      const data = await updateSettingsRequest(form);
      updateUser(data.user);
      showSuccess('Profile settings saved.');
    } catch (err) {
      showError(err.message || 'Could not save your changes.');
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleSavePreferences() {
    setIsSavingPreferences(true);
    try {
      const data = await updateSettingsRequest(preferences);
      updateUser(data.user);
      showSuccess('Preferences saved.');
    } catch (err) {
      showError(err.message || 'Could not save your preferences.');
    } finally {
      setIsSavingPreferences(false);
    }
  }

  async function handleChangePassword(payload) {
    setIsChangingPassword(true);
    try {
      await changePasswordRequest(payload);
      showSuccess('Password updated. Please log in again.');
      setTimeout(logout, 1200);
      return true;
    } catch (err) {
      showError(err.message || 'Could not change your password.');
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleLogoutAllDevices() {
    setIsLoggingOutAll(true);
    try {
      await logoutAllDevicesRequest();
      showSuccess('Logged out from all devices.');
      setTimeout(logout, 1000);
    } catch (err) {
      showError(err.message || 'Could not log out other devices.');
    } finally {
      setIsLoggingOutAll(false);
    }
  }

  if (!user) return null;

  return (
    <DashboardLayout title="Settings">
      <div className="mx-auto max-w-3xl space-y-8">
        <SettingsSection title="Profile settings" description="Update your name, college, branch, and graduation year.">
          <ProfileSettingsForm user={user} onSave={handleSaveProfile} isSaving={isSavingProfile} />
        </SettingsSection>

        <SettingsSection title="Security" description="Change your password or sign out of every device.">
          <div className="space-y-6">
            <ChangePasswordForm onSubmit={handleChangePassword} isSaving={isChangingPassword} />
            <div className="h-px bg-paper-line dark:bg-ink-line" />
            <SecuritySettings onLogoutAllDevices={handleLogoutAllDevices} isProcessing={isLoggingOutAll} />
          </div>
        </SettingsSection>

        <SettingsSection title="Preferences" description="Personalize your default interview experience.">
          <PreferencesForm
            preferences={preferences}
            onChange={setPreferences}
            onSave={handleSavePreferences}
            isSaving={isSavingPreferences}
          />
        </SettingsSection>
      </div>
    </DashboardLayout>
  );
}

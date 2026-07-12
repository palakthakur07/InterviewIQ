import { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AvatarUpload from '../components/profile/AvatarUpload';
import ProfileStatsGrid from '../components/profile/ProfileStatsGrid';
import ProfileInfoForm from '../components/profile/ProfileInfoForm';
import ErrorState from '../components/ui/ErrorState';
import { getProfileRequest, updateProfileRequest, uploadAvatarRequest } from '../api/profile';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const EMPTY_STATS = {
  totalInterviews: 0,
  averageScore: null,
  bestScore: null,
  companiesPracticed: [],
  skillsDetected: [],
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [stats, setStats] = useState(EMPTY_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getProfileRequest();
        if (cancelled) return;
        setStats(data.stats);
        updateUser(data.user);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Could not load your profile.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveInfo(form) {
    setIsSaving(true);
    try {
      const data = await updateProfileRequest(form);
      updateUser(data.user);
      showSuccess('Profile updated.');
    } catch (err) {
      showError(err.message || 'Could not update your profile.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarUpload(file) {
    setIsUploadingAvatar(true);
    try {
      const data = await uploadAvatarRequest(file);
      updateUser(data.user);
      showSuccess('Photo updated.');
    } catch (err) {
      showError(err.message || 'Could not upload your photo.');
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  if (loadError) {
    return (
      <DashboardLayout title="Profile">
        <ErrorState title="Could not load profile" description={loadError} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="card flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-center">
          <AvatarUpload
            name={user?.name}
            avatarUrl={user?.avatarUrl}
            onUpload={handleAvatarUpload}
            isUploading={isUploadingAvatar}
          />
          <div className="text-center sm:text-left">
            <h2 className="font-display text-xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-ink/55 dark:text-paper/55">{user?.email}</p>
            {(user?.college || user?.branch) && (
              <p className="mt-1 text-xs text-ink/45 dark:text-paper/45">
                {[user?.branch, user?.college].filter(Boolean).join(' · ')}
                {user?.graduationYear ? ` · Class of ${user.graduationYear}` : ''}
              </p>
            )}
          </div>
        </div>

        <ProfileStatsGrid stats={stats} isLoading={isLoading} />

        {stats.skillsDetected.length > 0 && (
          <div>
            <h3 className="mb-3 font-display text-base font-semibold">Skills detected</h3>
            <div className="flex flex-wrap gap-2">
              {stats.skillsDetected.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-paper-line bg-paper-surface px-3 py-1 text-xs font-medium text-ink/70 dark:border-ink-line dark:bg-ink-surface2 dark:text-paper/70"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {user && <ProfileInfoForm user={user} onSave={handleSaveInfo} isSaving={isSaving} />}
      </div>
    </DashboardLayout>
  );
}

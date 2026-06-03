import { AccountSettings } from '@/shared/components/common/AccountSettings'

export default function AdminSettingsPage() {
  return (
    <AccountSettings
      extraNotifications={[
        {
          id: 'moderation',
          label: 'Moderation alerts',
          description: 'Notify me when jobs are flagged for review.',
          default: true,
        },
        {
          id: 'verification',
          label: 'Verification requests',
          description: 'Notify me about new employer verification submissions.',
          default: true,
        },
      ]}
    />
  )
}

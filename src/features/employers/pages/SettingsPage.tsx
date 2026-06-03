import { AccountSettings } from '@/shared/components/common/AccountSettings'

export default function EmployerSettingsPage() {
  return (
    <AccountSettings
      extraNotifications={[
        {
          id: 'new-applicant',
          label: 'New applicant alerts',
          description: 'Email me whenever someone applies to my jobs.',
          default: true,
        },
        {
          id: 'weekly-report',
          label: 'Weekly hiring report',
          description: 'A summary of your job performance every Monday.',
          default: true,
        },
      ]}
    />
  )
}

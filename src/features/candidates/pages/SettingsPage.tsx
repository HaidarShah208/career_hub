import { AccountSettings } from '@/shared/components/common/AccountSettings'

export default function CandidateSettingsPage() {
  return (
    <AccountSettings
      extraNotifications={[
        {
          id: 'recruiter-search',
          label: 'Recruiter visibility',
          description: 'Let recruiters discover your profile in searches.',
          default: true,
        },
      ]}
    />
  )
}

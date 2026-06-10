import { useQueryClient } from '@tanstack/react-query'

import { FileUpload } from '@/shared/components/common/FileUpload'
import { deleteCompanyLogo, uploadCompanyLogo } from '@/shared/services/uploads.api'
import { employerCompanyKeys, useEmployerCompany } from '../hooks/useEmployerCompany'

/** Company logo upload — wraps FileUpload with upload/delete wired to the employer API. */
export function CompanyLogoUpload({ disabled }: { disabled?: boolean }) {
  const queryClient = useQueryClient()
  const { company } = useEmployerCompany()

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: employerCompanyKeys.company })

  return (
    <FileUpload
      kind="companyLogo"
      currentUrl={company?.logo ?? null}
      disabled={disabled}
      disabledHint="Create your company profile first"
      upload={async (file, onProgress) => {
        const { logoUrl } = await uploadCompanyLogo(file, onProgress)
        refresh()
        return logoUrl
      }}
      onRemove={async () => {
        await deleteCompanyLogo()
        refresh()
      }}
    />
  )
}

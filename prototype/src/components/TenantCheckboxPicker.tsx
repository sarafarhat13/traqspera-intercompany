import { ModusWcCheckbox, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'
import type { Tenant } from '../types/intercompany'

type TenantCheckboxPickerProps = {
  tenants: Tenant[]
  selectedTenantIds: ReadonlySet<string>
  onToggleTenant: (tenantId: string, checked: boolean) => void
}

export function TenantCheckboxPicker({
  tenants,
  selectedTenantIds,
  onToggleTenant,
}: TenantCheckboxPickerProps) {
  return (
    <ul className="ic-job-picker-list" role="group" aria-label="Copy to tenants">
      {tenants.map((tenant) => (
        <li key={tenant.id} className="ic-job-picker-row">
          <ModusWcCheckbox
            value={selectedTenantIds.has(tenant.id)}
            onInputChange={(e: CustomEvent) =>
              onToggleTenant(tenant.id, e.detail?.target?.checked ?? false)
            }
            aria-label={tenant.name}
          />
          <ModusWcTypography
            hierarchy="p"
            size="sm"
            customClass="!m-0 min-w-0 flex-1"
            label={tenant.name}
          />
        </li>
      ))}
    </ul>
  )
}

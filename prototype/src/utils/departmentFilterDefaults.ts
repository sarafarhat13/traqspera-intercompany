import type { ISelectOption } from '@trimble-oss/moduswebcomponents'
import type { JobModuleType } from '../types/intercompany'

/**
 * Shared with Delete Unused Jobs — prefill job type + department from the
 * module the user opened the dialog from (Job Cost, Overhead, Work Order).
 */
export type DepartmentFilterState = {
  jobType: JobModuleType
  departmentId: string
}

const MODULE_DEFAULTS: Record<JobModuleType, DepartmentFilterState> = {
  jobCost: { jobType: 'jobCost', departmentId: 'dept-electrical' },
  overhead: { jobType: 'overhead', departmentId: 'dept-admin' },
  workOrder: { jobType: 'workOrder', departmentId: 'dept-field-service' },
  asset: { jobType: 'asset', departmentId: 'dept-equipment' },
}

export function getDepartmentFilterDefaults(
  openingModule: JobModuleType,
): DepartmentFilterState {
  return { ...MODULE_DEFAULTS[openingModule] }
}

export const JOB_TYPE_LABELS: Record<JobModuleType, string> = {
  jobCost: 'Job Cost',
  overhead: 'Overhead',
  workOrder: 'Work Order',
  asset: 'Asset',
}

export function buildDepartmentTypeOptions(): ISelectOption[] {
  return (['jobCost', 'overhead', 'workOrder', 'asset'] as JobModuleType[]).map((type) => ({
    label: JOB_TYPE_LABELS[type],
    value: type,
  }))
}

export function getDefaultDepartmentType(openingModule: JobModuleType): JobModuleType {
  return getDepartmentFilterDefaults(openingModule).jobType
}

export type JobModuleType = 'jobCost' | 'overhead' | 'workOrder' | 'asset'

export type Tenant = {
  id: string
  name: string
}

export type Department = {
  id: string
  name: string
  jobType: JobModuleType
}

export type IntercompanyJob = {
  id: string
  number: string
  name: string
  customer?: string
  originalTenantId: string
  jobType: JobModuleType
  departmentId: string
  tenantsWithCopy: string[]
}

export type CopyResult = {
  jobId: string
  tenantId: string
}

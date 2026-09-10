import type { Department, IntercompanyJob, JobModuleType, Tenant } from '../types/intercompany'

export const TENANTS: Tenant[] = [
  { id: 'tenant-spectrum', name: 'Traqspera Spectrum Demo' },
  { id: 'tenant-vista', name: 'Traqspera Vista Demo' },
  { id: 'tenant-elearn', name: 'Trimble eLearn' },
  { id: 'tenant-demo', name: 'Traqspera Demo' },
]

export const DEPARTMENTS: Department[] = [
  { id: 'dept-electrical', name: 'Electrical', jobType: 'jobCost' },
  { id: 'dept-mechanical', name: 'Mechanical', jobType: 'jobCost' },
  { id: 'dept-admin', name: 'Administration', jobType: 'overhead' },
  { id: 'dept-facilities', name: 'Facilities', jobType: 'overhead' },
  { id: 'dept-field-service', name: 'Field Service', jobType: 'workOrder' },
  { id: 'dept-maintenance', name: 'Maintenance', jobType: 'workOrder' },
]

const COPIED_TO_ALL = ['tenant-vista', 'tenant-elearn', 'tenant-demo'] as const

/** Jobs per job type (within the 10–20 range for demo data). */
const JOBS_PER_TYPE = 20

const JOB_COST_TEMPLATES: { name: string; customer: string }[] = [
  { name: 'Nurse Station Expansion', customer: 'Regional Health' },
  { name: 'City Hall HVAC Retrofit', customer: 'Municipal Services' },
  { name: 'Warehouse Lighting Upgrade', customer: 'LogiCorp' },
  { name: 'School Gymnasium Renovation', customer: 'School District 12' },
  { name: 'Library Roof Replacement', customer: 'Public Library Board' },
  { name: 'Fire Station Build-Out', customer: 'Fire District 3' },
  { name: 'Community Center Expansion', customer: 'Parks & Rec' },
  { name: 'Police Station Modernization', customer: 'City Police' },
  { name: 'ELLIS HEATING COMPANY', customer: 'Ellis Heating' },
  { name: 'Municipal Parking Structure', customer: 'Downtown Authority' },
  { name: 'Water Treatment Plant', customer: 'Utilities Commission' },
  { name: 'Bridge Deck Rehabilitation', customer: 'DOT Region 4' },
  { name: 'Town Hall Renovation', customer: 'Town of Riverside' },
  { name: 'Data Center Cooling', customer: 'CloudNet' },
  { name: 'Hospital Wing Addition', customer: 'St. Mary Medical' },
  { name: 'Airport Terminal B', customer: 'Metro Aviation' },
  { name: 'Solar Array Installation', customer: 'GreenGrid Energy' },
  { name: 'University Science Lab', customer: 'State University' },
  { name: 'Retail Plaza TI', customer: 'Summit Properties' },
  { name: 'Apartment Complex Phase 2', customer: 'Harbor Homes' },
  { name: 'Manufacturing Line Upgrade', customer: 'Precision Parts Inc' },
  { name: 'Courthouse Security Systems', customer: 'County Courts' },
  { name: 'Transit Hub Electrical', customer: 'Metro Transit' },
  { name: 'Hotel Tower Repipe', customer: 'Coastal Hospitality' },
  { name: 'Food Processing Plant', customer: 'Valley Foods' },
  { name: 'Senior Living Campus', customer: 'Willow Creek Senior' },
  { name: 'Sports Arena Concourse', customer: 'Arena Authority' },
  { name: 'Office Tower Lobby', customer: 'Skyline REIT' },
  { name: 'Distribution Center Racking', customer: 'FastFreight' },
  { name: 'Biotech Clean Room', customer: 'NovaBio' },
]

const OVERHEAD_TEMPLATES: { name: string; customer: string }[] = [
  { name: 'Corporate Overhead Pool', customer: 'Internal' },
  { name: 'Regional Admin Burden', customer: 'Internal' },
  { name: 'Training & Safety OH', customer: 'Internal' },
  { name: 'Facilities Shared Costs', customer: 'Internal' },
  { name: 'IT Infrastructure OH', customer: 'Internal' },
  { name: 'Executive Overhead', customer: 'Internal' },
  { name: 'Estimator Pool OH', customer: 'Internal' },
  { name: 'Shop Overhead Burden', customer: 'Internal' },
  { name: 'Vehicle Fleet OH', customer: 'Internal' },
  { name: 'HR & Payroll Burden', customer: 'Internal' },
  { name: 'Bonding & Insurance OH', customer: 'Internal' },
  { name: 'Small Tools Pool', customer: 'Internal' },
  { name: 'Warehouse OH Allocation', customer: 'Internal' },
  { name: 'Preconstruction OH', customer: 'Internal' },
  { name: 'Quality Assurance OH', customer: 'Internal' },
  { name: 'Safety Program OH', customer: 'Internal' },
  { name: 'Field Supervision OH', customer: 'Internal' },
  { name: 'Equipment Depreciation OH', customer: 'Internal' },
  { name: 'Camp & Travel Burden', customer: 'Internal' },
]

const WORK_ORDER_TEMPLATES: { name: string; customer: string }[] = [
  { name: 'Annual HVAC PM', customer: 'City Schools' },
  { name: 'Generator Load Test', customer: 'Hospital Network' },
  { name: 'Elevator Inspection', customer: 'Tower One LLC' },
  { name: 'Fire Alarm Test', customer: 'Mall Properties' },
  { name: 'Roof Leak Repair', customer: 'Warehouse 7' },
  { name: 'Parking Lot Lighting', customer: 'Retail Center' },
  { name: 'Boiler Seasonal Service', customer: 'County Buildings' },
  { name: 'Access Control Firmware', customer: 'SecureSite' },
  { name: 'Chiller Maintenance', customer: 'Data Center West' },
  { name: 'Exhaust Fan Replacement', customer: 'Food Plant A' },
  { name: 'Panel Schedule Update', customer: 'Office Park' },
  { name: 'Emergency Call-Out', customer: 'Various' },
  { name: 'Cooling Tower Service', customer: 'Office Campus' },
  { name: 'Transformer Oil Sample', customer: 'Industrial Park' },
  { name: 'BAS Point Checkout', customer: 'Hospital Network' },
  { name: 'Dock Door Repair', customer: 'Distribution Hub' },
  { name: 'Kitchen Hood Cleaning', customer: 'Restaurant Group' },
  { name: 'UPS Battery Replace', customer: 'Data Center West' },
  { name: 'Sprinkler Flow Test', customer: 'Mall Properties' },
]

function buildJobsForType(
  jobType: JobModuleType,
  templates: { name: string; customer: string }[],
  departments: string[],
  numberPrefix: string,
  startIndex: number,
  count: number,
): IntercompanyJob[] {
  return Array.from({ length: count }, (_, offset) => {
    const index = startIndex + offset
    const template = templates[offset % templates.length]
    const padded = String(index).padStart(4, '0')
    const number = `${numberPrefix}-${padded}`
    const departmentId = departments[offset % departments.length]
    const copiedCountByType: Record<JobModuleType, number> = {
      jobCost: 8,
      overhead: 3,
      workOrder: 2,
    }
    const copyOffset = jobType === 'jobCost' ? startIndex : 0
    const alreadyCopied = offset < copiedCountByType[jobType] && index >= copyOffset

    return {
      id: `job-${jobType}-${padded}`,
      number,
      name: template.name,
      customer: template.customer,
      originalTenantId: 'tenant-spectrum',
      jobType,
      departmentId,
      tenantsWithCopy: alreadyCopied ? [...COPIED_TO_ALL] : [],
    }
  })
}

export const INITIAL_JOBS: IntercompanyJob[] = [
  ...buildJobsForType(
    'jobCost',
    JOB_COST_TEMPLATES,
    ['dept-electrical', 'dept-mechanical'],
    '1',
    50,
    JOBS_PER_TYPE,
  ),
  ...buildJobsForType(
    'overhead',
    OVERHEAD_TEMPLATES,
    ['dept-admin', 'dept-facilities'],
    'OH',
    100,
    JOBS_PER_TYPE,
  ),
  ...buildJobsForType(
    'workOrder',
    WORK_ORDER_TEMPLATES,
    ['dept-field-service', 'dept-maintenance'],
    'WO',
    200,
    JOBS_PER_TYPE,
  ),
]

export function formatJobLabel(job: IntercompanyJob): string {
  return `${job.number} - ${job.name}`
}

export function getTenantName(tenantId: string, tenants: Tenant[]): string {
  return tenants.find((t) => t.id === tenantId)?.name ?? tenantId
}

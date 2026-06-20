export type VacancyStatus = 'ABIERTA' | 'APROBADA' | 'CERRADA' | 'INACTIVA' | 'RECHAZADA' | 'REVISION';

export interface BackendVacancyResponse {
  data: {
    vacancies: BackendVacancyItem[];
    total: number;
  };
}

export interface BackendVacancyItem {
  Vacancy: {
    id: string;
    name: string;
    location: string;
    description: string;
    salary: { coin: string; min: number; max: number };
    numberOpenings: number;
    workShift: string;
    modality: string;
    createdAt: string;
    checkedAt: string;
    status: string; 
    companyStatus: string;
    additionalInformation?: string;
    benefits?: string;
    businessSector?: string;     
    requiredDegree?: string;      
    experience?: string;          
    gender?: string | null;       
    ageRange?: [number, number];
    comment?: string; 
  };
  Company: {
    id: string;
    tradeName: string;
    legalName: string;
    email?: string;
    phone?: string;
  };
}

export interface CompanyDetails {
  legalName?: string;
  rfc?: string;
  street?: string;
  streetNumber?: string;
  district?: string;
  municipality?: string;
  workSector?: string;
  companyEmail?: string;
  cellPhone?: string;
  landlinePhone?: string;
}

export interface JobCardProps {
  id: string;
  status: VacancyStatus;
  comment?: string; 
  title: string;
  company: string;
  location: string;
  description: string;
  salaryRange: string;
  schedule: string;
  modality: string;
  logoUrl?: string;
  createdAt: string;
  checkedAt: string;
  sector: string;
  numberOfPositions: number;
  BenefitsSection: string;
  degree: string;
  AdditionalInformation?: string;
  gender: string;
  ageRange: { min: number; max: number };
  RequiredExperience?: string;
  cellPhone: string;
  email: string;
  companyDetails?: CompanyDetails;
}

/**
 * Clean Code Mapper: Mueve la complejidad de la transformación fuera de los componentes.
 */
export const mapBackendVacancyToJobCard = (item: BackendVacancyItem): JobCardProps => {
  const { Vacancy: v, Company: c } = item;
  const age = v.ageRange || [0, 0];

  return {
    id: v.id,
    status: v.status as VacancyStatus,
    comment: v.comment, // <-- AGREGADO
    title: v.name || 'Sin título',
    company: c.tradeName || c.legalName || 'Empresa desconocida',
    location: v.location || 'Ubicación no especificada',
    description: v.description || '',
    salaryRange: v.salary ? `$${v.salary.min} - $${v.salary.max} ${v.salary.coin}` : 'No visible',
    schedule: v.workShift || 'TIEMPO_COMPLETO',
    modality: v.modality || 'PRESENCIAL',
    createdAt: v.createdAt,
    checkedAt: v.checkedAt,
    sector: v.businessSector || 'No especificado',
    numberOfPositions: v.numberOpenings || 1,
    BenefitsSection: v.benefits || '',
    degree: v.requiredDegree || 'No especificada',
    AdditionalInformation: v.additionalInformation || '',
    gender: v.gender || 'Indistinto',
    ageRange: { min: age[0], max: age[1] },
    RequiredExperience: v.experience || 'No especificada',
    cellPhone: c.phone || 'N/A',
    email: c.email || 'N/A',
    companyDetails: {
      legalName: c.legalName,
      workSector: v.businessSector,
      companyEmail: c.email,
    }
  };
};
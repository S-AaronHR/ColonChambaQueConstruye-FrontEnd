'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

import EmployerSideBar from '@/components/sidebar/EmployerSideBar';
import Header from '@/components/ui/header';
import EmployerTab from '@/components/employer/EmployerTab';
import { apiService } from '@/services/api.service';
import { useCompanyStore } from '@/app/store/authCompanyStore';
import RequestReviewButton from '@/components/common/RequestReviewButton';

// Tipado de respuesta al endpoint
type Company = {
  id: string;
  tradeName: string;
  legalName: string;
  zipCode: string;
  street: string;
  streetNumber: string;
  state: string;
  district: string;
  municipality: string;
  country: string;
  investmentCountry: string;
  totalWorkers: number;
  description: string;
  rfc: string;
  status: string;
  workSector: string;
  companyEmail: string;
  comment: string | null;
};

type CompanyAccount = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  landlinePhone: string;
  jobTitle: string;
};

type ApiResponse = {
  statusCode: number;
  data: {
    Company: Company;
    CompanyAccount: CompanyAccount;
  };
};

type EmployerProfileContextType = {
  company: Company | null;
  companyAccount: CompanyAccount | null;
  loading: boolean;
  error: string | null;
};

const EmployerProfileContext =
  createContext<EmployerProfileContextType | undefined>(undefined);

export function useEmployerProfile() {
  const ctx = useContext(EmployerProfileContext);

  if (!ctx) {
    throw new Error(
      'useEmployerProfile debe usarse dentro de LayoutEmployerView',
    );
  }

  return ctx;
}

export default function LayoutEmployerView({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const {
    statusCompany,
    companyId,
    token,
    logoutCompany,
  } = useCompanyStore();

  const [company, setCompany] = useState<Company | null>(null);
  const [companyAccount, setCompanyAccount] =
    useState<CompanyAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedCompanyId = localStorage.getItem('companyId');

        if (!storedCompanyId) {
          setError('No se encontró companyId en localStorage');
          setLoading(false);
          return;
        }

        const res = await apiService.get(`/companies/${storedCompanyId}`);

        if (!res) {
          setError('No hubo respuesta del servidor');
          setLoading(false);
          return;
        }

        if (!res.ok) {
          setError(`Error ${res.status} al cargar la empresa`);
          setLoading(false);
          return;
        }

        const json = (await res.json()) as ApiResponse;

        setCompany(json.data.Company);
        setCompanyAccount(json.data.CompanyAccount);
      } catch (err) {
        console.error('Error cargando perfil de empresa', err);
        setError('No se pudo cargar la información de la empresa');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const finalCompanyStatus = (
    company?.status ||
    statusCompany ||
    ''
  ).toUpperCase();

  const isRejected = finalCompanyStatus === 'RECHAZADA';

  const reviewCompanyId = company?.id || companyId || '';
  const reviewEndpoint = `/api/v1/companies/${reviewCompanyId}/status`;

  return (
    <EmployerProfileContext.Provider
      value={{ company, companyAccount, loading, error }}
    >
      <div className="min-h-screen bg-gray-50">
        <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-white shadow-sm">
          <Header
            showProfileButton={false}
            companyTitle={company?.tradeName || 'Empresa'}
          />
        </header>

        <main className="flex pt-16">
          {!isRejected && (
            <div className="shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
              <EmployerSideBar />
            </div>
          )}

          <div className="w-120 py-12 shrink-0">
            <EmployerTab />

            {isRejected && (
              <div className="mt-8 px-4">
                <div className="mb-4">
                  {reviewCompanyId && token && (
                    <RequestReviewButton
                      endpoint={reviewEndpoint}
                      token={token}
                      onSuccess={() => {
                        logoutCompany();
                        router.replace('/login/waiting');
                      }}
                    />
                  )}

                  <p className="text-xs text-center text-gray-500 mt-2">
                    Asegúrate de haber corregido los datos indicados antes de volver a enviar tu perfil.
                  </p>
                </div>

                <div className="bg-red-50 shadow-sm border border-red-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-6 flex flex-col items-start gap-3">
                    <h3 className="text-base font-bold text-red-700 shrink-0">
                      Motivo de rechazo
                    </h3>

                    <div className="w-full min-w-0">
                      <p className="text-red-800 font-medium whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">
                        {company?.comment ||
                          'El administrador no especificó un motivo en el sistema.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-10 px-6">
            {children}
          </div>
        </main>
      </div>
    </EmployerProfileContext.Provider>
  );
}
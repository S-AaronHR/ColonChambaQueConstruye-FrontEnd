import Image from 'next/image';
import { Balloon, Buildings, Calendar, ClockCircle, Dollar, Gps, MapPoint, User, Letter, PhoneCalling, AddCircle, InboxIn } from '@solar-icons/react';
import { JobCardProps } from '@/interfaces/jobCard'; 
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface jobCardApplicationProps {
  job: JobCardProps;
  sideDrawer?: "left" | "right"
  logoUrl?: string;
  company: string;
}

const workShiftLabelMap: Record<string, string> = {
  TIEMPO_COMPLETO: "Tiempo completo",
  MEDIO_TIEMPO: "Medio tiempo",
  HORARIO_FLEXIBLE: "Horario flexible",
  PAGO_HORA: "Pago por hora",
  PRACTICAS: "Prácticas",
};

function getInitials(company: string) {
    return company
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2); 
}

export default function UserLinkerVacanciesCard({
  job, sideDrawer, company, logoUrl
}: jobCardApplicationProps) {

    const initials = getInitials(company);

  return (
    <div className="hover:border-uaq-brand-800 group flex flex-col rounded-lg border border-zinc-300 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
        <Drawer direction={sideDrawer === "left" ? "left" : "right"}>
          
          {/* VISTA PRINCIPAL DE LA TARJETA */}
          <div className="flex flex-row max-w-full items-center align-middle justify-between p-3">
            <div className="flex-shrink-0 rounded-l-lg pl-4 transition-colors duration-300">
              <Avatar className="h-18 w-18 object-contain">
                <AvatarImage src={logoUrl ?? undefined} alt={company} />
                <AvatarFallback className="bg-uaq-terniary text-white text-2xl font-semibold">
                {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-1 flex-col self-center px-4 py-4 transition-colors duration-300">
              <div className="flex-1 space-y-1 text-start">
                <div className="text-lg font-[800] text-gray-900">{job.title}</div>
                <div className="text-l text-gray-600">{job.company}</div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2 self-center rounded-r-lg p-4 transition-colors duration-300 ">
              <div className="flex items-center gap-2 text-sm text-gray-700 transition-colors duration-200 group-hover:text-gray-900">
                <ClockCircle className="h-4 w-4" weight="Linear" />
                {workShiftLabelMap[job.schedule] ?? job.schedule}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 transition-colors duration-200 group-hover:text-gray-900">
                <Gps className="h-4 w-4" weight="Linear" />
                <span>{job.modality}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 transition-colors duration-200 group-hover:text-gray-900">
                <span>{new Date(job.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col px-2">
            <div className="flex items-center gap-2 text-sm text-gray-400 transition-colors duration-200 group-hover:text-gray-500 mx-3">
              <MapPoint className="h-4 w-4" weight="Linear" />
              <span className="whitespace-nowrap">{job.location}</span>
            </div>

            <div className="flex flex-1 flex-col px-4 py-4 transition-colors duration-300">
              <div className="flex-1 space-y-1 text-start">
                <div className="text-start font-[400] text-gray-600 line-clamp-3 break-all">{job.description}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-row px-5 mb-5 justify-between items-center">
            <div className="flex items-center gap-2 text-l font-[600] text-brand transition-colors duration-200 group-hover:text-brand-hover mx-3">
              <span className="text-start">{job.salaryRange}</span>
            </div>

            <div className="flex flex-1 flex-col self-center px-4 transition-colors duration-300 items-end">
              <DrawerTrigger className="text-start font-[400] text-brand group-hover:hover:text-uaq-brand active:text-uaq-terniary-hover cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-3 rounded-2xl flex items-center gap-2 text-l transition-colors duration-200 mx-3">
                <AddCircle weight='Bold' className="h-4 w-4" />
                Información
              </DrawerTrigger>
            </div>
          </div>
        
          {/* DRAWER CONTENT CON SCROLL Y WRAPPING CORREGIDO */}
          <DrawerContent className="flex flex-col bg-gray-50 h-full max-h-[100dvh]">
              <DrawerHeader className="px-6 sm:px-10 shrink-0">
                <div className="flex w-full items-center justify-between gap-4">
                  <DrawerTitle className="text-xl sm:text-2xl font-[800] break-words min-w-0 flex-1">
                    VACANTE:{' '}
                    <span className="font-[800] tracking-wide">
                      {job.title.toUpperCase()}
                    </span>
                  </DrawerTitle>

                  <div className={`text-white text-xs sm:text-lg font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-lg shrink-0 ${
                    (String(job.status ?? '').toUpperCase() === 'RECHAZADA') ? 'bg-uaq-danger' : 'bg-success'
                  }`}>
                    {String(job.status ?? '').toUpperCase() === 'RECHAZADA' ? 'RECHAZADA' : 'APROBADA'}
                  </div>
                </div>
              </DrawerHeader>

              {/* CONTENEDOR CON SCROLL QUE PERMITE VER TODO EL CONTENIDO */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-10">
                
                {/* --- SECCIÓN DE MOTIVO DE RECHAZO (CORRECCIÓN DE WRAPPING) --- */}
                {String(job.status ?? '').toUpperCase() === 'RECHAZADA' && (
                  <div className="w-full max-w-4xl bg-red-50 mx-auto mt-4 mb-4 shadow-sm border border-red-200 rounded-lg overflow-hidden">
                    <div className="px-6 py-6 flex flex-col items-start gap-3">
                      <h3 className="text-base font-bold text-red-700 shrink-0">
                        Motivo de rechazo
                      </h3>
                      <div className="w-full min-w-0">
                        {/* Se usa break-words y whitespace-pre-wrap para que el texto largo se ajuste al contenedor */}
                        <p className="text-red-800 font-medium whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">
                          {job.comment || 'Motivo no especificado en el sistema.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- BLOQUE DE INFORMACIÓN GENERAL --- */}
                <div className="w-full max-w-4xl bg-white justify-center mx-auto mb-5 shadow-md border border-gray-200 rounded-lg overflow-hidden">

                  {/* Número de plazas */}
                  <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    <h3 className="text-base font-medium w-full sm:w-1/3 shrink-0 text-gray-900">Número de plazas</h3>
                    <div className="w-full sm:w-2/3 min-w-0 break-words text-gray-700">
                      <span>{job.numberOfPositions}</span>
                    </div>
                  </div>
                  <Separator className='w-11/12 justify-center mx-auto' />

                  {/* Descripción */}
                  <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    <h3 className="text-base font-medium w-full sm:w-1/3 shrink-0 text-gray-900">Descripción</h3>
                    <div className="w-full sm:w-2/3 min-w-0 break-words text-gray-700">
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {job.description}
                      </p>
                    </div>
                  </div>
                  <Separator className='w-11/12 justify-center mx-auto' />

                  {/* Sueldo mensual */}
                  <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    <h3 className="text-base font-medium w-full sm:w-1/3 shrink-0 text-gray-900">Sueldo mensual</h3>
                    <div className="w-full sm:w-2/3 min-w-0 break-words text-gray-700 font-semibold">
                      <span>{job.salaryRange}</span>
                    </div>
                  </div>
                  <Separator className='w-11/12 justify-center mx-auto' />

                  {/* Prestaciones */}
                  <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    <h3 className="text-base font-medium w-full sm:w-1/3 shrink-0 text-gray-900">Prestaciones</h3>
                    <div className="w-full sm:w-2/3 min-w-0 break-words text-gray-700">
                      <p className="whitespace-pre-wrap">{job.BenefitsSection}</p>
                    </div>
                  </div>
                  <Separator className='w-11/12 justify-center mx-auto' />

                  {/* Escolaridad requerida */}
                  <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    <h3 className="text-base font-medium w-full sm:w-1/3 shrink-0 text-gray-900">Escolaridad requerida</h3>
                    <div className="w-full sm:w-2/3 min-w-0 break-words text-gray-700">
                      <span className="capitalize">{job.degree?.toLowerCase()}</span>
                    </div>
                  </div>
                  <Separator className='w-11/12 justify-center mx-auto' />

                  {/* Horarios */}
                  <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    <h3 className="text-base font-medium w-full sm:w-1/3 shrink-0 text-gray-900">Horarios</h3>
                    <div className="w-full sm:w-2/3 min-w-0 break-words text-gray-700">
                      {workShiftLabelMap[job.schedule] ?? job.schedule}
                    </div>
                  </div>
                  <Separator className='w-11/12 justify-center mx-auto' />

                  {/* Género */}
                  <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    <h3 className="text-base font-medium w-full sm:w-1/3 shrink-0 text-gray-900">Género</h3>
                    <div className="w-full sm:w-2/3 min-w-0 break-words text-gray-700">
                      <span>{job.gender ?? 'Indistinto'}</span>
                    </div>
                  </div>
                  <Separator className='w-11/12 justify-center mx-auto' />

                  {/* Rango de edad */}
                  <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    <h3 className="text-base font-medium w-full sm:w-1/3 shrink-0 text-gray-900">Rango de edad</h3>
                    <div className="w-full sm:w-2/3 min-w-0 break-words text-gray-700">
                      <span>{job.ageRange?.min ?? '-'} - {job.ageRange?.max ?? '-'} años</span>
                    </div>
                  </div>
                  <Separator className='w-11/12 justify-center mx-auto' />
                  
                  {/* Datos adicionales */}
                  <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    <h3 className="text-base font-medium w-full sm:w-1/3 shrink-0 text-gray-900">Datos adicionales</h3>
                    <div className="w-full sm:w-2/3 min-w-0 break-words text-gray-700">
                      <p className="whitespace-pre-wrap">{job.AdditionalInformation}</p>
                    </div>
                  </div>

                  {/* Fecha de revision */}
                  <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    <h3 className="text-base font-medium w-full sm:w-1/3 shrink-0 text-gray-900">Fecha de revision</h3>
                    <div className="w-full sm:w-2/3 min-w-0 break-words text-gray-700">
                      <span>{new Date(job.checkedAt).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                           
                    </div>
                  </div>

                </div>

                {/* Botón de cerrar para mejorar accesibilidad en móviles */}
                <div className="flex justify-center mt-6">
                  <DrawerClose className="w-full max-w-xs text-base font-bold hover:bg-zinc-200 border border-zinc-300 text-uaq-danger px-8 py-4 rounded-xl transition-colors shadow-sm">
                    Cerrar Detalle
                  </DrawerClose>
                </div>
              </div>
          </DrawerContent>
      </Drawer>
    </div>
  );
}
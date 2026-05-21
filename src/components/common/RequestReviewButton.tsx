'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Alert from '@/components/ui/Alerts';
import ConfirmRequestReviewModal from '@/components/ui/modal/ConfirmRequestModal';

interface RequestReviewButtonProps {
  endpoint: string;
  token: string;
  onSuccess: () => void;
  buttonText?: string;
}

export default function RequestReviewButton({
  endpoint,
  token,
  onSuccess,
  buttonText = 'Solicitar nueva revisión',
}: RequestReviewButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    isVisible: boolean;
    type: 'error' | 'warning';
    title: string;
    description: string;
  }>({
    isVisible: false,
    type: 'error',
    title: '',
    description: '',
  });

  const getErrorMessage = async (response: Response) => {
    try {
      const data = await response.json();

      if (data?.message) {
        return Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
      }

      if (data?.error) {
        return data.error;
      }

      return 'No se pudo enviar la solicitud. Intenta más tarde.';
    } catch {
      return 'No se pudo enviar la solicitud. Intenta más tarde.';
    }
  };

  const handleRequestReview = async () => {
    setIsModalOpen(false);

    if (!token) {
      setAlertConfig({
        isVisible: true,
        type: 'error',
        title: 'Error de sesión',
        description: 'No se encontró el token. Vuelve a iniciar sesión.',
      });
      return;
    }

    if (!endpoint || endpoint.includes('undefined') || endpoint.includes('null')) {
      setAlertConfig({
        isVisible: true,
        type: 'error',
        title: 'Error de solicitud',
        description: 'No se encontró el ID necesario para solicitar una nueva revisión.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setAlertConfig((prev) => ({ ...prev, isVisible: false }));

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onSuccess();
        return;
      }

      const errorMessage = await getErrorMessage(response);

      console.warn('Error al solicitar revisión:', {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        message: errorMessage,
      });

      setAlertConfig({
        isVisible: true,
        type: 'error',
        title: `Error ${response.status}`,
        description: errorMessage,
      });
    } catch (error) {
      console.warn('Error de conexión al solicitar revisión:', error);

      setAlertConfig({
        isVisible: true,
        type: 'error',
        title: 'Error de conexión',
        description: 'Hubo un problema al comunicarse con el servidor.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Alert
        isVisible={alertConfig.isVisible}
        onClose={() =>
          setAlertConfig((prev) => ({ ...prev, isVisible: false }))
        }
        type={alertConfig.type}
        title={alertConfig.title}
        description={alertConfig.description}
      />

      <Button
        variant="secondary"
        className="w-full py-6 text-md font-semibold hover:bg-gray-300"
        onClick={() => setIsModalOpen(true)}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando solicitud...' : buttonText}
      </Button>

      <ConfirmRequestReviewModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRequestReview}
      />
    </>
  );
}
"use client";

import React from 'react';
import { Button, buttonVariants } from '@/components/button';
import { VariantProps } from 'class-variance-authority';

interface PopupProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: VariantProps<typeof buttonVariants>['variant'];
  cancelVariant?: VariantProps<typeof buttonVariants>['variant'];
}

const Popup: React.FC<PopupProps> = ({
                                       message,
                                       onConfirm,
                                       onCancel,
                                       confirmText = 'Confirmar',
                                       cancelText = 'Cancelar',
                                       confirmVariant = 'default',
                                       cancelVariant = 'default'
                                     }) => {
  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center bg-accent bg-opacity-50">
      <div className="bg-white p-4 rounded-md shadow-md">
        <p>{message}</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={onCancel}
            variant={cancelVariant}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant={confirmVariant}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
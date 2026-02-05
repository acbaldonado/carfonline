import React from 'react';
import { AlertCircle, CheckCircle, XCircle, FileCheck } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'update' | 'cancel' | 'submit' | 'approve' | 'return';
  title?: string;
  message?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  title,
  message,
}) => {
  if (!isOpen) return null;

  // Configuration for different action types
  const config = {
    update: {
      icon: FileCheck,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      title: title || 'Update Confirmation',
      message: message || 'Are you sure you want to update this customer form? Your changes will be saved.',
      confirmText: 'Yes, Update',
      confirmBg: 'bg-blue-600 hover:bg-blue-700',
    },
    cancel: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: title || 'Cancel Confirmation',
      message: message || 'Are you sure you want to cancel this request? This action cannot be undone.',
      confirmText: 'Yes, Cancel',
      confirmBg: 'bg-red-600 hover:bg-red-700',
    },

    return: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: title || 'Return to Maker Confirmation',
      message: message || 'Are you sure you want to return this request? This action cannot be undone.',
      confirmText: 'Yes, Return',
      confirmBg: 'bg-red-600 hover:bg-red-700',
    },
    submit: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: title || 'Submit for Approval',
      message: message || 'Ready to submit this form for approval? Make sure all required documents are uploaded.',
      confirmText: 'Yes, Submit',
      confirmBg: 'bg-green-600 hover:bg-green-700',
    },
    approve: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: title || 'Approve Confirmation',
      message: message || 'Are you sure you want to approve this customer activation request?',
      confirmText: 'Yes, Approve',
      confirmBg: 'bg-green-600 hover:bg-green-700',
    },
  };

  const currentConfig = config[action];
  const Icon = currentConfig.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
        {/* Colored header bar */}
        <div className={`h-2 ${currentConfig.confirmBg}`}></div>
        
        {/* Content */}
        <div className="p-8">
          {/* Icon and Title */}
          <div className="flex items-center justify-center mb-6">
            <div className={`${currentConfig.bgColor} ${currentConfig.borderColor} border-2 rounded-full p-4`}>
              <Icon className={`${currentConfig.iconColor} w-12 h-12`} strokeWidth={2} />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
            {currentConfig.title}
          </h3>

          <p className="text-center text-gray-600 mb-8 leading-relaxed">
            {currentConfig.message}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              No, Go Back
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3 ${currentConfig.confirmBg} text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg`}
            >
              {currentConfig.confirmText}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ConfirmationDialog;
import React from 'react';
import { Input } from '@/components/ui/input';
import SupportingDocumentsDialog from '@/components/uploading/SupportingDocumentsDialog';
import { useSystemSettings } from './SystemSettings/SystemSettingsContext';
import { useCustomerForm } from '@/hooks/useCustomerForm';
import { CustomerFormData } from '@/hooks/useCustomerForm';
import Loader from './ui/loader';
import { formatTIN } from '@/utils/formobjs';

interface CustomerFormProps {
  dialogVisible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  dialogVisible, 
  onClose, 
  onSubmit, 
  initialData 
}) => {
  const {
    formData,
    setFormData,
    loading,
    isCustomLimit,
    setIsCustomLimit,
    hasServerFiles,
    dialogOpen,
    setDialogOpen,
    isEditMode,
    invalidFields,
    uploadedFiles,
    districtOptions,
    bucenterOptions,
    custTypeOptions,
    regionOptions,
    paymentLimitOptions,
    paymentTermsOptions,
    salesorgOptions,
    divisionOptions,
    dcOptions,
    salesTerritoryOptions,
    stateProvinceOptions,
    regionTerritoryOptions,
    cityMunicipalityOptions,
    employeeOptions,
    handleCheckboxChange,
    handleInputChange,
    handleFileUpload,
    handleEmployeeNoChange,
    handleEmployeeNameChange,
    submitToGoogleSheet,
    updateToGoogleSheet,
    postToGoogleSheet,
    approveForm,
    cancelForm,
    returntomakerForm,
  } = useCustomerForm(initialData, dialogVisible, onClose);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const hasAnyFiles = hasServerFiles || Object.values(uploadedFiles).some(f => f !== null);

  if (!dialogVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-8">
      {loading && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
      <Loader />
    </div>
  )}
      <div className="no-scrollbar bg-gray-100 text-black w-full max-w-[75vw] rounded-lg shadow-lg overflow-y-scroll max-h-[92vh] p-20 m-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 mb-4">
          <h2 className="text-xl font-bold">📄 CUSTOMER ACTIVATION REQUEST FORM</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-blue-700 text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" style={{ fontFamily: 'Arial, sans-serif' }}>
          <fieldset disabled={loading} className={loading ? 'opacity-60 pointer-events-none' : ''}>
          {/* Company Header Info */}
          <div className="text-center mb-6">
            
            <div className="text-xl font-bold mb-1">BOUNTY PLUS INC.</div>
            <div className="mb-1">Inoza Tower 40th Street, BGC, Taguig City</div>
            <div className="mb-1">Tel: 663-9639 local 1910</div>
            <div className="text-xl font-bold mt-3 mb-4">CUSTOMER ACTIVATION REQUEST FORM</div>

            <div className="flex items-center justify-center mt-4">
              <strong className="text-xl mr-8">FOR</strong>
              <select
                value={formData.custtype}
                onChange={(e) => handleInputChange('custtype', e.target.value)}
                className={`w-[350px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('custtype') ? 'error-border' : ''}`}
              >
                <option value="" disabled>Select WMS Customer Group</option>
                {custTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.custtype && !custTypeOptions.includes(formData.custtype) && (
                  <option value={formData.custtype}>{formData.custtype}</option>
                )}
              </select>
            </div>
          </div>

          {/* REQUEST FOR */}
          <div className="flex items-center mt-4">
            <strong className="text-xl min-w-[150px]">REQUEST FOR:</strong>
            <div className={`flex items-center space-x-6 p-2 rounded ${invalidFields.includes('requestfor') ? 'error-border' : ''}`}>
              {['ACTIVATION', 'DEACTIVATION', 'EDIT'].map(option => (
                <label key={option} className="flex items-center text-xl">
                  <input
                    type="checkbox"
                    checked={formData.requestfor.includes(option)}
                    onChange={(e) =>setFormData(prev => ({ ...prev, requestfor: [option] }))}
                    className="mr-2"
                  />
                  <span>{option} of Customer Code</span>
                </label>
              ))}
            </div>
          </div>

          {/* APPLY FOR */}
          <div className="flex items-center mt-1">
            <strong className="text-xl min-w-[150px]">APPLY FOR:</strong>
            <div className={`flex items-center space-x-6 ${invalidFields.includes('ismother') ? 'error-border' : ''}`}>
              {['SOLD TO PARTY', 'SHIP TO PARTY'].map(option => (
                <label key={option} className="flex items-center text-xl">
                  <input
                    type="checkbox"
                    checked={formData.ismother.includes(option)}
                    onChange={(e) =>setFormData(prev => ({ ...prev, ismother: [option] }))}
                    className="mr-2"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* TYPE */}
          <div className="flex items-center mt-4">
            <strong className="text-xl min-w-[150px]">TYPE:</strong>
            <div className={`flex items-center space-x-6 ${invalidFields.includes('type') ? 'error-border' : ''}`}>
              {['PERSONAL', 'CORPORATION'].map(option => (
                <label key={option} className="flex items-center text-xl">
                  <input
                    type="radio"
                    name="type"
                    value={option}
                    checked={formData.type.includes(option)}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: [e.target.value] }))}
                    className="mr-2"
                  />
                  <span>{option === 'PERSONAL' ? 'INDIVIDUAL' : 'CORPORATION'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* DISTRIBUTION CHANNEL */}
          <div className="flex items-center mt-4">
            <strong className="text-xl min-w-[150px]">DISTRIBUTION CHANNEL:</strong>
            <div className={`flex items-center space-x-6 ${invalidFields.includes('saletype') ? 'error-border' : ''}`}>
              {['OUTRIGHT', 'CONSIGNMENT'].map(option => (
                <label key={option} className="flex items-center text-xl">
                  <input
                    type="checkbox"
                    checked={formData.saletype.includes(option)}
                   onChange={(e) =>setFormData(prev => ({ ...prev, saletype: [option] }))}
                    className="mr-2"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Corporation Name Section */}
          {formData.type.includes('CORPORATION') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-xl items-start">
              <div>
                <label className="block font-semibold mb-2">
                  REGISTERED COMPANY NAME (SOLD TO PARTY):
                </label>
                <input
                  type="text"
                  value={formData.soldtoparty}
                  onChange={(e) => handleInputChange('soldtoparty', e.target.value)}
                  className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('soldtoparty') ? 'error-border' : ''}`}
                />
                <i className="text-sm text-gray-600">
                  Name to appear on all Records, Official Receipts, Invoices, Delivery Receipts
                </i>
              </div>

              <div>
                <div className="flex items-center space-x-6 mb-2">
                  <label className="font-semibold">ID TYPE:</label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="idtype"
                      value="TIN"
                      checked={formData.idtype === 'TIN'}
                      onChange={(e) => handleInputChange('idtype', e.target.value)}
                      className="mr-2"
                    />
                    <span>TIN</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="idtype"
                      value="OTHERS"
                      checked={formData.idtype === 'OTHERS'}
                      onChange={(e) => handleInputChange('idtype', e.target.value)}
                      className="mr-2"
                    />
                    <span>OTHERS</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <strong>{formData.idtype === 'OTHERS' ? 'OTHERS:' : 'TIN:'}</strong>
                  <input
                    type="text"
                    value={formData.tin}
                     onChange={(e) => setFormData(prev => ({ ...prev, tin: formatTIN(e.target.value) }))}
                    className={`flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('tin') ? 'error-border' : ''}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Personal Name Section */}
          {formData.type.includes('PERSONAL') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-xl items-start">
              <div>
                <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-2 mb-2">
                  <strong>LAST NAME</strong>
                  <span></span>
                  <strong>FIRST NAME</strong>
                  <span></span>
                  <strong>MIDDLE NAME</strong>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-2">
                  <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => handleInputChange('lastname', e.target.value)}
                    className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('lastname') ? 'error-border' : ''}`}
                  />
                  <span className="flex items-center justify-center">/</span>
                  <input
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => handleInputChange('firstname', e.target.value)}
                    className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('firstname') ? 'error-border' : ''}`}
                  />
                  <span className="flex items-center justify-center">/</span>
                  <input
                    type="text"
                    value={formData.middlename}
                    onChange={(e) => handleInputChange('middlename', e.target.value)}
                    className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('middlename') ? 'error-border' : ''}`}
                  />
                </div>

                <div className="mt-1">
                  <i className="text-sm text-gray-600">
                    Name to appear on all Records, Official Receipts, Invoices, Delivery Receipts
                  </i>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <strong className="mr-4">ID TYPE:</strong>
                  <label className="flex items-center mr-4">
                    <input
                      type="radio"
                      name="idtype"
                      value="TIN"
                      checked={formData.idtype === 'TIN'}
                      onChange={(e) => handleInputChange('idtype', e.target.value)}
                      className="mr-2"
                    />
                    <span>TIN</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="idtype"
                      value="OTHERS"
                      checked={formData.idtype === 'OTHERS'}
                      onChange={(e) => handleInputChange('idtype', e.target.value)}
                      className="mr-2"
                    />
                    <span>OTHERS</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <strong className="whitespace-nowrap">{formData.idtype === 'OTHERS' ? 'OTHERS:' : 'TIN:'}</strong>
                  <input
                    type="text"
                    value={formData.tin}
                    onChange={(e) => handleInputChange('tin', e.target.value)}
                    className={`flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('tin') ? 'error-border' : ''}`}
                  />
                </div>
              </div>
            </div>
          )}

                    {/* Billing Address */}
          <div className="mt-8">
            <div className="text-xl font-bold mb-2">BILLING ADDRESS:</div>
            <input
              type="text"
              value={formData.billaddress}
              onChange={(e) => handleInputChange('billaddress', e.target.value)}
            className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('billaddress') ? 'error-border' : ''}`}
            />
          </div>

          {/* Branch, Store Code, Trade Name */}
          <div className="mt-8">
            <div className="grid grid-cols-3 gap-6 text-xl mb-2">
                <strong className="font-bold">BRANCH (SHIP TO PARTY):</strong>
                <strong className="font-bold">STORE CODE:</strong>
                <strong className="font-bold">TRADE NAME (BUSINESS STYLE):</strong>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <input
                type="text"
                value={formData.shiptoparty}
                onChange={(e) => handleInputChange('shiptoparty', e.target.value)}
                className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('shiptoparty') ? 'error-border' : ''}`}
              />
              <input
                type="text"
                value={formData.storecode}
                onChange={(e) => handleInputChange('storecode', e.target.value)}
                className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('storecode') ? 'error-border' : ''}`}
              />
              <input
                type="text"
                value={formData.busstyle}
                onChange={(e) => handleInputChange('busstyle', e.target.value)}
                className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm${invalidFields.includes('busstyle') ? 'error-border' : ''}`}
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mt-8">
            <div className="text-xl font-bold mb-2">DELIVERY ADDRESS:</div>
            <input
              type="text"
              value={formData.deladdress}
              onChange={(e) => handleInputChange('deladdress', e.target.value)}
            //   className="border rounded px-3 py-2 w-full max-w-[1200px]"
            className= {`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('deladdress') ? 'error-border' : ''}`}
            />
          </div>

          {/* Requested By Section */}
          <div className="mt-10 text-xl">
            <div className="font-bold mb-4">Requested By:</div>
            
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex items-center space-x-4">
                <strong className="whitespace-nowrap">Customer Name:</strong>
                <input
                  type="text"
                  value={formData.contactperson}
                  onChange={(e) => handleInputChange('contactperson', e.target.value)}
                  className={`flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('contactperson') ? 'error-border' : ''}`}
                />
              </div>
              <div className="flex items-center space-x-4">
                <strong className="whitespace-nowrap">Email Address:</strong>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-[600px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('email') ? 'error-border' : ''}`}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <strong className="whitespace-nowrap">Position:</strong>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className={`w-[600px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('position') ? 'error-border' : ''}`}
                />
              </div>
              <div className="flex items-center space-x-4">
                <strong className="whitespace-nowrap">Cellphone No.:</strong>
                <input
                  type="tel"
                  value={formData.contactnumber}
                  onChange={(e) => handleInputChange('contactnumber', e.target.value)}
                  className={`w-[500px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('contactnumber') ? 'error-border' : ''}`}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <strong>Supporting Documents:</strong>
              <button
              type="button"
              className={`ml-4 px-4 py-2 rounded ${
                hasAnyFiles
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                onClick={() => setDialogOpen(true)}
            >
              {hasAnyFiles ? 'VIEW FILES' : 'CHOOSE FILE'}
            </button>
              <SupportingDocumentsDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                uploadedFiles={uploadedFiles}
                onFileUpload={handleFileUpload}
                gencode={formData.gencode}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="mt-5">
            <hr className="border-t border-dashed border-black" />
          </div>

          {/* BPlus Section */}
          <div className="mt-2">
            <i className="text-sm">To be filled out by BPlus:</i>
          </div>

          {/* BOS/WMS Code and Business Center */}
          <div className="grid grid-cols-2 gap-6 mb-4 text-xl">
            <div className="flex items-center">
              <strong className="mr-4">BOS/WMS CODE:</strong>
              <input
                type="text"
                value={formData.boscode}
                onChange={(e) => handleInputChange('boscode', e.target.value)}
                // className="border rounded px-3 py-2 w-[300px]"
                className={`w-[300px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('boscode') ? 'error-border' : ''}`}
                readOnly={formData.requestfor.includes('ACTIVATION')}
              />
            </div>
            <div className="flex items-center">
              <strong className="mr-4">BUSINESS CENTER:</strong>
              <select
                value={formData.bucenter}
                onChange={(e) => handleInputChange('bucenter', e.target.value)}
                // className="border rounded px-3 py-2 w-[300px]"
                className={`w-[400px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('bucenter') ? 'error-border' : ''}`}
              >
                <option value="" disabled>
                  Select BU Center
                </option>
                {bucenterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}

                {/* Include current value if not in options */}
                {formData.bucenter && !bucenterOptions.includes(formData.bucenter) && (
                  <option value={formData.bucenter}>{formData.bucenter}</option>
                )}
              </select>
            </div>
          </div>

          {/* Region and District */}
          <div className="grid grid-cols-2 gap-6 mb-4 text-xl">
            <div className="flex items-center">
              <strong className="mr-20">REGION:</strong>
              <select
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                // className="border rounded px-3 py-2 w-[450px]"
                className={`w-[450px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('region') ? 'error-border' : ''}`}
              >
                <option value="" disabled>
                  Select Region
                </option>
                {regionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}

                {/* Include current value if not in options */}
                {formData.region && !regionOptions.includes(formData.region) && (
                  <option value={formData.region}>{formData.region}</option>
                )}
              </select>
            </div>
            <div className="flex items-center">
              <strong className="mr-4">DISTRICT:</strong>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                // className="border rounded px-3 py-2 w-[450px]"
                className={`w-[420px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('district') ? 'error-border' : ''}`}
              >
                <option value="" disabled>
                  Select District
                </option>
                {districtOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}

                {/* Include current value if not in options */}
                {formData.district && !districtOptions.includes(formData.district) && (
                  <option value={formData.district}>{formData.district}</option>
                )}
              </select>
            </div>
          </div>

          {/* Sales Info */}
          <div className="mt-6">
            <div className="text-xl font-bold mb-2">SALES INFO:</div>
            <div className="grid grid-cols-2 gap-6 mb-4 text-xl">
              <div className="flex items-center">
                <strong className="mr-12">SALES ORG:</strong>
                <select
                  value={formData.salesinfosalesorg}
                  onChange={(e) => handleInputChange('salesinfosalesorg', e.target.value)}
                //   className="border rounded px-3 py-2 w-[300px]"
                className={`w-[300px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('salesinfosalesorg') ? 'error-border' : ''}`}
                >
                  <option value="" disabled>
                  Select Sales Organization
                </option>
                {salesorgOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}

                {/* Include current value if not in options */}
                {formData.salesinfosalesorg && !salesorgOptions.includes(formData.salesinfosalesorg) && (
                  <option value={formData.salesinfosalesorg}>{formData.salesinfosalesorg}</option>
                )}
                </select>
              </div>
              <div className="flex items-center">
                <strong className="mr-4">DISTRIBUTION CHANNEL:</strong>
                <select
                  value={formData.salesinfodistributionchannel}
                  onChange={(e) => handleInputChange('salesinfodistributionchannel', e.target.value)}
                //   className="border rounded px-3 py-2 w-[350px]"
                className={`w-[350px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('salesinfodistributionchannel') ? 'error-border' : ''}`}
                >
                   <option value="" disabled>
                  Select Distribution Channel
                </option>
                {dcOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}

                {/* Include current value if not in options */}
                {formData.salesinfodistributionchannel && !dcOptions.includes(formData.salesinfodistributionchannel) && (
                  <option value={formData.salesinfodistributionchannel}>{formData.salesinfodistributionchannel}</option>
                )}
                </select>
              </div>
            </div>
            <div className="flex items-center mt-4 text-xl">
              <strong className="mr-20">DIVISION:</strong>
              <select
                value={formData.salesinfodivision}
                onChange={(e) => handleInputChange('salesinfodivision', e.target.value)}
                // className="border rounded px-3 py-2 w-[350px]"
                className={`w-[350px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('salesinfodivision') ? 'error-border' : ''}`}
              >
                <option value="" disabled>
                  Select Division
                </option>
                {divisionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}

                {formData.salesinfodivision && divisionOptions.includes(formData.region) && (
                  <option value={formData.salesinfodivision} >
                    {formData.salesinfodivision}
                  </option>
                )}
              </select>
            </div>
          </div>
          
          {/* Sales Territory */}
          <div className="mt-6">
            <div className="text-xl font-bold mb-2">TERRITORY:</div>
            <div className="grid grid-cols-2 gap-6 mb-4 text-xl">
              <div className="flex items-center">
                <strong className="mr-12">SALES TERRITORY:</strong>
                <select
                  value={formData.salesterritory}
                  onChange={(e) => handleInputChange('salesterritory', e.target.value)}
                  className={`w-[300px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('salesterritory') ? 'error-border' : ''}`}
                >
                  <option value="" disabled>
                    Select Sales Territory
                  </option>
                  {salesTerritoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  {/* Include current value if not in options */}
                  {formData.salesterritory && !salesTerritoryOptions.includes(formData.salesterritory) && (
                    <option value={formData.salesterritory}>{formData.salesterritory}</option>
                  )}
                </select>
              </div>
              <div className="flex items-center">
                <strong className="mr-4">STATE / PROVINCE:</strong>
                <select
                  value={formData.territoryprovince}
                  onChange={(e) => {
                    handleInputChange('territoryprovince', e.target.value);
                    // Reset city when province changes
                    handleInputChange('territorycity', '');
                  }}
                  disabled={!formData.territoryregion}
                  className={`w-[350px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('territoryprovince') ? 'error-border' : ''}`}
                >
                  <option value="" disabled>Select Province</option>
                  {stateProvinceOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              
            </div>
              <div className="grid grid-cols-2 gap-6 mb-4 text-xl">
                  <div className="flex items-center mt-4 text-xl">
                    <strong className="mr-12">REGION:</strong>
                    <select
                      value={formData.territoryregion}
                      onChange={(e) => {
                        handleInputChange('territoryregion', e.target.value);
                        // Reset dependent fields
                        handleInputChange('territoryprovince', '');
                        handleInputChange('territorycity', '');
                      }}
                      className={`w-[400px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('territoryregion') ? 'error-border' : ''}`}
                    >
                      <option value="" disabled>Select Region</option>
                      {regionTerritoryOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                 <div className="flex items-center mt-4 text-xl">
                    <strong className="mr-20">CITY / MUNICIPALITY:</strong>
                    <select
                      value={formData.territorycity}
                      onChange={(e) => handleInputChange('territorycity', e.target.value)}
                      disabled={!formData.territoryprovince}
                      className={`w-[350px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('territorycity') ? 'error-border' : ''}`}
                    >
                      <option value="" disabled>Select City/Municipality</option>
                      {cityMunicipalityOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
              </div>
          </div>



          <div className="mt-6">
              <table className="w-full border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 p-2 w-[500px] text-center">TRUCK DESCRIPTION</th>
                    <th className="border border-gray-400 p-2 w-[700px] text-center">CHECK CAPACITY</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: '2TONNER FRESH3 - 1500kg', field: 'checkcapRow1' },
                    { label: '2TONNER FROZEN - 1500kg', field: 'checkcapRow2' },
                    { label: '4TONNER FRESH - 2600kg', field: 'checkcapRow3' },
                    { label: '4TONNER FROZEN - 2600kg', field: 'checkcapRow4' },
                    { label: 'FORWARD FRESH - 6000kg', field: 'checkcapRow5' },
                    { label: 'FORWARD FROZEN - 6000kg', field: 'checkcapRow6' },
                  ].map((row) => (
                    <tr key={row.field}>
                      <td className="border border-gray-400 p-2 text-center">{row.label}</td>
                      <td className="border border-gray-400 p-2">
                        <input
                          type="text"
                          value={formData[row.field as keyof CustomerFormData] as string}
                          placeholder="Enter truck capacity"
                          onChange={(e) => handleInputChange(row.field as keyof CustomerFormData, e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          {/* Date, Terms, Credit Limit */}
          <div className="grid grid-cols-3 gap-6 mb-4 text-xl">
            <div className="flex items-center">
              <strong className="mr-8">DATE TO START:</strong>
              <input
                type="date"
                value={formData.datestart}
                onChange={(e) => handleInputChange('datestart', e.target.value)}
                // className="border rounded px-3 py-2 w-[200px]"
                className="w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm"
                readOnly
              />
            </div>
            <div className="flex items-center">
              <strong className="mr-4">TERMS:</strong>
              <select
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                disabled={!formData.custtype || !formData.type} 
                className= {`w-[220px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('terms') ? 'error-border' : ''}`}
                
              >
                 <option value="" disabled>
                  Select Terms
                </option>
                {paymentTermsOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {`${opt.code} - ${opt.name}`}
                  </option>
                ))}

                {/* Include current value if not in options */}
                {formData.terms && !paymentTermsOptions.some(opt => opt.code === formData.terms) && (
                  <option value={formData.terms}>{formData.terms}</option>
                )}

              </select>
            </div>
            <div className="flex items-center">
              <strong className="mr-4">CREDIT LIMIT:</strong>
              {isCustomLimit ? (
                <input
                  type="number"
                  value={formData.creditlimit}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange('creditlimit', value);

                    // Switch back to select if input is empty
                    if (value === '') {
                      setIsCustomLimit(false);
                    }
                  }}
                  className={`w-[250px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('creditlimit') ? 'error-border' : ''}`}
                  placeholder="Enter custom limit"
                />
              ) : (
                <select
                  value={formData.creditlimit || ''} // ensure controlled select
                  onChange={(e) => {
                    if (e.target.value === 'Enter Custom Limit') {
                      setIsCustomLimit(true);           // switch to input
                      handleInputChange('creditlimit', ''); // clear value
                    } else {
                      handleInputChange('creditlimit', e.target.value);
                    }
                  }}
                  disabled={!formData.terms}
                  className={`w-[250px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('creditlimmit') ? 'error-border' : ''}`}
                >
                  <option value="" disabled>
                    Select Limit
                  </option>

                  {paymentLimitOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Target Volume */}
          {formData.custtype !== 'HIGH RISK ACCOUNTS' && (
            <>
              <div className="flex items-center mt-8 text-xl">
                <strong className="mr-4">
                  TARGET VOLUME ({formData.custtype === 'LIVE SALES' ? 'hds' : 'kgs'})/DAY:
                </strong>
                <input
                  type="text"
                  value={formData.targetvolumeday}
                  onChange={(e) => handleInputChange('targetvolumeday', e.target.value)}
                //   className="border rounded px-3 py-2 w-[200px]"
                className={`w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('targetvolumeday') ? 'error-border' : ''}`}
                />
              </div>
              <div className="flex items-center mt-8 text-xl">
                <strong className="mr-4">
                  TARGET VOLUME ({formData.custtype === 'LIVE SALES' ? 'hds' : 'kgs'})/MONTH:
                </strong>
                <input
                  type="text"
                  value={formData.targetvolumemonth}
                  onChange={(e) => handleInputChange('targetvolumemonth', e.target.value)}
                  className={`w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm ${invalidFields.includes('targetvolumemonth') ? 'error-border' : ''}`}
                />
              </div>
            </>
          )}

          {/* Employee Section */}
          <div className="mt-6">
            <div className="grid grid-cols-[200px_1fr_1fr] gap-3 text-xl font-bold mb-2">
              <div></div>
              <div>EMPLOYEE NUMBER</div>
              <div>NAME</div>
            </div>

            {[
              {
                label: 'EXECUTIVE:',
                codeField: 'bccode',
                nameField: 'bcname',
                type: 'GM',
              },
              {
                label: 'GM/SAM/AM:',
                codeField: 'saocode',
                nameField: 'saoname',
                type: 'AM',
              },
              {
                label: 'SAO/SUPERVISOR:',
                codeField: 'supcode',
                nameField: 'supname',
                type: 'SS',
              },
            ].map((row) => {
              const list = employeeOptions[row.type as 'GM' | 'AM' | 'SS'] ?? [];

              return (
                <div
                  key={row.label}
                  className="grid grid-cols-[200px_1fr_1fr] gap-3 items-center mt-3 text-xl"
                >
                  <strong>{row.label}</strong>

                  {/* Employee No */}
                  <select
                    value={formData[row.codeField as keyof CustomerFormData] as string}
                    onChange={(e) =>
                      handleEmployeeNoChange(
                        row.codeField as keyof CustomerFormData,
                        row.nameField as keyof CustomerFormData,
                        list,
                        e.target.value
                      )
                    }
                    className={`w-full rounded-lg border bg-white px-4 py-2
                      ${
                        invalidFields.includes(row.codeField)
                          ? 'error-border'
                          : 'border-gray-300'
                      }`}
                  >
                    <option value="">Select</option>
                    {list.map((emp) => (
                      <option key={emp.employeeno} value={emp.employeeno}>
                        {emp.employeeno}
                      </option>
                    ))}
                  </select>

                  {/* Employee Name */}
                  <select
                    value={formData[row.nameField as keyof CustomerFormData] as string}
                    onChange={(e) =>
                      handleEmployeeNameChange(
                        row.codeField as keyof CustomerFormData,
                        row.nameField as keyof CustomerFormData,
                        list,
                        e.target.value
                      )
                    }
                    className={`w-full rounded-lg border bg-white px-4 py-2
                      ${
                        invalidFields.includes(row.nameField)
                          ? 'error-border'
                          : 'border-gray-300'
                      }`}
                  >
                    <option value="">Select</option>
                    {list.map((emp) => (
                      <option key={emp.employeeno} value={emp.employeename}>
                        {emp.employeename}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>



          {/* Signature Section */}
          <div className="mt-10 pt-4">
            <div className="flex text-sm mb-2">
              <span>Requested By:</span>
              <span className="ml-[135px]">Processed By:</span>
              <span className="ml-[150px]">Approved By:</span>
            </div>

            <div className="flex mt-6 mb-2">
              <div className="w-[200px] border-b border-black"></div>
              <div className="w-[200px] border-b border-black ml-10"></div>
              <div className="w-[200px] border-b border-black ml-10"></div>
              <div className="w-[200px] border-b border-black ml-10"></div>
            </div>
          </div>
          {/* Rest of the form fields... (continuing in next message due to length) */}
          {/* I'll include a comment here showing this continues with all remaining sections */}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 mt-8">
            {formData.approvestatus === "APPROVED" ? (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            ) : formData.approvestatus === "" ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
                </button>
                {isEditMode && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateToGoogleSheet(formData).then(success => success && onClose())}
                      className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelForm(formData).then(success => success && onClose())}
                      className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => postToGoogleSheet(formData).then(success => success && onClose())}
                      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Submit
                    </button>
                  </>
                )}
                {!isEditMode && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => submitToGoogleSheet(formData)}
                    className={`px-6 py-2 rounded text-white ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {loading ? 'Saving Draft...' : 'Draft'}
                  </button>
                )}
              </>
            ) : formData.approvestatus === "PENDING" ? (
              <>
                <button type="button" onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => cancelForm(formData).then(success => success && onClose())}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => approveForm(formData).then(success => success && onClose())}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Approved
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => cancelForm(formData).then(success => success && onClose())}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => postToGoogleSheet(formData).then(success => success && onClose())}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </fieldset>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
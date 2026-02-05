import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CustomerFormData } from '@/hooks/useCustomerForm';

interface PrintableFormProps {
  formData: CustomerFormData;
  makerName: string;
  onClose: () => void;
  isVisible: boolean;
}

const PrintableCustomerForm: React.FC<PrintableFormProps> = ({ 
  formData, 
  makerName, 
  onClose, 
  isVisible 
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: formData.gencode,
  });
  

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: 8.5in auto;
            margin: 0.4in;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .print-container {
            width: 100%;
            max-width: none;
            box-shadow: none !important;
            border: none !important;
          }
          
          .no-print {
            display: none !important;
          }

          .modal-overlay {
            position: static !important;
            background: none !important;
          }

          .modal-content {
            max-height: none !important;
            overflow: visible !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
        
        @media screen {
          .print-container {
            background: white;
            width: 100%;
            padding: 0;
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        .underline-input {
          border: none;
          border-bottom: 1px solid #000;
          padding: 2px 6px;
          background: #f0f4ff;
          outline: none;
          width: 100%;
          font-size: 10pt;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-header {
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          padding: 15px 20px;
          border-bottom: 2px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-body {
          padding: 20px 30px 30px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-print {
          background: #22c55e;
          color: white;
          margin-right: 8px;
        }

        .btn-print:hover {
          background: #16a34a;
        }

        .btn-close {
          background: #3b82f6;
          color: white;
        }

        .btn-close:hover {
          background: #2563eb;
        }
      `}</style>

      <div className="modal-overlay no-print">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header no-print">
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
              Customer Activation Request Form
            </h3>
            <div>
              <button onClick={handlePrint} className="btn btn-print">
                Print
              </button>
              <button onClick={onClose} className="btn btn-close">
                Close
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <div ref={componentRef} className="print-container" style={{ 
              fontFamily: 'Arial, sans-serif', 
              fontSize: '10pt', 
              color: '#000',
              lineHeight: '1.2'
            }}>
              {/* Header */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '10px',
                lineHeight: '1.1'
              }}>
                <div style={{ fontSize: '9pt'}}>
                  BOUNTY PLUS INC.
                </div>
                <div style={{ fontSize: '9pt' }}>
                  Inoza Tower 40th Street, BGC, Taguig City
                </div>
                <div style={{ fontSize: '9pt' }}>
                  Tel: 663-9639 local 1910
                </div>
                <div style={{ 
                  fontSize: '10pt', 
                  fontWeight: 'bold',
                  marginTop: '4px'
                }}>
                  CUSTOMER ACTIVATION REQUEST FORM
                </div>
                <div style={{ 
                  marginTop: '4px',
                  fontSize: '9pt'
                }}>
                  <strong>FOR</strong> {formData.custtype}
                </div>
              </div>

              {/* REQUEST FOR */}
              <div style={{ marginBottom: '6px' }}>
                <strong>REQUEST FOR:</strong>{' '}
                <span style={{ background: '#f0f4ff', padding: '2px 6px', borderRadius: '2px' }}>
                  {(Array.isArray(formData.requestfor) ? formData.requestfor : [formData.requestfor]).filter(Boolean).join(', ')}
                </span>
              </div>

              {/* APPLY FOR */}
              <div style={{ marginBottom: '6px' }}>
                <strong>APPLY FOR:</strong>{' '}
                <span style={{ background: '#f0f4ff', padding: '2px 6px', borderRadius: '2px' }}>
                  {(Array.isArray(formData.ismother) ? formData.ismother : [formData.ismother]).filter(Boolean).join(', ')}
                </span>
              </div>

              {/* TYPE */}
              <div style={{ marginBottom: '6px' }}>
                <strong>TYPE:</strong>{' '}
                <span style={{ background: '#f0f4ff', padding: '2px 6px', borderRadius: '2px' }}>
                  {(Array.isArray(formData.type) ? formData.type : [formData.type])
                    .filter(Boolean)
                    .map(t => (t === 'PERSONAL' ? 'INDIVIDUAL' : t === 'CORPORATION' ? 'CORPORATION' : t))
                    .join(', ')}
                </span>
              </div>

              {/* DISTRIBUTION CHANNEL */}
              <div style={{ marginBottom: '10px' }}>
                <strong>DISTRIBUTION CHANNEL:</strong>{' '}
                <span style={{ background: '#f0f4ff', padding: '2px 6px', borderRadius: '2px' }}>
                  {(Array.isArray(formData.saletype) ? formData.saletype : [formData.saletype]).filter(Boolean).join(', ')}
                </span>
              </div>

              {/* Company/Personal Name and ID Type in 2 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '10px' }}>
                {/* Left - Company/Personal Name */}
                <div>
                  {formData.type.includes('CORPORATION') ? (
                    <>
                      <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9pt' }}>
                        REGISTERED COMPANY NAME:
                      </div>
                      <input 
                        type="text" 
                        value={formData.soldtoparty} 
                        readOnly 
                        className="underline-input"
                        style={{ marginBottom: '3px' }}
                      />
                      <div style={{ fontSize: '8pt', fontStyle: 'italic' }}>
                        Name to appear on all Records, Official Receipts, Invoices, Delivery Receipts
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '4px', marginBottom: '3px' }}>
                        <strong style={{ fontSize: '8pt' }}>LAST NAME</strong>
                        <span>/</span>
                        <strong style={{ fontSize: '8pt' }}>FIRST NAME</strong>
                        <span>/</span>
                        <strong style={{ fontSize: '8pt' }}>MIDDLE NAME</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '4px', marginBottom: '3px' }}>
                        <input type="text" value={formData.lastname} readOnly className="underline-input" />
                        <span>/</span>
                        <input type="text" value={formData.firstname} readOnly className="underline-input" />
                        <span>/</span>
                        <input type="text" value={formData.middlename} readOnly className="underline-input" />
                      </div>
                      <div style={{ fontSize: '8pt', fontStyle: 'italic' }}>
                        Name to appear on all Records, Official Receipts, Invoices, Delivery Receipts
                      </div>
                    </>
                  )}
                </div>

                {/* Right - ID Type */}
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', visibility: 'hidden', fontSize: '9pt' }}>
                    REGISTERED COMPANY NAME:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ whiteSpace: 'nowrap', fontSize: '9pt' }}>
                      {formData.idtype === 'OTHERS' ? 'OTHERS:' : 'TIN:'}
                    </strong>
                    <input
                      type="text"
                      value={formData.tin}
                      readOnly
                      className="underline-input"
                      style={{ width: '180px' }}
                    />
                  </div>
                </div>
              </div>

              {/* BILLING ADDRESS */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9pt' }}>BILLING ADDRESS:</div>
                <input 
                  type="text" 
                  value={formData.billaddress} 
                  readOnly 
                  className="underline-input" 
                />
              </div>

              {/* Branch, Store Code, Trade Name */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '3px' }}>
                  <strong style={{ fontSize: '9pt' }}>BRANCH (SHIP TO PARTY):</strong>
                  <strong style={{ fontSize: '9pt' }}>STORE CODE:</strong>
                  <strong style={{ fontSize: '9pt' }}>TRADE NAME:</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <input type="text" value={formData.shiptoparty} readOnly className="underline-input" />
                  <input type="text" value={formData.storecode} readOnly className="underline-input" />
                  <input type="text" value={formData.busstyle} readOnly className="underline-input" />
                </div>
              </div>

              {/* DELIVERY ADDRESS */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '9pt' }}>DELIVERY ADDRESS:</div>
                <input 
                  type="text" 
                  value={formData.deladdress} 
                  readOnly 
                  className="underline-input" 
                />
              </div>

              {/* Requested By */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '9pt' }}>Requested By:</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '5px' }}>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>Customer Name:</strong>
                    <input 
                      type="text" 
                      value={formData.contactperson} 
                      readOnly 
                      className="underline-input" style={{ marginTop: '2px' }} 
                    />
                  </div>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>Email Address:</strong>
                    <input 
                      type="text" 
                      value={formData.email} 
                      readOnly 
                      className="underline-input" style={{ marginTop: '2px' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>Position:</strong>
                    <input 
                      type="text" 
                      value={formData.position} 
                      readOnly 
                      className="underline-input" style={{ marginTop: '2px' }} 
                    />
                  </div>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>Cellphone No.:</strong>
                    <input 
                      type="text" 
                      value={formData.contactnumber} 
                      readOnly 
                      className="underline-input" style={{ marginTop: '2px' }} 
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ 
                borderTop: '1px dashed #000', 
                margin: '12px 0',
                paddingTop: '6px'
              }}>
                <div style={{ fontSize: '8pt', fontStyle: 'italic', color: '#666' }}>
                  To be filled out by BPlus:
                </div>
              </div>

              {/* BOS/WMS and Business Center */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '9pt' }}>BOS/WMS CODE:</strong>
                  <input 
                    type="text" 
                    value={formData.boscode} 
                    readOnly 
                    className="underline-input" style={{ marginTop: '2px' }} 
                  />
                </div>
                <div>
                  <strong style={{ fontSize: '9pt' }}>BUSINESS CENTER:</strong>
                  <input 
                    type="text" 
                    value={formData.bucenter} 
                    readOnly 
                    className="underline-input" style={{ marginTop: '2px' }} 
                  />
                </div>
              </div>

              {/* Region and District */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '9pt' }}>REGION:</strong>
                  <input 
                    type="text" 
                    value={formData.region} 
                    readOnly 
                    className="underline-input" style={{ marginTop: '2px' }} 
                  />
                </div>
                <div>
                  <strong style={{ fontSize: '9pt' }}>DISTRICT:</strong>
                  <input 
                    type="text" 
                    value={formData.district} 
                    readOnly 
                    className="underline-input" style={{ marginTop: '2px' }} 
                  />
                </div>
              </div>

              {/* SALES INFO */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '9pt' }}>SALES INFO:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '5px' }}>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>SALES ORG:</strong>
                    <input 
                      type="text" 
                      value={formData.salesinfosalesorg} 
                      readOnly 
                      className="underline-input" style={{ marginTop: '2px' }} 
                    />
                  </div>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>DISTRIBUTION CHANNEL:</strong>
                    <input 
                      type="text" 
                      value={formData.salesinfodistributionchannel} 
                      readOnly 
                      className="underline-input" style={{ marginTop: '2px' }} 
                    />
                  </div>
                </div>
                <div>
                  <strong style={{ fontSize: '9pt' }}>DIVISION:</strong>
                  <input 
                    type="text" 
                    value={formData.salesinfodivision} 
                    readOnly 
                    className="underline-input" style={{ width: '300px', marginTop: '2px' }} 
                  />
                </div>
              </div>

              {/* TERRITORY */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '9pt' }}>TERRITORY:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '5px' }}>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>SALES TERRITORY:</strong>
                    <input 
                      type="text" 
                      value={formData.salesterritory} 
                      readOnly 
                      className="underline-input" style={{ marginTop: '2px' }} 
                    />
                  </div>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>STATE / PROVINCE:</strong>
                    <input 
                      type="text" 
                      value={formData.territoryprovince} 
                      readOnly 
                      className="underline-input" style={{ marginTop: '2px' }} 
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>REGION:</strong>
                    <input 
                      type="text" 
                      value={formData.territoryregion} 
                      readOnly 
                      className="underline-input" style={{ marginTop: '2px' }} 
                    />
                  </div>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>CITY / MUNICIPALITY:</strong>
                    <input 
                      type="text" 
                      value={formData.territorycity} 
                      readOnly 
                      className="underline-input" style={{ marginTop: '2px' }} 
                    />
                  </div>
                </div>
              </div>

              {/* Truck Capacity Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px', fontSize: '9pt' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '4px', backgroundColor: '#e5e7eb', textAlign: 'center' }}>
                      TRUCK DESCRIPTION
                    </th>
                    <th style={{ border: '1px solid #000', padding: '4px', backgroundColor: '#e5e7eb', textAlign: 'center' }}>
                      CHECK CAPACITY
                    </th>
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
                      <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>
                        {row.label}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '4px', background: '#f0f4ff' }}>
                        {formData[row.field as keyof CustomerFormData] as string}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Date, Terms, Credit Limit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '9pt' }}>DATE TO START:</strong>
                  <input 
                    type="text" 
                    value={formData.datestart} 
                    readOnly 
                    className="underline-input" style={{ marginTop: '2px' }} 
                  />
                </div>
                <div>
                  <strong style={{ fontSize: '9pt' }}>TERMS:</strong>
                  <input 
                    type="text" 
                    value={formData.terms} 
                    readOnly 
                    className="underline-input" style={{ marginTop: '2px' }} 
                  />
                </div>
                <div>
                  <strong style={{ fontSize: '9pt' }}>CREDIT LIMIT:</strong>
                  <input 
                    type="text" 
                    value={formData.creditlimit} 
                    readOnly 
                    className="underline-input" style={{ marginTop: '2px' }} 
                  />
                </div>
              </div>

              {/* Target Volume */}
              {formData.custtype !== 'HIGH RISK ACCOUNTS' && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ marginBottom: '5px' }}>
                    <strong style={{ fontSize: '9pt' }}>TARGET VOLUME ({formData.custtype === 'LIVE SALES' ? 'hds' : 'kgs'})/DAY:</strong>
                    <input 
                      type="text" 
                      value={formData.targetvolumeday} 
                      readOnly 
                      className="underline-input" style={{ width: '180px', marginLeft: '8px' }} 
                    />
                  </div>
                  <div>
                    <strong style={{ fontSize: '9pt' }}>TARGET VOLUME ({formData.custtype === 'LIVE SALES' ? 'hds' : 'kgs'})/MONTH:</strong>
                    <input 
                      type="text" 
                      value={formData.targetvolumemonth} 
                      readOnly 
                      className="underline-input" style={{ width: '180px', marginLeft: '8px' }} 
                    />
                  </div>
                </div>
              )}

              {/* Employee Section */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', gap: '8px', marginBottom: '3px' }}>
                  <div></div>
                  <strong style={{ fontSize: '9pt' }}>EMPLOYEE NUMBER</strong>
                  <strong style={{ fontSize: '9pt' }}>NAME</strong>
                </div>
                
                {[
                  { label: 'EXECUTIVE:', code: formData.bccode, name: formData.bcname },
                  { label: 'GM/SAM/AM:', code: formData.saocode, name: formData.saoname },
                  { label: 'SAO/SUPERVISOR:', code: formData.supcode, name: formData.supname },
                ].map((row, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', gap: '8px', marginBottom: '5px' }}>
                    <strong style={{ fontSize: '9pt' }}>{row.label}</strong>
                    <input type="text" value={row.code} readOnly className="underline-input" />
                    <input type="text" value={row.name} readOnly className="underline-input" />
                  </div>
                ))}
              </div>

               {/* Signature Section */}
                <div style={{ marginTop: '20px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: '12px', 
                    fontSize: '9pt' 
                }}>
                    {[
                    { label: 'Requested By:', name: makerName, date: formData.datecreated },
                    { label: 'Processed By:', name: formData.firstapprovername, date: formData.initialapprovedate },
                    { label: 'Approved By:', name: formData.secondapprovername, date: formData.secondapproverdate },
                    { label: 'Approved By:', name: formData.finalapprovername, date: formData.thirdapproverdate },
                    ].map((sig, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '8pt', marginBottom: '3px' }}>{sig.label}</div>
                        <div style={{ 
                        fontSize: '7pt', 
                        color: '#666',
                        minHeight: '14px'
                        }}>
                        {sig.date ? new Date(sig.date).toLocaleDateString() : ''}
                        </div>
                        <div style={{ borderBottom: '1px solid #000', marginBottom: '2px' }}></div>
                        <div style={{ 
                        fontWeight: 'bold', 
                        minHeight: '18px', 
                        marginBottom: '2px', 
                        background: '#f0f4ff', 
                        padding: '2px' 
                        }}>
                        {sig.name}
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintableCustomerForm;
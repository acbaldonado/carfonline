import React, { useState, useEffect } from 'react';
import { X, Upload, File as FileIcon, Trash2, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface DriveFile {
  id: string;
  name: string;
  webViewLink?: string;
  iconLink?: string;
  size?: number;
  mimeType?: string;
}

interface FileUploadDialogProps {
  isOpen: boolean;
  docType: string;
  onClose: () => void;
  onFileSelect: (files: (File | DriveFile)[]) => void;
  initialFiles?: DriveFile[];
  gencode?: string;
  approvestatus?: string;
}

export default function FileUploadDialog({
  isOpen,
  docType,
  onClose,
  onFileSelect,
  initialFiles = [],
  gencode,
  approvestatus = '',
}: FileUploadDialogProps) {
  const [uploadedFiles, setUploadedFiles] = useState<(File | DriveFile)[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | DriveFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  
  const addFilesWithoutDuplicates = (newFilesToAdd: File[]) => {
    setNewFiles((prev) => {
      const combined = [...prev, ...newFilesToAdd];
      return combined.filter((file, index, self) =>
        index === self.findIndex((f) => f.name === file.name)
      );
    });
  };

  useEffect(() => {
    if (isOpen) {
      setUploadedFiles(initialFiles);
      setNewFiles([]);
      setSelectedFile(null);
      setPreviewUrl(null);
      setProgress(0);
      setIsUploading(false);
    }
  }, [isOpen, initialFiles]);

  useEffect(() => {
    if (!selectedFile || !('id' in selectedFile)) {
      setPreviewUrl(null);
      return;
    }

    const fetchDriveFile = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/drive-file/${selectedFile.id}`);
        const blob = await res.blob();
        setPreviewUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error(err);
        setPreviewUrl(null);
      }
    };

    fetchDriveFile();

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    addFilesWithoutDuplicates(files);
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteUploadedFile = async (fileId: string, index: number) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/delete-file/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gencode, docType }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
      
      if (selectedFile && 'id' in selectedFile && selectedFile.id === fileId) {
        setSelectedFile(null);
        setPreviewUrl(null);
      }

      toast({ title: 'Success', description: 'File deleted successfully!' });
    } catch (err) {
      console.error('Delete error:', err);
      toast({ title: 'Error', description: 'Failed to delete file', variant: 'destructive' });
    }
  };

  // ✅ Handle opening file in new tab
  const handleViewFullScreen = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!selectedFile) return;

    let url: string | null = null;

    // For local files (File objects)
    if ('type' in selectedFile) {
      url = URL.createObjectURL(selectedFile);
    }
    // For Drive files
    else if ('id' in selectedFile && previewUrl) {
      url = previewUrl;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleUpload = async () => {
    if (newFiles.length === 0) {
      alert('No files to upload');
      return;
    }

    if (!gencode) {
      alert('CARF No. is required for upload');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('gencode', gencode);
      formData.append('docType', docType);
      
      newFiles.forEach((file) => {
        formData.append('files', file);
      });

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('http://localhost:3001/api/upload-files', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      const responseText = await response.text();


      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response JSON:', e);
        throw new Error('Invalid response from server');
      }

      console.log('Upload successful:', result);

      setProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        toast({ title: 'Success', description: 'Files uploaded successfully!' });
        onFileSelect([...uploadedFiles, ...newFiles]);
      }, 500);

    } catch (err: any) {
      setIsUploading(false);
      setProgress(0);
      alert(`Failed to upload files: ${err.message}\n\nCheck console for details.`);
    }
  };

  const getPreviewContent = () => {
    if (!selectedFile) return null;
    
    if ('type' in selectedFile && selectedFile.type.startsWith('image/')) {
      return <img src={URL.createObjectURL(selectedFile)} alt={selectedFile.name} className="max-h-full w-full object-contain" />;
    }
    if ('type' in selectedFile && selectedFile.type === 'application/pdf') {
      return <iframe src={URL.createObjectURL(selectedFile)} title={selectedFile.name} className="w-full h-full" />;
    }
    
    if ('id' in selectedFile && previewUrl) {
      if (selectedFile.mimeType?.startsWith('image/')) {
        return <img src={previewUrl} alt={selectedFile.name} className="max-h-full w-full object-contain" />;
      }
      if (selectedFile.mimeType === 'application/pdf') {
        return <iframe src={previewUrl} title={selectedFile.name} className="w-full h-full" />;
      }
      return <p className="text-gray-600 text-center">{selectedFile.name}</p>;
    }
    
    return <p className="text-gray-600 text-center">{selectedFile.name}</p>;
  };

  if (!isOpen) return null;

  const allFiles = [...uploadedFiles, ...newFiles];
  const canDeleteUploaded = approvestatus === '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[1400px] h-[85vh] flex overflow-hidden">
        {/* Left: Preview & Upload */}
        <div className="flex-1 p-12 border-r border-gray-200 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-4">
              <Upload className="w-7 h-7" />
              Attachment
            </h2>
            {/* ✅ View Full button - only show when a file is selected */}
            {selectedFile && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleViewFullScreen(e);
                }}
                type="button"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="text-sm font-medium">View Full</span>
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between items-center overflow-auto">
            <div
              className="w-full border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 cursor-pointer flex flex-col justify-center items-center mb-4 flex-1 relative"
              onClick={(e) => {
                // ✅ Only trigger file input if clicking the drop zone itself
                if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drop-zone-content')) {
                  e.preventDefault();
                  e.stopPropagation();
                  document.getElementById('file-input')?.click();
                }
              }}
            >
              {selectedFile ? (
                <div className="drop-zone-content w-full h-full flex items-center justify-center">
                  {getPreviewContent()}
                </div>
              ) : (
                <div className="drop-zone-content">
                  <div className="w-40 h-40 bg-green-500 rounded-full flex items-center justify-center mb-6">
                    <Upload className="w-20 h-20 text-white" />
                  </div>
                  <p className="text-gray-700 font-semibold mb-1 text-lg">Drag files here</p>
                  <p className="text-gray-500 text-base">or click to browse</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => document.getElementById('file-input')?.click()}
              disabled={isUploading}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              {isUploading ? 'Uploading...' : 'Select Files'}
            </button>

            <input
              type="file"
              id="file-input"
              className="hidden"
              multiple
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="mt-6 w-full">
              <p className="text-lg text-gray-700 mb-2 font-medium">Uploading... {progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Uploaded & Drive files */}
        <div className="w-96 bg-gray-50 p-10 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Files ({allFiles.length})
            </h3>
            <button
              onClick={onClose}
              disabled={isUploading}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {allFiles.length === 0 && (
              <p className="text-gray-400 text-center py-20">No files available</p>
            )}

            {/* Existing Drive files */}
            {uploadedFiles.map((file, idx) => (
              <div
                key={`drive-${idx}`}
                className="bg-white rounded-lg p-5 shadow-sm flex items-center gap-4 hover:bg-gray-100"
              >
                <FileIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <p 
                  className="truncate flex-1 cursor-pointer" 
                  onClick={() => setSelectedFile(file)}
                >
                  {file.name}
                </p>
                <span className="text-xs text-green-600 font-semibold">SAVED</span>
                {canDeleteUploaded && 'id' in file && (
                  <button
                    onClick={() => handleDeleteUploadedFile(file.id, idx)}
                    disabled={isUploading}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    title="Delete file"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            {/* New files to upload */}
            {newFiles.map((file, idx) => (
              <div
                key={`new-${idx}`}
                className="bg-white rounded-lg p-5 shadow-sm flex items-center gap-4 hover:bg-gray-100"
              >
                <FileIcon className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <div
                  className="truncate flex-1 cursor-pointer"
                  onClick={() => setSelectedFile(file)}
                >
                  {file.name}
                </div>
                <button
                  onClick={() => handleRemoveFile(idx)}
                  disabled={isUploading}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={newFiles.length === 0 || isUploading || !gencode}
              className="flex-1 px-6 py-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : `Upload (${newFiles.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
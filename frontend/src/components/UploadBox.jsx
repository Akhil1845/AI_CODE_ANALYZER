import React, { useState, useRef } from 'react';
import { Upload, FileArchive, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function UploadBox({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSetFile = (file) => {
    setErrorMessage('');
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      setErrorMessage('Please upload a project archive in .ZIP format.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage('Project file exceeds the 100MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const startUpload = async (fileToUpload) => {
    const file = fileToUpload || selectedFile;
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setErrorMessage('');

    try {
      const result = await api.uploadProject(file, (pct) => {
        setUploadProgress(pct);
      });

      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const loadDemoProject = (demoName, stack) => {
    const dummyBlob = new Blob(['demo zip payload'], { type: 'application/zip' });
    const dummyFile = new File([dummyBlob], `${demoName}.zip`, { type: 'application/zip' });
    setSelectedFile(dummyFile);
    startUpload(dummyFile);
  };

  return (
    <div className="glass-card" style={{
      padding: '38px',
      maxWidth: '750px',
      margin: '0 auto',
      width: '100%',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      boxShadow: '0 20px 50px -10px rgba(4, 5, 10, 0.95), 0 0 25px rgba(217, 70, 239, 0.15)'
    }}>
      {/* Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{
          border: isDragging ? '2px dashed #ec4899' : '2px dashed var(--border-light)',
          background: isDragging ? 'rgba(236, 72, 153, 0.12)' : 'rgba(9, 13, 26, 0.75)',
          borderRadius: 'var(--radius-lg)',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isDragging ? '0 0 25px rgba(236, 72, 153, 0.35)' : 'none'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: isDragging ? 'rgba(236, 72, 153, 0.25)' : 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          border: '1px solid rgba(236, 72, 153, 0.45)',
          boxShadow: '0 0 16px rgba(236, 72, 153, 0.3)'
        }}>
          {isUploading ? (
            <Loader2 size={32} color="#ec4899" style={{ animation: 'spin 1s linear infinite' }} />
          ) : selectedFile ? (
            <FileArchive size={32} color="#f0abfc" />
          ) : (
            <Upload size={32} color="#ec4899" />
          )}
        </div>

        <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
          {selectedFile ? selectedFile.name : 'Drag and drop your project ZIP here'}
        </h3>

        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
          {selectedFile
            ? `Ready to scan: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
            : 'Supports Java, Spring Boot, React, Python, Node.js, and multi-module repos up to 100MB'}
        </p>

        {!isUploading && !selectedFile && (
          <button type="button" className="btn-secondary" style={{ padding: '9px 20px', fontSize: '13.5px' }}>
            Browse Files
          </button>
        )}

        {isUploading && (
          <div style={{ width: '100%', maxWidth: '420px', marginTop: '16px' }}>
            <div style={{
              height: '8px',
              borderRadius: '9999px',
              background: 'var(--bg-surface)',
              overflow: 'hidden',
              marginBottom: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                height: '100%',
                width: `${uploadProgress}%`,
                background: 'linear-gradient(90deg, #f43f5e 0%, #ec4899 35%, #a855f7 70%, #3b82f6 100%)',
                boxShadow: '0 0 12px rgba(236, 72, 153, 0.6)',
                transition: 'width 0.2s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#cbd5e1', fontWeight: 500 }}>
              <span>Unpacking & analyzing structure...</span>
              <span style={{ color: '#f0abfc', fontWeight: 700 }}>{uploadProgress}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#fb7185',
          fontSize: '13.5px'
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected file confirmation button */}
      {selectedFile && !isUploading && (
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              startUpload();
            }}
          >
            <span>Proceed to Analysis</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Instant Demo Projects Strip */}
      <div style={{
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
          <Sparkles size={16} color="#ec4899" />
          <span>Don't have a ZIP ready? Try a sample codebase:</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => loadDemoProject('StudentManagementSystem', 'Spring Boot 3 + Java 17')}
            disabled={isUploading}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              background: 'rgba(15, 21, 43, 0.9)',
              border: '1px solid rgba(236, 72, 153, 0.4)',
              fontSize: '12.5px',
              color: '#f0abfc',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 10px rgba(236, 72, 153, 0.2)'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', boxShadow: '0 0 6px #ec4899' }} />
            <span>StudentManagement.zip</span>
          </button>

          <button
            type="button"
            onClick={() => loadDemoProject('ShopSphere-API', 'React 19 + Node.js')}
            disabled={isUploading}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              background: 'rgba(15, 21, 43, 0.9)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              fontSize: '12.5px',
              color: '#93c5fd',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
            <span>ShopSphere-API.zip</span>
          </button>
        </div>
      </div>
    </div>
  );
}

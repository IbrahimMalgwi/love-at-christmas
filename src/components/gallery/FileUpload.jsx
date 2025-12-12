import React, { useRef, useState } from 'react';
import FileUploadService from '../../services/fileUploadService';

const FileUpload = ({ onUploadSuccess, onUploadError, existingFile = null }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(existingFile || '');
    const [errors, setErrors] = useState([]);

    const ALLOWED_FILE_TYPES = FileUploadService.validMimeTypes.join(', ');
    const MAX_FILE_SIZE_MB = FileUploadService.maxFileSize / 1024 / 1024;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelection(file);
        }
    };

    const handleFileSelection = async (file) => {
        setErrors([]);
        setUploadProgress(0);

        // Validate file
        const validation = FileUploadService.validateFile(file);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);

        // Start upload
        setIsUploading(true);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const result = await FileUploadService.uploadFile(file);

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (result.success) {
                onUploadSuccess?.({
                    image_url: result.publicUrl,
                    file_name: result.fileName,
                    file_size: result.fileSize,
                    mime_type: result.mimeType,
                    storage_path: result.storagePath
                });
            } else {
                setErrors([result.error]);
                onUploadError?.(result.error);
            }
        } catch (error) {
            clearInterval(progressInterval);
            setErrors([error.message]);
            onUploadError?.(error.message);
        } finally {
            setIsUploading(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const handleRemoveFile = () => {
        setPreviewUrl('');
        setErrors([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onUploadSuccess?.(null);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* File Input (hidden) */}
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInput}
                accept={ALLOWED_FILE_TYPES}
                className="hidden"
                disabled={isUploading}
            />

            {/* Upload Area */}
            {!previewUrl && (
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                    } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                >
                    <div className="space-y-2">
                        <div className="text-gray-500">
                            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900">
                                {isUploading ? 'Uploading...' : 'Upload an image'}
                            </p>
                            <p className="text-sm text-gray-500">
                                Drag and drop or click to browse
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Supported: JPG, PNG, GIF, WebP (Max: {MAX_FILE_SIZE_MB}MB)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            {isUploading && uploadProgress > 0 && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Preview */}
            {previewUrl && (
                <div className="space-y-3">
                    <div className="relative inline-block">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-32 w-auto rounded-lg border border-gray-300 object-cover"
                        />
                        {!isUploading && (
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-green-600">
                        ✓ Image ready {isUploading && '(uploading...)'}
                    </p>
                </div>
            )}

            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="space-y-1">
                    {errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">
                            ⚠ {error}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
// src/services/fileUploadService.js
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const FileUploadService = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    validMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

    validateFile: (file) => {
        const errors = [];

        // Check file size
        if (file.size > FileUploadService.maxFileSize) {
            errors.push(`File size exceeds ${FileUploadService.maxFileSize / 1024 / 1024}MB limit`);
        }

        // Check file type
        if (!FileUploadService.validMimeTypes.includes(file.type)) {
            errors.push('Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP)');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    uploadFile: async (file) => {
        try {
            const validation = FileUploadService.validateFile(file);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors.join(', ')
                };
            }

            // Generate unique file name
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
            const storageRef = ref(storage, `gallery/${fileName}`);

            // Upload file
            await uploadBytes(storageRef, file);

            // Get download URL
            const downloadURL = await getDownloadURL(storageRef);

            return {
                success: true,
                fileName: fileName,
                fileSize: file.size,
                mimeType: file.type,
                storagePath: `gallery/${fileName}`,
                publicUrl: downloadURL
            };
        } catch (error) {
            console.error('Upload error:', error);
            return {
                success: false,
                error: error.message || 'Failed to upload file'
            };
        }
    }
};

export default FileUploadService;
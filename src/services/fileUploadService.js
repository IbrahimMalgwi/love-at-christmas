// src/services/fileUploadService.js
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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

    deleteFile: async (path, url) => {
        let fileRef;
        if (path) {
            fileRef = ref(storage, path);
        } else if (url) {
            try {
                fileRef = ref(storage, url);
            } catch {
                return;
            }
        }
        if (!fileRef || fileRef.bucket !== ref(storage).bucket || !/^gallery\/[^/]+$/.test(fileRef.fullPath)) {
            if (path) throw new Error('Invalid gallery storage path.');
            return;
        }
        try {
            await deleteObject(fileRef);
        } catch (error) {
            if (error.code !== 'storage/object-not-found') throw error;
        }
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
            const fileName = `${crypto.randomUUID()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
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
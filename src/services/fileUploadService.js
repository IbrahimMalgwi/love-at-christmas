import { supabase } from './supabase';

class FileUploadService {
    // Valid file types for images
    static validMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    // Maximum file size (5MB)
    static maxFileSize = 5 * 1024 * 1024;

    // Validate file before upload
    static validateFile(file) {
        const errors = [];

        // Check file type
        if (!this.validMimeTypes.includes(file.type)) {
            errors.push(`Invalid file type. Allowed types: ${this.validMimeTypes.join(', ')}`);
        }

        // Check file size
        if (file.size > this.maxFileSize) {
            errors.push(`File too large. Maximum size: ${this.maxFileSize / 1024 / 1024}MB`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Generate unique file name
    static generateFileName(file, prefix = 'image') {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split('.').pop();
        return `${prefix}_${timestamp}_${randomString}.${fileExtension}`;
    }

    // Upload file to Supabase Storage
    static async uploadFile(file, folder = 'gallery') {
        try {
            // Validate file
            const validation = this.validateFile(file);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Generate unique file name
            const fileName = this.generateFileName(file);
            const filePath = `${folder}/${fileName}`;

            // Upload file - remove unused 'data' variable
            const { error } = await supabase.storage
                .from('gallery')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath);

            return {
                success: true,
                fileName,
                filePath,
                publicUrl,
                fileSize: file.size,
                mimeType: file.type
            };

        } catch (error) {
            console.error('Upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Delete file from Supabase Storage
    static async deleteFile(filePath) {
        try {
            const { error } = await supabase.storage
                .from('gallery')
                .remove([filePath]);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Delete error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Update file (delete old and upload new)
    static async updateFile(newFile, oldFilePath, folder = 'gallery') {
        try {
            // Delete old file if exists
            if (oldFilePath) {
                await this.deleteFile(oldFilePath);
            }

            // Upload new file
            return await this.uploadFile(newFile, folder);
        } catch (error) {
            console.error('Update error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default FileUploadService;
import React, { useState, useEffect } from 'react';
import GalleryImageCard from '../../components/gallery/GalleryImageCard';
import GalleryUploadForm from '../../components/gallery/GalleryUploadForm';
import { supabase } from '../../services/supabase';
import FileUploadService from '../../services/fileUploadService';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGalleryData();
    }, []);

    const fetchGalleryData = async () => {
        try {
            console.log('Fetching gallery data...'); // Debug log

            const [imagesResponse, categoriesResponse] = await Promise.all([
                supabase
                    .from('gallery_images')
                    .select(`
                        *,
                        gallery_categories (
                            name
                        )
                    `)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('gallery_categories')
                    .select('*')
                    .order('name')
            ]);

            if (imagesResponse.error) {
                console.error('Images fetch error:', imagesResponse.error);
                throw imagesResponse.error;
            }
            if (categoriesResponse.error) {
                console.error('Categories fetch error:', categoriesResponse.error);
                throw categoriesResponse.error;
            }

            console.log('Categories fetched:', categoriesResponse.data); // Debug log
            console.log('Images fetched:', imagesResponse.data); // Debug log

            setImages(imagesResponse.data || []);
            setCategories(categoriesResponse.data || []);
        } catch (error) {
            console.error('Error fetching gallery data:', error);
            // Set empty arrays on error
            setImages([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateImage = async (formData) => {
        try {
            console.log('Creating image with data:', formData); // Debug log

            const { data, error } = await supabase
                .from('gallery_images')
                .insert([{
                    ...formData,
                    is_active: true
                }])
                .select();

            if (error) throw error;

            console.log('Image created successfully:', data); // Debug log
            setShowForm(false);
            fetchGalleryData(); // Refresh the list
        } catch (error) {
            console.error('Error creating image:', error);
            alert('Error creating image: ' + error.message);
        }
    };

    const handleUpdateImage = async (formData) => {
        try {
            console.log('Updating image with data:', formData); // Debug log

            const { data, error } = await supabase
                .from('gallery_images')
                .update(formData)
                .eq('id', editingImage.id)
                .select();

            if (error) throw error;

            console.log('Image updated successfully:', data); // Debug log
            setEditingImage(null);
            fetchGalleryData(); // Refresh the list
        } catch (error) {
            console.error('Error updating image:', error);
            alert('Error updating image: ' + error.message);
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            // First get the image to know the storage path
            const { data: image, error: fetchError } = await supabase
                .from('gallery_images')
                .select('storage_path')
                .eq('id', imageId)
                .single();

            if (fetchError) throw fetchError;

            // Delete from storage if exists
            if (image.storage_path) {
                const deleteResult = await FileUploadService.deleteFile(image.storage_path);
                if (!deleteResult.success) {
                    console.warn('Failed to delete file from storage:', deleteResult.error);
                }
            }

            // Delete from database
            const { error: deleteError } = await supabase
                .from('gallery_images')
                .delete()
                .eq('id', imageId);

            if (deleteError) throw deleteError;

            fetchGalleryData();
            alert('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error deleting image: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading gallery manager...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gallery Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Upload New Image
                </button>
            </div>

            {/* Debug info */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                    Categories loaded: {categories.length} | Images loaded: {images.length}
                </p>
            </div>

            {showForm && (
                <div className="mb-6">
                    <GalleryUploadForm
                        onSubmit={handleCreateImage}
                        onCancel={() => setShowForm(false)}
                        categories={categories}
                    />
                </div>
            )}

            {editingImage && (
                <div className="mb-6">
                    <GalleryUploadForm
                        onSubmit={handleUpdateImage}
                        onCancel={() => setEditingImage(null)}
                        categories={categories}
                        initialData={editingImage}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map(image => (
                    <GalleryImageCard
                        key={image.id}
                        image={{
                            ...image,
                            category_name: image.gallery_categories?.name || 'Uncategorized'
                        }}
                        onEdit={setEditingImage}
                        onDelete={handleDeleteImage}
                        isAdmin={true}
                    />
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No images uploaded yet.</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Click "Upload New Image" to add your first image to the gallery.
                    </p>
                </div>
            )}
        </div>
    );
};

export default GalleryManager;
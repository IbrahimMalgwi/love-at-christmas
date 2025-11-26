import React, { useState, useEffect } from 'react';
import GalleryImageCard from '../../components/gallery/GalleryImageCard';
import GalleryUploadForm from '../../components/gallery/GalleryUploadForm';
import { supabase } from '../../services/supabase';
import FileUploadService from '../../services/fileUploadService'; // Add this import

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
            const [imagesResponse, categoriesResponse] = await Promise.all([
                supabase
                    .from('gallery_images')
                    .select('*, gallery_categories(name)')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('gallery_categories')
                    .select('*')
                    .order('name')
            ]);

            if (imagesResponse.error) throw imagesResponse.error;
            if (categoriesResponse.error) throw categoriesResponse.error;

            setImages(imagesResponse.data);
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error('Error fetching gallery data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateImage = async (formData) => {
        try {
            const { error } = await supabase
                .from('gallery_images')
                .insert([formData]);

            if (error) throw error;

            setShowForm(false);
            fetchGalleryData();
        } catch (error) {
            console.error('Error creating image:', error);
            alert('Error creating image: ' + error.message);
        }
    };

    const handleUpdateImage = async (formData) => {
        try {
            const { error } = await supabase
                .from('gallery_images')
                .update(formData)
                .eq('id', editingImage.id);

            if (error) throw error;

            setEditingImage(null);
            fetchGalleryData();
        } catch (error) {
            console.error('Error updating image:', error);
            alert('Error updating image: ' + error.message);
        }
    };

    const handleDeleteImage = async (imageId) => {
        // Use window.confirm instead of just confirm
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
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
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
                        image={image}
                        onEdit={setEditingImage}
                        onDelete={handleDeleteImage}
                        isAdmin={true}
                    />
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No images uploaded yet.</p>
                </div>
            )}
        </div>
    );
};

export default GalleryManager;
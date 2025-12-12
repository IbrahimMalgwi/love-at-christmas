import React, { useState, useEffect } from 'react';
import GalleryImageCard from '../../components/gallery/GalleryImageCard';
import GalleryUploadForm from '../../components/gallery/GalleryUploadForm';
import { firestoreService, collections } from '../../services/firestore';

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
            console.log('Fetching gallery data...');

            const [imagesData, categoriesData] = await Promise.all([
                firestoreService.getAll(collections.GALLERY_IMAGES),
                firestoreService.getAll(collections.GALLERY_CATEGORIES)
            ]);

            console.log('Categories fetched:', categoriesData);
            console.log('Images fetched:', imagesData);

            // Map category names to images
            const imagesWithCategories = imagesData.map(image => {
                const category = categoriesData.find(cat => cat.id === image.category_id);
                return {
                    ...image,
                    category_name: category ? category.name : 'Uncategorized'
                };
            });

            setImages(imagesWithCategories || []);
            setCategories(categoriesData || []);
        } catch (error) {
            console.error('Error fetching gallery data:', error);
            setImages([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateImage = async (formData) => {
        try {
            console.log('Creating image with data:', formData);

            await firestoreService.add(collections.GALLERY_IMAGES, {
                ...formData,
                is_active: true
            });

            console.log('Image created successfully');
            setShowForm(false);
            fetchGalleryData();
        } catch (error) {
            console.error('Error creating image:', error);
            alert('Error creating image: ' + error.message);
        }
    };

    const handleUpdateImage = async (formData) => {
        try {
            console.log('Updating image with data:', formData);

            await firestoreService.update(collections.GALLERY_IMAGES, editingImage.id, formData);

            console.log('Image updated successfully');
            setEditingImage(null);
            fetchGalleryData();
        } catch (error) {
            console.error('Error updating image:', error);
            alert('Error updating image: ' + error.message);
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await firestoreService.delete(collections.GALLERY_IMAGES, imageId);
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
                    <p className="text-gray-400 text-sm mt-2">
                        Click "Upload New Image" to add your first image to the gallery.
                    </p>
                </div>
            )}
        </div>
    );
};

export default GalleryManager;
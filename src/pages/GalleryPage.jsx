import React, { useState, useEffect } from 'react';
import GalleryImageCard from '../components/gallery/GalleryImageCard';
import GalleryFilter from '../components/gallery/GalleryFilter';
import { supabase } from '../services/supabase';

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGalleryData();
    }, []);

    const fetchGalleryData = async () => {
        try {
            const [imagesResponse, categoriesResponse] = await Promise.all([
                supabase
                    .from('gallery_images')
                    .select(`
            *,
            gallery_categories (
              name
            )
          `)
                    .eq('is_active', true)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('gallery_categories')
                    .select('*')
                    .order('name')
            ]);

            if (imagesResponse.error) throw imagesResponse.error;
            if (categoriesResponse.error) throw categoriesResponse.error;

            console.log('Fetched images:', imagesResponse.data); // Debug log
            setImages(imagesResponse.data || []);
            setCategories(categoriesResponse.data || []);
        } catch (error) {
            console.error('Error fetching gallery data:', error);
            setImages([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredImages = images.filter(image => {
        const matchesCategory = !selectedCategory || image.category_id === selectedCategory;
        const matchesSearch = !searchTerm ||
            image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.description?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading gallery...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Gallery</h1>

            <GalleryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onSearch={setSearchTerm}
            />

            {filteredImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredImages.map(image => (
                        <GalleryImageCard
                            key={image.id}
                            image={{
                                ...image,
                                // Ensure category name is accessible
                                category_name: image.gallery_categories?.name || 'Uncategorized'
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {images.length === 0 ? 'No images have been uploaded yet.' : 'No images found matching your criteria.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
import React, { useState } from 'react'
import { Search, Filter, X, ZoomIn, Calendar } from 'lucide-react'
import Card from '../components/common/Card'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'

const Gallery = () => {
    const [selectedYear, setSelectedYear] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Mock data - replace with actual Supabase data
    const galleryImages = [
        {
            id: 1,
            url: '/images/gallery/2024-1.jpg',
            title: 'Christmas Eve Distribution 2024',
            year: 2024,
            description: 'Volunteers distributing gifts to families in need',
            tags: ['distribution', 'volunteers', 'gifts']
        },
        {
            id: 2,
            url: '/images/gallery/2024-2.jpg',
            title: 'Food Packing Event',
            year: 2024,
            description: 'Community members packing Christmas meal boxes',
            tags: ['food', 'community', 'packing']
        },
        {
            id: 3,
            url: '/images/gallery/2023-1.jpg',
            title: 'Children Christmas Party 2023',
            year: 2023,
            description: 'Christmas party for children from participating families',
            tags: ['children', 'party', 'celebration']
        },
        {
            id: 4,
            url: '/images/gallery/2023-2.jpg',
            title: 'Volunteer Training Session',
            year: 2023,
            description: 'Training session for new volunteers',
            tags: ['training', 'volunteers', 'education']
        },
        {
            id: 5,
            url: '/images/gallery/2022-1.jpg',
            title: 'Community Dinner 2022',
            year: 2022,
            description: 'Christmas community dinner event',
            tags: ['dinner', 'community', 'celebration']
        },
        {
            id: 6,
            url: '/images/gallery/2022-2.jpg',
            title: 'Toy Drive Collection',
            year: 2022,
            description: 'Collection center for toy donations',
            tags: ['toys', 'donations', 'collection']
        }
    ]

    const years = ['All', ...new Set(galleryImages.map(img => img.year))].sort((a, b) => b - a)

    const filteredImages = galleryImages.filter(image => {
        const matchesYear = selectedYear === 'All' || image.year === parseInt(selectedYear)
        const matchesSearch = searchTerm === '' ||
            image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        return matchesYear && matchesSearch
    })

    const openImageModal = (image) => {
        setSelectedImage(image)
        setIsModalOpen(true)
    }

    const closeImageModal = () => {
        setSelectedImage(null)
        setIsModalOpen(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Photo Gallery
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Relive the magical moments from previous Love At Christmas events and see the impact we've made together.
                    </p>
                </div>

                {/* Filters and Search */}
                <Card className="p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Year Filter */}
                        <div className="flex items-center space-x-4">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <div className="flex flex-wrap gap-2">
                                {years.map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                            selectedYear === year
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search photos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Gallery Grid */}
                {filteredImages.length === 0 ? (
                    <Card className="text-center p-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {filteredImages.map(image => (
                            <Card
                                key={image.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => openImageModal(image)}
                            >
                                {/* Image Placeholder */}
                                <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center text-primary-600">
                                            <Calendar className="h-12 w-12 mx-auto mb-2" />
                                            <span className="font-semibold">Event Photo</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{image.title}</h3>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {image.year}
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{image.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {image.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                                            >
                        #{tag}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Image Modal */}
                <Modal isOpen={isModalOpen} onClose={closeImageModal} size="lg">
                    {selectedImage && (
                        <div className="p-6">
                            <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
                                <div className="text-center text-primary-600">
                                    <Calendar className="h-16 w-16 mx-auto mb-2" />
                                    <span className="font-semibold">Event Photo Preview</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900">{selectedImage.title}</h3>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {selectedImage.year}
                  </span>
                                </div>

                                <p className="text-gray-600">{selectedImage.description}</p>

                                <div className="flex flex-wrap gap-2">
                                    {selectedImage.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full"
                                        >
                      #{tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Call to Action */}
                <Card className="bg-primary-600 text-white text-center p-8">
                    <h2 className="text-2xl font-bold mb-4">Be Part of Our Next Event</h2>
                    <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                        Join us in creating more beautiful memories this Christmas. Your participation
                        helps us capture more moments of joy and connection.
                    </p>
                    <Button variant="secondary">
                        <a href="/register">Get Involved Today</a>
                    </Button>
                </Card>
            </div>
        </div>
    )
}

export default Gallery
import React from 'react';

const GalleryImageCard = ({ image, onEdit, onDelete, isAdmin = false }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{image.description}</p>
                {isAdmin && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(image)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(image.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryImageCard;
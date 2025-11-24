import React from 'react';

const FAQSearch = ({
                       searchTerm,
                       onSearchChange,
                       categories,
                       selectedCategory,
                       onCategoryChange
                   }) => {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
            </div>
            <div className="w-full md:w-64">
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                    {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FAQSearch;
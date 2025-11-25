// src/components/items/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ progress }) => {
    return (
        <div className="w-full bg-gray-200 rounded-full h-4">
            <div
                className="bg-red-600 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
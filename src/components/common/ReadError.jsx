import React from 'react';

export default function ReadError({ onRetry }) {
    return (
        <div className="p-6 text-center">
            <p role="alert" className="mb-3 text-red-700">Could not load this data.</p>
            <button type="button" onClick={onRetry} className="rounded bg-red-700 px-4 py-2 text-white">
                Try again
            </button>
        </div>
    );
}

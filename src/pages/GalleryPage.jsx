import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReadError from '../components/common/ReadError';
import { archiveFlyer } from '../services/galleryArchive';
import GalleryFilter from '../components/gallery/GalleryFilter';
import { firestoreService, collections } from '../services/firestore';

export default function GalleryPage() {
    const [data, setData] = useState({ loading: true, images: [], categories: [] });
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [preview, setPreview] = useState(null);
    const dialog = useRef(null);
    const trigger = useRef(null);

    const load = useCallback(async () => {
        setData(current => ({ ...current, loading: true, error: false }));
        try {
            const [images, categories] = await Promise.all([
                firestoreService.getAll(collections.GALLERY_IMAGES),
                firestoreService.getAll(collections.GALLERY_CATEGORIES)
            ]);
            setData({ images: images.filter(image => image.image_url && image.is_active !== false), categories });
        } catch {
            setData({ error: true, images: [], categories: [] });
        }
    }, []);

    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        if (preview && !dialog.current.open) dialog.current.showModal();
    }, [preview]);

    const events = data.categories.find(entry => entry.name?.toLowerCase() === 'events');
    const archiveCategory = events ?? { id: 'archive-events', name: 'Events' };
    const categories = events ? data.categories : [...data.categories, archiveCategory];
    const images = data.images.some(image => image.image_url === archiveFlyer.original_url)
        ? data.images : [...data.images, { ...archiveFlyer, category_id: archiveCategory.id }];
    const pictures = images.filter(image =>
        (!category || image.category_id === category) &&
        [image.title, image.description].some(value => (value || '').toLowerCase().includes(search.trim().toLowerCase()))
    );

    return (
        <div className="site-wrap section-spacing">
            <header className="page-heading"><p className="eyebrow">Outreach photos</p><h1>Gallery</h1><p>See photos from Love at Christmas.</p></header>
            {data.loading ? <p role="status">Loading gallery…</p> : <>
                {data.error && <ReadError onRetry={load} />}
                <GalleryFilter categories={categories} selectedCategory={category} onCategoryChange={setCategory} onSearch={setSearch} />
                {pictures.length ? <div className="photo-grid">{pictures.map(image => {
                    const title = image.title || 'Love at Christmas outreach';
                    return <figure key={image.id} className="photo-card">
                        <button type="button" aria-label={`View photo: ${title}`} onClick={event => {
                            trigger.current = event.currentTarget;
                            setPreview(image);
                        }}><img loading="lazy" src={image.image_url} className={image.id === archiveFlyer.id ? 'archive-image' : undefined} alt={image.alt_text || title} /></button>
                        <figcaption><strong>{title}</strong>{image.description && <p>{image.description}</p>}</figcaption>
                    </figure>;
                })}</div> : <p role="status">No photos match your filters.</p>}
            </>}
            <dialog className="photo-dialog" ref={dialog} aria-labelledby="photo-title" onClose={() => {
                setPreview(null);
                trigger.current?.focus();
            }}>
                {preview && <>
                    <div className="section-heading"><h2 id="photo-title">{preview.title || 'Outreach photo'}</h2>
                        <button autoFocus className="button button-outline" type="button" onClick={() => dialog.current.close()}>Close</button></div>
                    <img src={preview.image_url} alt={preview.alt_text || preview.title || 'Love at Christmas outreach'} />
                    {preview.description && <p>{preview.description}</p>}
                    <a className="text-link" href={preview.image_url} target="_blank" rel="noreferrer">Open original image</a>
                </>}
            </dialog>
        </div>
    );
}

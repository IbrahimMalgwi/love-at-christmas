import React, { useEffect, useCallback, useState } from 'react';
import FileUploadService from '../../services/fileUploadService';
import ReadError from '../../components/common/ReadError';
import GalleryUploadForm from '../../components/gallery/GalleryUploadForm';
import { collections, firestoreService } from '../../services/firestore';

export default function GalleryManager() {
    const [data, setData] = useState({ loading: true, images: [], categories: [] });
    const [editing, setEditing] = useState(null);
    const [notice, setNotice] = useState('');
    const [pendingDelete, setPendingDelete] = useState(null);

    const load = useCallback(async () => {
        setData(current => ({ ...current, loading: true, error: false }));
        try {
            const [images, categories] = await Promise.all([
                firestoreService.getAll(collections.GALLERY_IMAGES),
                firestoreService.getAll(collections.GALLERY_CATEGORIES)
            ]);
            setData({ images, categories });
        } catch {
            setData({ images: [], categories: [], error: true });
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    async function cleanup(image) {
        if (image?.storage_path || image?.image_url) {
            await FileUploadService.deleteFile(image.storage_path, image.image_url);
        }
    }

    async function save(values) {
        if (editing.id) {
            await firestoreService.update(collections.GALLERY_IMAGES, editing.id, values);
        } else {
            await firestoreService.add(collections.GALLERY_IMAGES, { ...values, is_active: true });
        }
        const previous = editing;
        setEditing(null);
        setNotice(previous.id ? 'Gallery image updated.' : 'Gallery image published.');
        load();
        if (previous.id && values.storage_path && values.storage_path !== previous.storage_path) {
            try { await cleanup(previous); } catch {
                setNotice('Gallery image updated. The previous file needs Storage cleanup.');
            }
        }
    }

    async function remove(image) {
        if (pendingDelete || !window.confirm('Remove this image from the gallery?')) return;
        setPendingDelete(image.id);
        setNotice('');
        try {
            await firestoreService.delete(collections.GALLERY_IMAGES, image.id);
        } catch {
            setNotice('Could not remove this image. Try again.');
            setPendingDelete(null);
            return;
        }
        try {
            await cleanup(image);
            setNotice('Gallery image removed.');
        } catch {
            setNotice('Gallery image removed from the site. Its file still needs Storage cleanup.');
        } finally {
            setPendingDelete(null);
            load();
        }
    }

    if (data.error) return <ReadError onRetry={load} />;
    if (data.loading) return <p role="status" className="site-wrap py-8">Loading gallery…</p>;

    return <section className="site-wrap section-spacing">
        <div className="section-heading"><h2>Gallery management</h2><button className="button" disabled={!!editing} onClick={() => setEditing({})}>Add image</button></div>
        {notice && <p role="status">{notice}</p>}
        {editing && <GalleryUploadForm key={editing.id ?? 'new'} categories={data.categories} initialData={editing}
            onSubmit={save} onCancel={() => setEditing(null)} />}
        {data.images.length ? <div className="photo-grid mt-5">{data.images.map(image => <article className="photo-card" key={image.id}>
            <img src={image.image_url} alt={image.alt_text || image.title || 'Outreach image'} loading="lazy" />
            <div className="p-4">
                <h3 className="font-bold">{image.title}</h3>
                <p>{image.description}</p>
                <div className="button-row">
                    <button className="button button-outline" disabled={!!editing} onClick={() => setEditing(image)}>Edit</button>
                    <button className="button button-outline" disabled={!!pendingDelete || !!editing} onClick={() => remove(image)}>Delete</button>
                </div>
            </div>
        </article>)}</div> : <p>No outreach photos have been added.</p>}
    </section>;
}

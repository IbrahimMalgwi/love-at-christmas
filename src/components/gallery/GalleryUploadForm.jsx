import React, { useState } from 'react';
import FormInput from '../forms/FormInput';
import FileUploadService from '../../services/fileUploadService';

export default function GalleryUploadForm({ onSubmit, onCancel, categories, initialData = {} }) {
    const [form, setForm] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        alt_text: initialData.alt_text || '',
        category_id: initialData.category_id || ''
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const change = key => event => setForm(current => ({ ...current, [key]: event.target.value }));

    async function submit(event) {
        event.preventDefault();
        if (saving) return;
        const values = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
        if (!values.title || !values.alt_text || (!file && !initialData.image_url)) {
            setError('Provide a title, descriptive alt text and an image.');
            return;
        }
        if (file) {
            const result = FileUploadService.validateFile(file);
            if (!result.isValid) {
                setError(result.errors.join(' '));
                return;
            }
        }
        setSaving(true);
        setError('');
        let uploaded;
        try {
            if (file) {
                const result = await FileUploadService.uploadFile(file);
                if (!result.success) throw new Error(result.error);
                uploaded = {
                    image_url: result.publicUrl, storage_path: result.storagePath,
                    file_name: result.fileName, file_size: result.fileSize, mime_type: result.mimeType
                };
            }
            await onSubmit({ ...values, ...uploaded });
        } catch (failure) {
            if (uploaded) {
                try { await FileUploadService.deleteFile(uploaded.storage_path); } catch (cleanupError) { console.error(cleanupError); }
            }
            setError(failure.message || 'Could not save the gallery image.');
        } finally {
            setSaving(false);
        }
    }

    return <form className="surface campaign-editor" onSubmit={submit}>
        <h2>{initialData.id ? 'Edit gallery image' : 'Publish a gallery image'}</h2>
        <p>Use an approved outreach photo. Published images are visible to visitors.</p>
        {initialData.image_url && <img className="mb-4 max-h-40 rounded" src={initialData.image_url} alt={initialData.alt_text || initialData.title || 'Current gallery image'} />}
        <label className="block mb-4">
            {initialData.image_url ? 'Replace image (optional)' : 'Image'}
            <input className="block w-full mt-1" type="file" accept={FileUploadService.validMimeTypes.join(',')} required={!initialData.image_url}
                onChange={event => setFile(event.target.files[0] ?? null)} />
        </label>
        <FormInput label="Title" value={form.title} onChange={change('title')} required maxLength={150} />
        <FormInput label="Alt text" value={form.alt_text} onChange={change('alt_text')} required maxLength={300} />
        <FormInput label="Caption" type="textarea" value={form.description} onChange={change('description')} maxLength={1000} />
        <FormInput label="Category" type="select" value={form.category_id} onChange={change('category_id')}
            options={categories.map(category => ({ value: category.id, label: category.name }))} />
        {error && <p role="alert">{error}</p>}
        <div className="button-row">
            <button type="submit" className="button" disabled={saving}>{saving ? 'Saving…' : initialData.id ? 'Save changes' : 'Publish image'}</button>
            <button type="button" className="button button-outline" disabled={saving} onClick={onCancel}>Cancel</button>
        </div>
    </form>;
}

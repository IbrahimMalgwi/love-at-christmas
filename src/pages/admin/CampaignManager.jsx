import React, { useCallback, useEffect, useState } from 'react';
import FormInput from '../../components/forms/FormInput';
import ReadError from '../../components/common/ReadError';
import { impactFields, loadCampaignEditor, saveCampaign } from '../../services/campaign';
import { collections, firestoreService } from '../../services/firestore';

const initial = { startDate: '', endDate: '', announcement: '', volunteerOpen: false, heroImageId: '', impact: {} };

export default function CampaignManager() {
    const [form, setForm] = useState(initial);
    const [published, setPublished] = useState(false);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [readError, setReadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setReadError(false);
        try {
            const [content, gallery] = await Promise.all([
                loadCampaignEditor(),
                firestoreService.getAll(collections.GALLERY_IMAGES)
            ]);
            const availableImages = gallery.filter(image => image.image_url && image.is_active !== false);
            const values = { ...initial, ...(content.draft ?? content.published) };
            if (!availableImages.some(image => image.id === values.heroImageId)) values.heroImageId = '';
            setForm(values);
            setPublished(!!content.published);
            setImages(availableImages);
        } catch {
            setReadError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const update = key => event => setForm(current => ({ ...current, [key]: event.target.value }));

    const submit = async event => {
        event.preventDefault();
        if (saving) return;
        setMessage('');
        setError('');
        if (form.endDate && (!form.startDate || form.endDate < form.startDate)) {
            setError('Enter a start date on or before the end date.');
            return;
        }
        const impact = {};
        for (const [key, label] of impactFields) {
            const value = form.impact[key];
            if (value == null || value === '') continue;
            if (!Number.isSafeInteger(Number(value)) || Number(value) < 0) {
                setError(`${label} must be a whole number of zero or more.`);
                return;
            }
            impact[key] = Number(value);
        }
        if (form.heroImageId && !images.some(image => image.id === form.heroImageId)) {
            setError('Choose an available gallery photo or clear the selection.');
            return;
        }
        const publish = event.nativeEvent.submitter?.value === 'publish';
        setSaving(true);
        try {
            await saveCampaign({
                startDate: form.startDate, endDate: form.endDate, announcement: form.announcement.trim(),
                volunteerOpen: form.volunteerOpen, heroImageId: form.heroImageId, impact
            }, publish);
            if (publish) setPublished(true);
            setMessage(publish ? 'Campaign published. Visitors can see the changes now.' : 'Draft saved.');
        } catch {
            setError('Could not save the campaign. Try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p role="status">Loading campaign…</p>;
    if (readError) return <ReadError onRetry={load} />;

    return (
        <form onSubmit={submit} className="surface campaign-editor">
            <h2>Campaign settings</h2>
            <p>{published ? 'A published version is live.' : 'This campaign has no published settings yet.'}</p>
            <div className="field-pair">
                <FormInput label="Start date" type="date" value={form.startDate} onChange={update('startDate')} />
                <FormInput label="End date" type="date" min={form.startDate || undefined} value={form.endDate} onChange={update('endDate')} />
            </div>
            <FormInput label="Public announcement" type="textarea" maxLength={1000} value={form.announcement} onChange={update('announcement')} />
            <label className="check-field">
                <input type="checkbox" checked={form.volunteerOpen} onChange={event => setForm(current => ({ ...current, volunteerOpen: event.target.checked }))} />
                Open volunteer registration
            </label>
            <FormInput label="Homepage photo" type="select" value={form.heroImageId} onChange={update('heroImageId')}
                options={images.map(image => ({ value: image.id, label: image.title || 'Untitled image' }))} />
            <fieldset>
                <legend>Verified impact</legend>
                <p>Leave a field blank if its figure is unavailable. Enter 0 for a verified zero.</p>
                <div className="field-pair">
                    {impactFields.map(([key, label]) => <FormInput key={key} label={label} type="number" min="0" step="1"
                        value={form.impact[key] ?? ''} onChange={event => {
                            const value = event.target.value;
                            setForm(current => ({ ...current, impact: { ...current.impact, [key]: value } }));
                        }} />)}
                </div>
            </fieldset>
            <div className="button-row">
                <button className="button button-outline" value="draft" disabled={saving}>Save draft</button>
                <button className="button" value="publish" disabled={saving}>Publish campaign</button>
            </div>
            {message && <p role="status">{message}</p>}
            {error && <p role="alert">{error}</p>}
        </form>
    );
}

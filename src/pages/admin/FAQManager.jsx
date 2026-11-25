import { saveFaq, deleteFaq } from '../../services/faqPublication';
import ReadError from '../../components/common/ReadError';
import React, { useState, useEffect } from 'react';
import { firestoreService, collections } from '../../services/firestore';

const FAQManager = () => {
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState('');
    const [saveError, setSaveError] = useState('');
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [readFailed, setReadFailed] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: '',
        order: ''
    });

    const categories = [
        { value: 'general', label: 'General' },
        { value: 'donations', label: 'Donations' },
        { value: 'volunteering', label: 'Volunteering' },
        { value: 'participation', label: 'Participation' }
    ];

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        setLoading(true);
        setReadFailed(false);
        try {
            const [live, drafts] = await Promise.all([
                firestoreService.getAll(collections.FAQS),
                firestoreService.getAll('faq_drafts')
            ]);
            const entries = new Map(live.map(faq => [faq.id, { ...faq, status: 'Published' }]));
            drafts.forEach(faq => entries.set(faq.id, { ...faq, status: entries.has(faq.id) ? 'Published with draft' : 'Draft' }));
            setFaqs([...entries.values()]);
        } catch (error) {
            setReadFailed(true);
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) return;
        setNotice('');
        setSaveError('');
        const question = formData.question.trim();
        const answer = formData.answer.trim();
        if (!question || !answer) {
            setSaveError('Enter a question and answer.');
            return;
        }
        setSaving(true);
        try {
            const publish = e.nativeEvent.submitter?.value === 'publish';
            await saveFaq({ ...formData, question, answer, order: Number(formData.order) || 0 }, editingFaq, publish);
            setNotice(publish ? 'FAQ published.' : 'FAQ draft saved.');
            resetForm();
            fetchFAQs();
        } catch {
            setSaveError('Could not save the FAQ. Try again.');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setFormData({
            question: '',
            answer: '',
            category: '',
            order: ''
        });
        setEditingFaq(null);
        setShowForm(false);
    };

    const handleEdit = (faq) => {
        setEditingFaq(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            order: faq.order?.toString() || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            await deleteFaq(id);
            setNotice('FAQ removed.');
            fetchFAQs();
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            alert('Failed to delete FAQ: ' + error.message);
        }
    };

    if (readFailed) return <ReadError onRetry={fetchFAQs} />;

    if (loading) {
        return <div>Loading FAQs...</div>;
    }

    return (
        <div className="space-y-6">
            {notice && <p role="status">{notice}</p>}
            {saveError && <p role="alert">{saveError}</p>}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">FAQ Management</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
                >
                    Add New FAQ
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="faq-category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                id="faq-category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="faq-question" className="block text-sm font-medium text-gray-700 mb-1">
                                Question
                            </label>
                            <input
                                type="text"
                                id="faq-question"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="faq-answer" className="block text-sm font-medium text-gray-700 mb-1">
                                Answer
                            </label>
                            <textarea
                                id="faq-answer"
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="faq-order" className="block text-sm font-medium text-gray-700 mb-1">
                                Order
                            </label>
                            <input
                                type="number"
                                id="faq-order"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                                min="0"
                            />
                        </div>

                        <div className="button-row">
                            <button className="button button-outline" type="submit" value="draft" disabled={saving}>Save draft</button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                value="publish"
                                disabled={saving}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Publish FAQ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* FAQs List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Question
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {faqs.map((faq) => (
                            <tr key={faq.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{faq.question}</div>
                                    <p className="text-sm text-gray-600">{faq.status}</p>
                                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">{faq.answer}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 capitalize">
                      {faq.category}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {faq.order || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {faqs.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500">No FAQs found. Add your first FAQ to get started.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FAQManager;
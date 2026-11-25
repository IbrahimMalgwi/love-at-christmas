import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatsCounter from '../components/home/StatsCounter';
import { archiveFlyer } from '../services/galleryArchive';
import useCampaign from '../hooks/useCampaign';
import { firestoreService, collections } from '../services/firestore';

function formatDate(value) {
    if (!value) return null;
    const date = new Date(value + 'T00:00:00Z');
    return Number.isNaN(date.getTime()) ? null :
        new Intl.DateTimeFormat('en-NG', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

export default function HomePage() {
    const { campaign, loading } = useCampaign();
    const [hero, setHero] = useState(null);
    const [recent, setRecent] = useState({ loading: true, images: [] });
    const heroId = campaign?.heroImageId;
    const startDate = formatDate(campaign?.startDate);
    const endDate = formatDate(campaign?.endDate);
    const highlights = recent.images.length ? recent.images : recent.loading ? [] : [archiveFlyer];

    useEffect(() => {
        let active = true;
        firestoreService.getAll(collections.GALLERY_IMAGES, 'createdAt', 'desc', 3).then(images => {
            if (active) setRecent({ images: images.filter(image => image.image_url && image.is_active !== false) });
        }).catch(() => { if (active) setRecent({ images: [] }); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        setHero(null);
        if (!heroId) return;
        let active = true;
        firestoreService.getById(collections.GALLERY_IMAGES, heroId).then(image => {
            if (active && image?.image_url && image.is_active !== false) setHero(image);
        }).catch(() => {});
        return () => { active = false; };
    }, [heroId]);

    return (
        <>
            <section className="hero-section">
                <div className="site-wrap hero">
                    <div className="hero-copy">
                        <p className="eyebrow">Foursquare Gospel Church Sabo</p>
                        <h1>Love at<br /><em>Christmas.</em></h1>
                        <p>A Christmas outreach bringing essential items and the love of Christ to families in our community.</p>
                        {startDate && <p className="campaign-date">
                            <time dateTime={campaign.startDate}>{startDate}</time>
                            {endDate && endDate !== startDate && <> – <time dateTime={campaign.endDate}>{endDate}</time></>}
                        </p>}
                        <div className="button-row">
                            <Link className="button" to="/donate">Make a donation</Link>
                            <Link className="button button-outline" to="/register">Register</Link>
                        </div>
                    </div>
                    <div className="hero-visual">
                        {hero ? <figure className="hero-photo">
                            <img src={hero.image_url} alt={hero.alt_text || hero.title || 'Love at Christmas outreach'} onError={() => setHero(null)} />
                            {hero.description && <figcaption>{hero.description}</figcaption>}
                        </figure> : <div className="hero-art" aria-hidden="true">
                            <img
                                src={process.env.PUBLIC_URL + '/images/christmas-parcels.webp'}
                                srcSet={`${process.env.PUBLIC_URL}/images/christmas-parcels-small.webp 640w, ${process.env.PUBLIC_URL}/images/christmas-parcels.webp 1200w`}
                                sizes="(max-width: 768px) calc(100vw - 3rem), (max-width: 1200px) 50vw, 590px"
                                alt=""
                                width="1200"
                                height="900"
                                fetchPriority="high"
                            />
                        </div>}
                    </div>
                </div>
            </section>
            {campaign?.announcement && <aside className="site-wrap campaign-notice">
                <h2>Campaign update</h2><p>{campaign.announcement}</p>
            </aside>}
            <section className="mission-section">
                <div className="site-wrap mission-layout">
                    <div>
                        <p className="eyebrow">Our mission</p>
                        <h2>Share the love<br className="mission-break" /> of Christ.</h2>
                    </div>
                    <p>We provide essential items, warm clothing and nutritious food to families in need. Through gifts, fellowship and prayer, we share the hope and joy of Christmas with our community.</p>
                </div>
            </section>
            <section className="site-wrap section-spacing participation-section">
                <p className="eyebrow">Get involved</p><h2>Be part of the outreach.</h2>
                <div className="participation-grid">
                    <article className="surface participation-card">
                        <h3>Give this Christmas</h3>
                        <p>Help provide essential items to families this Christmas.</p>
                        <Link to="/donate" className="text-link">Donation details</Link>
                    </article>
                    <article className="surface participation-card">
                        <h3>Take part in the outreach</h3>
                        <p>Sign up to receive a Christmas package and see whether volunteer registration is open.</p>
                        <Link to="/register" className="text-link">Registration options</Link>
                    </article>
                </div>
            </section>
            <StatsCounter impact={campaign?.impact} loading={loading} />
            <section className="site-wrap section-spacing home-gallery">
                <div className="section-heading"><div><p className="eyebrow">Gallery</p><h2>From the outreach.</h2></div><Link to="/gallery" className="text-link">View gallery</Link></div>
                {highlights.length ? <div className={highlights.length === 1 ? 'photo-grid photo-grid-featured' : 'photo-grid'}>{highlights.map(image => <figure className="photo-card" key={image.id}>
                    <img loading="lazy" src={image.image_url} className={image.id === archiveFlyer.id ? 'archive-image' : undefined} alt={image.alt_text || image.title || 'Love at Christmas outreach'} />
                    <figcaption><strong>{image.title}</strong>{image.id === archiveFlyer.id && <p>{image.description}</p>}</figcaption>
                </figure>)}</div> : <p role="status">{recent.loading ? 'Loading photos…' : 'Outreach photos will appear here when they are published.'}</p>}
            </section>
        </>
    );
}

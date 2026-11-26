import { useEffect, useState } from 'react';
import { subscribeToCampaign } from '../services/campaign';

export default function useCampaign() {
    const [state, setState] = useState({ campaign: null, loading: true, error: false });
    useEffect(() => subscribeToCampaign(
        campaign => setState({ campaign, loading: false, error: false }),
        () => setState({ campaign: null, loading: false, error: true })
    ), []);
    return state;
}

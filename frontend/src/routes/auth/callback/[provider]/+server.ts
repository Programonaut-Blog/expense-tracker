import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({locals, url, cookies}) => {
    const provider = JSON.parse(cookies.get('provider') || '{}');
    console.log(provider);
    

    if (provider.state !== url.searchParams.get('state')) {
        throw new Error('State parameters don\'t match');
    }

    try {
        const res = await locals.pb.collection('users').authWithOAuth2Code(
            provider.name,
            url.searchParams.get('code') || '',
            provider.codeVerifier,
            env.REDIRECT_URL + provider.name
        )        
    } catch (error) {
        console.error(error);
        return redirect(303, '/login?fail=true');
    }

    throw redirect(303, '/login');
};
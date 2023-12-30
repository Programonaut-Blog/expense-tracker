import { fail, redirect, type RequestHandler } from '@sveltejs/kit';
import type { ClientResponseError, LocalAuthStore } from 'pocketbase';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load = (async ({locals, url}) => {
    console.log(locals.pb.authStore);
           
    if (locals.pb.authStore.model) {
        // return redirect(303, '/dashboard')
    }

    const authMethods = await locals.pb.collection('users').listAuthMethods();
    const fail = url.searchParams.get('fail') === 'true';

    return {providers: authMethods.authProviders, fail};
}) satisfies PageServerLoad;

export const actions = {
    register: async ({ locals, request }) => {
		const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');
        
        if (!email || !password) {
            return fail(400, { emailRequired: email === null, passwordRequired: password === null });
        }
		
        data.set('passwordConfirm', password?.toString())        
		try {
			await locals.pb.collection('users').create(data);
			await locals.pb.collection('users').authWithPassword(email, password.toString());
			await locals.pb.collection('users').requestVerification(email);
		} catch (error) {
			const errorObj = error as ClientResponseError;
            return fail(500, {fail: true, message: errorObj.data.message});
        } 
		
		throw redirect(303, '/dashboard');
	},
    login: async ({ locals, request }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');
        
        if (!email || !password) {
            return fail(400, { emailRequired: email === null, passwordRequired: password === null });
        }

        try {
            await locals.pb.collection('users').authWithPassword(email.toString(), password.toString());
        } catch (error) {
            const errorObj = error as ClientResponseError;
            return fail(500, {fail: true, message: errorObj.data.message});
        }

        throw redirect(303, '/dashboard');
    },
    reset: async ({ locals, request }) => {
        const data = await request.formData();
        const email = data.get('email');
        
        if (!email) {
            return fail(400, { emailRequired: email === null });
        }

        try {
            await locals.pb.collection('users').requestPasswordReset(email.toString());
        } catch (error) {
            const errorObj = error as ClientResponseError;
            return fail(500, {fail: true, message: errorObj.data.message});
        }
        throw redirect(303, '/login');
    },
    google: async ({ locals, cookies }) => {
        const provider = (await locals.pb.collection('users').listAuthMethods()).authProviders.find((p: any) => p.name === 'google');
        cookies.set('provider', JSON.stringify(provider), {httpOnly: true, path: `/auth/callback/google`});

        throw redirect(303, provider.authUrl + env.REDIRECT_URL + provider.name);
    },
    logout: async ({ locals }) => {
        await locals.pb.authStore.clear();
        throw redirect(303, '/login');
    }
}
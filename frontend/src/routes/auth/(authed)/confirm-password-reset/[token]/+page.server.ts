import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { serializeNonPOJOs } from "$lib/utils";

export const load: PageServerLoad = async ({params, locals, url}) => {
    const token = params.token;
    const resend = url.searchParams.has('resend');
    const hasSuccess = url.searchParams.has('success');
    const success = url.searchParams.get('success') === 'true';

    if (resend) {
        return {resend, success, token}
    } else if (hasSuccess) {
        return {success, token}
    }

    return { token }
};

export const actions: Actions = {
    confirmPasswordReset: async ({ locals, request }) => {
        const data = await request.formData();
        const token = data.get('token') as string;
        const password = data.get('password') as string;

        try {
            await locals.pb.collection('users').confirmPasswordReset(token, password, password);
        } catch (error) {
            console.error(error);
            return redirect(300, `?success=false`)
        }

        return redirect(300, `?success=true`)
    },
    resendPasswordReset: async ({ locals, request }) => {
        const data = await request.formData();
        const email = data.get('email') as string;

        try {
            await locals.pb.collection('users').requestPasswordReset(email);
        } catch (error) {
            console.error(error);
            return redirect(300, `?success=false&resend`)
        }

        return redirect(300, `?success=true&resend`)
    },
};
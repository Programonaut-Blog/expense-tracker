import { serializeNonPOJOs } from '$lib/utils';
import type { AuthModel } from 'pocketbase';
import type { LayoutServerLoad } from './$types';

export const load = (async ({locals}) => {
    const user = locals.pb.authStore.model;
    return {user: serializeNonPOJOs(user)} as {user: AuthModel};
}) satisfies LayoutServerLoad;
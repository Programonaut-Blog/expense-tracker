import { serializeNonPOJOs } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

export const load = (async ({locals}) => {
    const user = locals.pb.authStore.model;
    return {user: serializeNonPOJOs(user)};
}) satisfies LayoutServerLoad;
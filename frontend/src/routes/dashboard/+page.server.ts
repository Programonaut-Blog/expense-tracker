import { serializeNonPOJOs } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    const user = locals.pb.authStore.model;

    return {user: serializeNonPOJOs(user)};
}) satisfies PageServerLoad;
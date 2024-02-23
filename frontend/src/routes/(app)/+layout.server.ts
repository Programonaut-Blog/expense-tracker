import type { UsersResponse } from '$lib/types/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

export const load = (async ({locals}) => {
    const user = locals.pb.authStore.model as UsersResponse;
    if (user.avatar) {        
        user.avatar = await locals.pb.files.getUrl(user, user.avatar, {'thumb': '100x100'});
    }

    return {user: serializeNonPOJOs(user) as UsersResponse};
}) satisfies LayoutServerLoad;
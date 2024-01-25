import type { CategoriesRecord, CategoriesResponse, ExpensesRecord, ExpensesResponse } from '$lib/types/pocketbase';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const categories = await locals.pb.collection('categories').getFullList<CategoriesResponse>();
    const expensesWithCategory = await locals.pb.collection('expenses').getFullList<ExpensesResponse<{category: CategoriesResponse}>>({expand: 'category'});

    const expensesWithCategoryAndImages = expensesWithCategory.map((expense) => {
        let icon = expense.expand?.category?.icon
        if (icon) {
            expense.expand!.category!.icon = locals.pb.files.getUrl(expense.expand?.category!, icon, {'thumb': '100x100'});
        }

        return expense;
    });

    return {expenses: expensesWithCategoryAndImages, categories};
}) satisfies PageServerLoad;

export const actions = {
    create: async ({ locals, request }) => {
        const data = await request.formData();
        data.append("currency", "€")

        const hasLabel = data.has('label');
        const hasAmount = data.has('amount');
        const hasCategory = data.has('category');
        if (!hasLabel || !hasAmount || !hasCategory) {
            return fail(400, {hasLabel, hasAmount, hasCategory})
        }

        try {
            await locals.pb.collection('expenses').create<ExpensesRecord>(data)
        } catch(e) {
            console.log(e);
            return fail(400, {unknown: true})
        }

        return { success: true, create: true }
    },
    update: async ({ locals, request }) => {
        const data = await request.formData();
        data.append("currency", "€")

        const hasId = data.has('id');
        const hasLabel = data.has('label');
        const hasAmount = data.has('amount');
        const hasCategory = data.has('category');
        if (!hasId || !hasLabel || !hasAmount || !hasCategory) {
            return fail(400, {hasId, hasLabel, hasAmount, hasCategory})
        }

        try {
            await locals.pb.collection('expenses').update<ExpensesRecord>(data.get('id')!.toString(), data)
        } catch(e) {
            console.log(e);
            return fail(400, {unknown: true})
        }

        return { success: true, update: true }
    },
    delete: async ({locals, request}) => {
        console.log("Delete");
        
        const data = await request.formData();

        const hasId = data.has('id');
        if (!hasId) {
            return fail(400, {hasId})
        }

        try {
            await locals.pb.collection('expenses').delete(data.get('id')!.toString())
        } catch(e) {
            console.log(e);
            return fail(400, {unknown: true})
        }

        return { success: true, update: true }
    }
}
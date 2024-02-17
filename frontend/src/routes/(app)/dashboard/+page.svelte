<script lang="ts">
	import { getModalStore, getToastStore, type ModalSettings, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { onDestroy, onMount } from 'svelte';
    import PocketBase from 'pocketbase';
	import { env } from '$env/dynamic/public';
	import type { CategoriesResponse, ExpensesResponse } from '$lib/types/pocketbase';
	import PieChart from '$lib/components/PieChart.svelte';
	import type { ChartData } from 'chart.js';

	export let data: PageData;
    const modalStore = getModalStore();

    const categories = data.categories;

    const addExpenseModal: ModalSettings = {
        type: 'component',
        component: 'addExpenseModal',
        title: 'Add Expense',
        body: 'Add a negativ value for an expense and a positive value for an income.',
        meta: {
            user: data.user.id,
            action: '?/create',
            categories,
        }
    };

    const updateExpenseModal = (id: string, label: string, amount: number) => ({
        type: 'component',
        component: 'addExpenseModal',
        title: 'Update Expense',
        body: 'Add a negativ value for an expense and a positive value for an income.',
        meta: {
            user: data.user.id,
            action: '?/update',
            id,
            label,
            amount,
            categories
        }
    } satisfies ModalSettings);

    const toastStore = getToastStore();
    const successfullyDeletedToast = (label: string) => ({
        message: `The expense "${label}" was deleted successfully.`,
        background: 'variant-filled-success',
    } satisfies ToastSettings);
    const failureToast = {
        message: 'Something went wrong. Please try again.',
        background: 'variant-filled-error',
    }

    let editExpenses: boolean = false;

    let pb: PocketBase;
    onMount(async () => {
        // use client side pocketbase for subscriptions
        pb = new PocketBase(env.PUBLIC_PB_URL);
        pb.authStore?.loadFromCookie(document.cookie || '')
        
        pb.collection('expenses').subscribe<ExpensesResponse<{ category: CategoriesResponse; }>>('*', function (e) {
            switch (e.action) {
                case 'create':
                    let icon = e.record.expand?.category?.icon
                    if (icon) {
                        const url = pb.files.getUrl(e.record.expand?.category!, icon, {'thumb': '100x100'});
                        e.record.expand!.category!.icon = url;
                    }
                    data.expenses = [...data.expenses, e.record];
                    break;
                case 'update':
                    data.expenses = data.expenses.map((expense) => {
                        if (expense.id === e.record.id) {
                            let icon = e.record.expand?.category?.icon
                            if (icon) {
                                const url = pb.files.getUrl(e.record.expand?.category!, icon, {'thumb': '100x100'});
                                e.record.expand!.category!.icon = url;
                            }
                            
                            return e.record;
                        }
                        return expense;
                    });
                    break;
                case 'delete':
                    data.expenses = data.expenses.filter((expense) => expense.id !== e.record.id);
                    break;
            }
        }, { expand: "category" });
    });

    onDestroy(()=>{
        // destroy client when component is destroyed
        pb?.authStore?.clear()
    })

    $: formattedExpenses = ((): ChartData<'pie', number[], unknown> => {
        // labels
        let labels = [...(new Set(data.expenses.map((expense) => expense.expand ? expense.expand.category.name : "Other")))];
        labels = labels.map((label) => label.charAt(0).toUpperCase() + label.slice(1));

        // data to label
        let dataToLabel = new Array(labels.length).fill(0);
        data.expenses.forEach((expense) => {
            let label = expense.expand ? expense.expand.category.name : "Other";
            let index = labels.indexOf(label.charAt(0).toUpperCase() + label.slice(1));
            dataToLabel[index] += expense.expense;
        });

        // color to label
        let backgroundColor = new Array(labels.length).fill('');
        dataToLabel.forEach((_, index) => {
            backgroundColor[index] = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Expenses in €',
                    data: dataToLabel,
                    backgroundColor
                },
            ]
        }
    })()
</script>

<div class="grid grid-cols-5 h-full max-h-full">
	<div class="col-span-2">
        <div class="w-full h-full p-16">
            <PieChart data={formattedExpenses} />
        </div>
    </div>
	<div class="col-span-3 border-l border-surface-900-50-token p-6 flex flex-col gap-8 h-full">
		<ul class="list w-full p-2 overflow-y-auto flex-[1_1_0]">
			{#each data.expenses as expense}
				<li class="flex">
					<div class="flex-1 flex items-center p-4 card card-hover gap-4 rounded-token">
                        <span
                            ><img src={expense.expand?.category.icon} alt="category icon" class="w-8 h-8" /></span
                        >
                        <span class="flex-auto">{expense.label}</span>
                        <span
                            class={expense.expense && expense.expense >= 0 ? 'text-success-500' : 'text-error-500'}
                            >{expense.expense} {expense.currency}</span
                        >
                    </div>
                    {#if editExpenses}
                    <button type="button" class="btn-icon variant-filled-primary" on:click={() => modalStore.trigger(updateExpenseModal(expense.id, expense.label, expense.expense))}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>                          
                    </button>
                    <form action="?/delete" method="POST" use:enhance={() => {
                        return async ({ result, update }) => {
                            if (result.type === 'success') {
                                toastStore.trigger(successfullyDeletedToast(expense.label));
                            } else {
                                toastStore.trigger(failureToast);
                            }
                            update();
                        }
                    }}>
                        <input type="hidden" name="id" value={expense.id} />
                        <button type="submit" class="btn-icon variant-filled-error">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                        </button>
                    </form>
                    {/if}
				</li>
			{/each}
		</ul>

		<div class="flex gap-8 w-full">
            {#if !editExpenses}
			<button class="btn variant-filled flex-1" on:click={() => modalStore.trigger(addExpenseModal)}>
                Add expense
            </button>
            {/if}
			<button class="btn variant-filled flex-1" on:click={() => editExpenses = !editExpenses}>{!editExpenses ? "Edit expenses" : "Cancel"}</button>
		</div>
	</div>
</div>

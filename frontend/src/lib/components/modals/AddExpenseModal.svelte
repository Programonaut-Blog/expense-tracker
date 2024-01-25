<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';

	export let parent: SvelteComponent;
	const modalStore = getModalStore();
	
	const categories = $modalStore[0].meta.categories ?? [];
	const formData = {
		id: $modalStore[0].meta.id ?? '',
		user: $modalStore[0].meta.user ?? '',
		label: $modalStore[0].meta.label ?? '',
		amount: $modalStore[0].meta.amount ?? 0,
	};

    const toastStore = getToastStore();
	const successToast = (create: unknown) => ({
        message: `The expense was ${create ? 'created' : 'updated'} successfully.`,
        background: 'variant-filled-success',
    } satisfies ToastSettings);
	const failureToast = {
		message: 'Something went wrong. Please try again.',
		background: 'variant-filled-error',
	}
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<header class="text-2xl font-bold">{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="border border-surface-500 p-4 space-y-4 rounded-container-token" method="POST" action={$modalStore[0].meta.action} use:enhance={()=>{
			return async ({ result, update }) => {
				console.log(result);
				
				if (result.type === 'success') {
					toastStore.trigger(successToast(result.data?.create));
					modalStore.close();
				} else {
					toastStore.trigger(failureToast);
				}
				update();
			}
		}}>
			{#if formData.id}
				<input type="hidden" name="id" value={formData.id} />
			{/if}
			<input type="hidden" name="user" value={formData.user} />
			<label class="label">
				<span>Label:</span>
				<input class="input" name="label" type="text" bind:value={formData.label} placeholder="Enter label..." required />
			</label>
			<label class="label">
				<span>Amount:</span>
				<input class="input" name="amount" type="number" bind:value={formData.amount} placeholder="Enter amount..." required />
			</label>
			<label class="label">
				<span>Category:</span>
				<select class="select" name="category">
					{#if categories}
					{#each categories as category}
						<option value={category.id}>{category.name}</option>
					{/each}
					{/if}
				</select>
			</label>
			<footer class="modal-footer {parent.regionFooter}">
				<button class="btn {parent.buttonNeutral}" type="button" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
				<button class="btn {parent.buttonPositive}" type="submit">Submit</button>
			</footer>
		</form>
	</div>
{/if}
<script lang="ts">
	import { modalRegistry } from '$lib/components/modals/modalRegistry';
	import '../app.postcss';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { Modal, Toast, storePopup } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();
</script>

<Toast position="br" zIndex="z-[999]" />
<Modal components={modalRegistry} zIndex="z-[888]"/>
<slot />

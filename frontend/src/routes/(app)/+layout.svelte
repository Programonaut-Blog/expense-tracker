<script lang="ts">
    import { AppBar, AppShell, Avatar, type PopupSettings, popup } from '@skeletonlabs/skeleton';
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
    let avatar = data.user.avatar || 'https://ui-avatars.com/api/?name=' + data.user.email;

    const popupClick: PopupSettings = {
        event: 'click',
        target: 'popupClick',
        placement: 'bottom-end',
    };
</script>


<AppShell>
    <svelte:fragment slot="header">
		<AppBar slotTrail="relative">
            <svelte:fragment slot="lead">💵</svelte:fragment>
            <svelte:fragment slot="trail">
                <button use:popup={popupClick}>
                    <span class="sr-only">Your profile</span>
                    <Avatar
                        src="{avatar}"
                        class="!w-10 !h-10"
                        border="border-2 border-surface-300-600-token hover:!border-primary-500"
                        cursor="cursor-pointer"
                    />
                </button>

                <div
                    data-popup="popupClick"
                >
                    <div 
                        class="btn-group-vertical variant-filled"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                    >
                        <a
                            href="/settings"
                            role="menuitem"
                            class="w-full"
                        >
                            Settings
                        </a>
                        <form action="/login?/logout" method="post" class="w-full">
                            <button
                                type="submit"
                                role="menuitem"
                                class="w-full"
                            >
                                Log Out
                            </button>
                        </form>
                    </div>
                </div>
            </svelte:fragment>
        </AppBar>
	</svelte:fragment>

    <slot />
</AppShell>
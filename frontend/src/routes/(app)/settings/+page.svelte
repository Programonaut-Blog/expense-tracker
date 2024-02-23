<script lang="ts">
    import type { PageData } from './$types';
    import { FileButton } from '@skeletonlabs/skeleton';

    export let data: PageData;

    let avatarFiles: FileList;
    let email: string = data.user.email;
    let oldPassword: string;
    let password: string;

    $: changes = avatarFiles?.length > 0 || email !== data.user.email || oldPassword && password;   
</script>

<form class="h-full w-full" method="POST" enctype="multipart/form-data">
    <div class="h-full flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm gap-2">
        <label class="label" for="avatar">
            <span>Avatar:</span>
            <FileButton name="avatar" bind:files={avatarFiles}>Upload</FileButton>
        </label>

        <label class="label">
            <span>Email:</span>
            <input class="input" type="email" placeholder="mail@example.com" bind:value={email} />
        </label>
        <label class="label">
            <span>Old password:</span>
            <input class="input" name="oldPassword" type="password" placeholder="*****" bind:value={oldPassword} />
        </label>
        <label class="label">
            <span>Password:</span>
            <input class="input" name="password" type="password" placeholder="*****" bind:value={password}/>
            <input type="hidden" name="passwordConfirm" class="input" placeholder="*****" bind:value={password} />
        </label>
    </div>
    {#if changes}
    <footer class="fixed left-0 bottom-0 h-16 w-full bg-surface-900 flex flex-row drop-shadow p-2">
        <button class="ml-auto btn variant-filled-primary" type="submit">Save</button>
    </footer>
    {/if}
</form>
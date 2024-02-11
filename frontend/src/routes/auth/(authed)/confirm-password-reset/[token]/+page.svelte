<script lang="ts">
	import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    
    export let data: PageData;    
</script>

{#if !Object.keys(data).includes('success')}
<aside class="alert variant-ghost-success">
    <div class="alert-message">
        <h3 class="h3">Change your password</h3>
        <p>Enter your new password and click on "Update password"!</p>
        <hr class="my-2 !border-t-surface-50"/>
        <form action="?/confirmPasswordReset" method="post" use:enhance>
            <input name="token" type="hidden" value={data.token} />
            <input name="password" type="password" class="input variant-filled my-2" />
            <button type="submit" class="btn variant-filled">Update password</button>
        </form>
    </div>
</aside>
{:else if data.success}
<aside class="alert variant-ghost-success">
    <div class="alert-message">
        <h3 class="h3">Change your password</h3>
        <p>{!data.resend ? "You successfully updated your password!" : "Update password requested successfully! Please check your emails."}</p>
        {#if !data.resend}
        <a href="/login" class="btn variant-filled">Go back to login</a>
        {/if}
    </div>
</aside>
{:else}
    <aside class="alert variant-ghost-error">
        <div class="alert-message">
            <h3 class="h3">Change your password</h3>
            <p>{!data.resend ? "Invalid Token! Please enter your email and try again." : "Failed to request update password! Please try again."}</p>
            <hr class="my-2 !border-t-surface-50"/>
            <form action="?/resendPasswordReset" method="post" use:enhance>
                <input name="email" class="input variant-filled my-2" value={data.user?.email || ""}  />
                <button type="submit" class="btn variant-filled">Request update password</button>
            </form>
        </div>
    </aside>
{/if}
<script lang="ts">
	import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>


{#if data.success}
    <aside class="alert variant-ghost-success">
        <div class="alert-message">
            <h3 class="h3">Success</h3>
            <p>{!data.resend ? "Verification successful!" : "Verification email resent successfully!"}</p>
        </div>
    </aside>
{:else}
    <aside class="alert variant-ghost-error">
        <div class="alert-message">
            <h3 class="h3">Error</h3>
            <p>{!data.resend ? "Verification failed!" : "Failed to resend verification email!"}</p>
            <hr class="my-2"/>
            <form action="?/resendVerification" method="post" use:enhance>
                <input name="email" class="input variant-filled my-2" />
                <button type="submit" class="btn variant-filled">Resend verification email</button>
            </form>
        </div>
    </aside>
{/if}
            
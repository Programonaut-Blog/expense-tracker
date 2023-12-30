<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<p>{data.user.email}</p>
<form action="/login?/logout" method="post">
	<button class="btn variant-filled">Log Out</button>
</form>
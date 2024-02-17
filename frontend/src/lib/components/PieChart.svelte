<script lang="ts">
	import { Pie } from 'svelte-chartjs';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		type ChartData
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	export let data: ChartData<'pie', number[], unknown>;
</script>

<Pie {data} options={{borderColor: "#363f5d", color: "white"}} />

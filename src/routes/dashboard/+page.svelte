<script lang="ts">
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import { onMount } from 'svelte';
	import { Store } from '$lib/stores/session-store';
	let fullname = 'Operator';

	onMount(() => {
		const stored =
			localStorage.getItem('fullname') ||
			((): string | null => {
				const s = Store.fetchData<any>('fullname');
				return typeof s === 'string' && s ? s : null;
			})();
		if (stored) fullname = stored;
		else {
			const savedUser =
				localStorage.getItem('username') ||
				((): string | null => {
					const s = Store.fetchData<any>('username');
					return typeof s === 'string' && s ? s : null;
				})();
			if (savedUser) fullname = savedUser;
		}
	});
	//-- Dashboard cards configuration --
	const dashboardCards = [
		{
			title: 'Operator Account',
			description: 'Manage operator accounts',
			icon: 'bi bi-person-fill',
			color: '#1E63E9',
			href: '/operator-account'
		},
		{
			title: 'Operator Role Management',
			description: 'Manage operator roles',
			icon: 'bi bi-shield-lock-fill',
			color: '#22C55E',
			href: '/operator-role'
		},
		{
			title: 'Company Vehicles',
			description: 'Manage company vehicles',
			icon: 'bi bi-bus-front-fill',
			color: '#6366F1',
			href: '/vehicles'
		},
		{
			title: 'Local Fare',
			description: 'Manage fare structures',
			icon: 'bi bi-currency-rupee',
			color: '#A855F7',
			href: '/local-fare'
		},
		{
			title: 'Service Routes',
			description: 'Manage service routes',
			icon: 'bi bi-geo-alt-fill',
			color: '#F59E0B',
			href: '/service-route'
		},
		{
			title: 'Services',
			description: 'Manage services',
			icon: 'bi bi-person-badge-fill',
			color: '#F87171',
			href: '/company-services'
		},
		{
			title: 'Reports',
			description: 'View operational reports',
			icon: 'bi bi-bar-chart-fill',
			color: '#3B82F6',
			href: '/service-report'
		}
	];
</script>

<div class="page-wrapper d-flex flex-column min-vh-100">
	<!-- Header already has container-xl inside -->
	<div class="sticky-top">
		<HeaderBar />
	</div>

	<!-- USE ONLY ONE container-xl -->
	<div class="container-xl">
		<main class="dashboard-container py-4">
			<section class="dashboard-content">
				<div class="row">
					<div class="col-12 col-md-8 col-lg-7 col-xl-6 mt-4 dashboard-header">
						<h2 class="fw-inter-700">Welcome back, {fullname}!</h2>
						<p>Manage your company dashboard and business operations from here.</p>
					</div>
				</div>

				<div class="row g-3 g-md-4 mt-2">
					{#each dashboardCards as card}
						<div class="col-6 col-md-4 col-lg-3">
							<DashboardCard {...card} />
						</div>
					{/each}
				</div>
			</section>
		</main>
	</div>
</div>

<style>
	.page-wrapper {
		background: var(--bg-primary);
	}

	.dashboard-content {
		padding: 0;
	}

	.dashboard-header h2 {
		color: var(--text-primary);
	}
	.dashboard-header p {
		color: var(--text-muted);
	}
	@media (max-width: 1200px) {
		.dashboard-content {
			padding: 1rem 1.5rem;
		}
	}
</style>

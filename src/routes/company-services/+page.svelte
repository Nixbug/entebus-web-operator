<script lang="ts">
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';
	import ListingPageHeader from '$lib/components/ListingPageHeader.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import ColumnSelector from '$lib/components/ColumnSelector.svelte';
	import DataTable from '$lib/components/ListingTable.svelte';
	import {
		getInitialVisibleColumns,
		utcToIstFormat,
		mapServiceTicketModeToLabel,
		mapServiceStatusToLabel,
		utcToIstRelativeFormat
	} from '$lib/helpers';
	import FloatingAddButton from '$lib/components/FloatingAddButton.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { Service } from '$lib/types/type';
	import EmptyData from '$lib/components/EmptyData.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { fetchServiceList } from '$lib/services/company-services';
	import { handleApiError } from '$lib/utils/api-error';
	import toast from '$lib/utils/toast';
	import { onMount } from 'svelte';
	import {
		SERVICE_TICKET_MODE_FILTER_OPTIONS,
		SERVICE_STATUS_FILTER_OPTIONS,
		SERVICE_STATUS_VALUE_BY_LABEL,
		SERVICE_TICKET_MODE_VALUE_BY_LABEL
	} from '$lib/constants';
	import { canCreateService } from '$lib/utils/permissions';
	import DateFilterComponent from '$lib/components/DateFilterComponent.svelte';

	const canCreate = canCreateService();

	//-- IST date helpers --
	function todayIst(): string {
		const now = new Date();
		const ist = new Date(now.getTime() + (5 * 60 + 30) * 60_000);
		return `${ist.getUTCFullYear()}-${String(ist.getUTCMonth() + 1).padStart(2, '0')}-${String(ist.getUTCDate()).padStart(2, '0')}`;
	}
	function toUtcStartOfIstDay(date: string): string {
		return new Date(`${date}T00:00:00+05:30`).toISOString();
	}
	function toUtcEndOfIstDay(date: string): string {
		return new Date(`${date}T23:59:59+05:30`).toISOString();
	}

	//-- Date range state — restored from URL params or default: today --
	const _urlParams = get(page).url.searchParams;
	let fromDate = _urlParams.get('from') ?? todayIst();
	let toDate = _urlParams.get('to') ?? todayIst();

	//-- Pagination setup --
	let currentPage = 1;
	let itemsPerPage = 10;
	let hasNextPage = false;
	let requestId = 0;

	let formattedServices: Service[] = [];
	let loading = false;
	let totalItems = 0;

	//-- Core data fetching function --
	async function fetchServices() {
		const currentRequestId = ++requestId;
		loading = true;
		hasNextPage = false;
		totalItems = 0;
		try {
			const statusFilter =
				activeFilters.status && !String(activeFilters.status).toLowerCase().startsWith('all')
					? SERVICE_STATUS_VALUE_BY_LABEL[String(activeFilters.status)]
					: undefined;
			const ticketModeFilter =
				activeFilters.ticketMode &&
				!String(activeFilters.ticketMode).toLowerCase().startsWith('all')
					? SERVICE_TICKET_MODE_VALUE_BY_LABEL[String(activeFilters.ticketMode)]
					: undefined;
			const data = await fetchServiceList({
				search: searchTerm || undefined,
				status: statusFilter,
				ticket_mode: ticketModeFilter,
				limit: itemsPerPage,
				offset: (currentPage - 1) * itemsPerPage,
				starting_at_ge: fromDate ? toUtcStartOfIstDay(fromDate) : undefined,
				starting_at_le: toDate ? toUtcEndOfIstDay(toDate) : undefined,
				order_by: 'starting_at',
				order_in: 'desc'
			});

			if (currentRequestId !== requestId) return;

			formattedServices = (data as any[]).map(
				(service) =>
					({
						...service,
						id: service.id ? `SERVICE-${service.id}` : '',
						apiId: service.id ?? null,
						statusLabel: mapServiceStatusToLabel(service.status),
						ticketModeLabel: mapServiceTicketModeToLabel(service.ticket_mode),
						startingAt: utcToIstRelativeFormat(service.starting_at ?? service.startingAt ?? ''),
						createdAt: utcToIstFormat(service.created_on ?? service.createdAt ?? ''),
						updatedAt: utcToIstFormat(service.updated_on ?? service.updatedAt ?? '')
					}) as Service
			);

			if (Array.isArray(data)) {
				const fetchedCount = (currentPage - 1) * itemsPerPage + data.length;
				if (data.length === 0 && currentPage > 1) {
					currentPage = Math.max(1, currentPage - 1);
					return await fetchServices();
				}
				hasNextPage = data.length === itemsPerPage;
				totalItems = hasNextPage ? fetchedCount + 1 : fetchedCount;
			} else {
				totalItems = 0;
				hasNextPage = false;
			}
		} catch (err: any) {
			if (currentRequestId !== requestId) return; //-- stale error, discard --
			formattedServices = [];
			totalItems = 0;
			hasNextPage = false;
			const message = await handleApiError(err);
			toast.error(message || 'Failed to fetch services.');
		} finally {
			if (currentRequestId === requestId) loading = false;
		}
	}

	onMount(() => {
		fetchServices();
	});

	function handlePageChange(p: number) {
		currentPage = p;
		fetchServices();
	}

	//-- Search/Filter setup --
	let searchTerm = '';
	let activeFilters: Record<string, string> = {};
	const filters = [
		{
			label: 'Ticket Mode',
			key: 'ticketMode',
			options: SERVICE_TICKET_MODE_FILTER_OPTIONS
		},
		{
			label: 'Status',
			key: 'status',
			options: SERVICE_STATUS_FILTER_OPTIONS
		}
	];

	//-- Handle search/filter updates --
	async function handleSearchUpdate(event: CustomEvent) {
		searchTerm = event.detail.searchTerm;
		activeFilters = event.detail?.activeFilters ?? {};
		currentPage = 1;
		await fetchServices();
	}

	//-- Column Selector setup --
	const defaultColumns = [
		{ key: 'id', label: 'ID' },
		{ key: 'name', label: 'Name' },
		{ key: 'startingAt', label: 'Starting Time' },
		{ key: 'statusLabel', label: 'Status', isChip: true },
		{ key: 'ticketModeLabel', label: 'Ticket Mode', isChip: true }
	];
	const optionalColumns = [
		{ key: 'createdAt', label: 'Created At' },
		{ key: 'updatedAt', label: 'Updated At' }
	];

	//-- Start with only default columns visible, no optional ones --
	let visibleColumns = getInitialVisibleColumns(defaultColumns, optionalColumns, []);
	$: displayedColumns = [...defaultColumns, ...optionalColumns].filter((col) =>
		visibleColumns.includes(col.key)
	);

	function handleColumnChange(selectedOptionalColumns: string[]) {
		visibleColumns = [...defaultColumns.map((c) => c.key), ...selectedOptionalColumns];
	}

	//-- Navigation to service creation --
	function handleAddService() {
		goto(`/company-services/create`);
	}

	//-- Navigation to service detail page --
	function handleShowDetailPage(service: Service) {
		if (!service?.apiId) return;
		const query = new URLSearchParams({
			id: String(service.apiId),
			from_date: String(fromDate),
			to_date: String(toDate)
		});
		goto(`/company-services/detail?${query.toString()}`);
	}
</script>

<!-- LAYOUT -->
<div class="main-div d-flex flex-column min-vh-100">
	{#if loading}
		<div class="spinner-overlay">
			<div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
	{/if}
	<div class="d-flex flex-column">
		<div class="sticky-top">
			<HeaderBar />
		</div>
		<main class="container-xl py-5 page-wrapper">
			<!-- HOME BUTTON -->
			<HomeButton icon="bi bi-arrow-left" ariaLabel="Back" to="/dashboard" preserveQuery={false} />
			<!-- PAGE HEADER -->
			<ListingPageHeader
				title="Service Management"
				subtitle="Define and manage all services in the system."
				buttonLabel="Add New Service"
				icon="bi-plus-lg"
				onButtonClick={handleAddService}
				isInitiallyEnabled={canCreate}
				disabledTooltip="You do not have permission to create services."
			/>
			<!-- DATE FILTER BAR -->
			<div style="margin-bottom: 1.5rem;">
				<DateFilterComponent
					{fromDate}
					{toDate}
					label="Service Date Range"
					onChange={(dates) => {
						fromDate = dates.from;
						toDate = dates.to;
						currentPage = 1;
						const params = new URLSearchParams();
						params.set('from', dates.from);
						params.set('to', dates.to);
						goto(`?${params.toString()}`, {
							replaceState: true,
							noScroll: true,
							keepFocus: true
						});
						fetchServices();
					}}
				/>
			</div>
			<!-- SEARCH & FILTER BAR -->
			<SearchFilterBar
				searchPlaceholder="Search by name or ID..."
				{filters}
				{activeFilters}
				on:update={handleSearchUpdate}
			/>
			<!-- TABLE VIEW (Desktop) -->
			<div class="d-none d-md-block">
				<DataTable
					data={formattedServices}
					columns={displayedColumns}
					{visibleColumns}
					tableName="Services"
					on:rowClick={(e) => handleShowDetailPage(e.detail)}
				/>
			</div>
			<!-- CARD VIEW (Mobile) -->
			<div class="d-md-none">
				{#each formattedServices as service (service.id)}
					<div
						class="d-flex align-items-center justify-content-between p-3 rounded-4 mb-2"
						role="button"
						tabindex="0"
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleShowDetailPage(service);
							}
						}}
						style="background-color: var(--bg-card);"
						on:click={() => handleShowDetailPage(service)}
					>
						<div class="d-flex align-items-center gap-4">
							<!-- Info -->
							<div style="color: var(--text-primary);">
								<div class="fw-inter-700">{service.name}</div>
								<div class="small">{service.id}</div>
							</div>
						</div>

						<i class="bi bi-chevron-right text-secondary"></i>
					</div>
				{/each}
				{#if formattedServices.length === 0}
					<EmptyData message="No Services found" />
				{/if}
				<FloatingAddButton
					onClick={handleAddService}
					tooltip={canCreate
						? 'Add new service'
						: 'You do not have permission to add a new service'}
					isInitiallyEnabled={canCreate}
				/>
			</div>
			<!-- Pagination -->
			{#if totalItems > 0 || hasNextPage}
				<Pagination
					{totalItems}
					{itemsPerPage}
					{currentPage}
					hasMore={hasNextPage}
					onPageChange={handlePageChange}
				/>
			{/if}
			<div class="mt-3" style="position: fixed; bottom: 1rem; right: 1rem;">
				<ColumnSelector
					{defaultColumns}
					{optionalColumns}
					{visibleColumns}
					onChange={handleColumnChange}
				/>
			</div>
		</main>
	</div>
</div>

<!-- Styles -->
<style>
	.main-div {
		background-color: var(--bg-primary);
		position: relative;
	}

	@media (max-width: 768px) {
		main {
			padding: 2rem;
		}
	}
	@media (max-width: 1200px) {
		.page-wrapper {
			padding: 2rem;
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';
	import LocationMapModal from '$lib/components/company-components/LocationMapModal.svelte';
	import { utcToIstFormat } from '$lib/helpers';
	import { canUpdateCompany } from '$lib/utils/permissions';
	import { getColorFromName } from '$lib/color-palette';
	import {
		COMPANY_TYPE_LABEL_BY_VALUE,
		COMPANY_STATUS_LABEL_BY_VALUE,
		COMPANY_STATUS
	} from '$lib/constants';
	import { fetchOperatorCompany, updateCompany } from '$lib/services/company';
	import { handleApiError } from '$lib/utils/api-error';
	import toast from '$lib/utils/toast';

	interface CompanyData {
		apiId: number;
		id: string;
		name: string;
		type: string;
		status: string;
		statusValue: number;
		description: string;
		address: string;
		locationWkt: string;
		lat: number | null;
		lon: number | null;
		createdAt: string;
		updatedAt: string;
	}

	let company: CompanyData | null = null;
	let loading = true;
	let error = '';
	let isSaving = false;

	// Editable fields
	let editDescription = '';
	let editAddress = '';
	let editLocationWkt = '';
	let editLat: number | null = null;
	let editLon: number | null = null;

	// Map modal state
	let showViewModal = false;
	let showEditModal = false;

	function parseWkt(wkt: string): { lat: number; lon: number } | null {
		if (!wkt) return null;
		const m = wkt.match(/POINT\s*\(\s*([\d.+\-]+)\s+([\d.+\-]+)\s*\)/i);
		if (!m) return null;
		return { lon: parseFloat(m[1]), lat: parseFloat(m[2]) };
	}

	function initEditFields() {
		if (!company) return;
		editDescription = company.description;
		editAddress = company.address;
		editLocationWkt = company.locationWkt;
		editLat = company.lat;
		editLon = company.lon;
	}

	function revertField(field: string) {
		if (!company) return;
		switch (field) {
			case 'description':
				editDescription = company.description;
				break;
			case 'address':
				editAddress = company.address;
				break;
			case 'location':
				editLocationWkt = company.locationWkt;
				editLat = company.lat;
				editLon = company.lon;
				break;
		}
	}

	async function loadCompany() {
		loading = true;
		error = '';
		try {
			const list = await fetchOperatorCompany();
			const item = Array.isArray(list) ? list[0] : null;
			if (!item) {
				error = 'Company not found.';
				loading = false;
				return;
			}
			const coords = parseWkt(item.location ?? '');
			company = {
				apiId: item.id,
				id: `CO-${item.id}`,
				name: item.name ?? '',
				type:
					COMPANY_TYPE_LABEL_BY_VALUE[item.type as import('$lib/constants').CompanyTypeEnum] ??
					String(item.type ?? ''),
				status:
					COMPANY_STATUS_LABEL_BY_VALUE[
						item.status as import('$lib/constants').CompanyStatusEnum
					] ?? String(item.status ?? ''),
				statusValue: item.status ?? 0,
				description: item.description ?? '',
				address: item.address ?? '',
				locationWkt: item.location ?? '',
				lat: coords?.lat ?? null,
				lon: coords?.lon ?? null,
				createdAt: utcToIstFormat(item.created_on ?? ''),
				updatedAt: utcToIstFormat(item.updated_on ?? '')
			};
		} catch (e) {
			error = await handleApiError(e);
		}
		loading = false;
	}

	async function saveField(field: 'description' | 'address' | 'location') {
		if (!company) return;
		if (!canEditCompanyFields) {
			toast.error('You do not have permission to update company details.');
			return;
		}
		isSaving = true;
		try {
			const payload: Record<string, any> = {};
			if (field === 'description') payload.description = editDescription.trim() || null;
			if (field === 'address') payload.address = editAddress.trim() || null;
			if (field === 'location') payload.location = editLocationWkt || null;

			await updateCompany(company.apiId, payload as any);
			toast.success('Company updated successfully.');
			await loadCompany();
			initEditFields();
		} catch (err: any) {
			const msg = await handleApiError(err);
			toast.error(msg || 'Failed to update company.');
		} finally {
			isSaving = false;
		}
	}

	function handleLocationConfirmed(e: CustomEvent<{ wkt: string; lat: number; lon: number }>) {
		const { wkt, lat, lon } = e.detail;
		editLocationWkt = wkt;
		editLat = lat;
		editLon = lon;
		showEditModal = false;
	}

	onMount(async () => {
		await loadCompany();
		initEditFields();
	});

	$: avatarColor = company?.name ? getColorFromName(company.name) : '#0d6efd';
	$: initials = company?.name
		? company.name
				.split(/\s+/)
				.filter(Boolean)
				.slice(0, 2)
				.map((w) => w[0].toUpperCase())
				.join('')
		: '?';

	$: isVerified = company?.statusValue === COMPANY_STATUS.VERIFIED;
	$: dirtyDescription = company ? editDescription !== company.description : false;
	$: dirtyAddress = company ? editAddress !== company.address : false;
	$: dirtyLocation = company ? editLocationWkt !== company.locationWkt : false;
	$: canEditCompanyFields = canUpdateCompany();
	$: noPermissionTooltip = canEditCompanyFields ? '' : 'No permission to edit this field';

	$: editModalLat = editLat ?? 10.8505;
	$: editModalLon = editLon ?? 76.2711;

	let mobileTab: 'card' | 'details' = 'card';
</script>

<!-- View-only map modal -->
<LocationMapModal
	isOpen={showViewModal}
	latitude={company?.lat ?? 10.8505}
	longitude={company?.lon ?? 76.2711}
	locationName={company?.name ?? 'Company Location'}
	pickMode={false}
	showInitialMarker={true}
	on:close={() => (showViewModal = false)}
/>

<!-- Edit map modal -->
<LocationMapModal
	isOpen={showEditModal}
	latitude={editModalLat}
	longitude={editModalLon}
	locationName="Pick Company Location"
	pickMode={true}
	showInitialMarker={editLat !== null}
	on:close={() => (showEditModal = false)}
	on:locationConfirmed={handleLocationConfirmed}
/>

<div class="page-root">
	<div class="sticky-top">
		<HeaderBar />
	</div>

	<main class="container py-4">
		<HomeButton />

		{#if loading}
			<div class="d-flex justify-content-center align-items-center" style="min-height: 40vh;">
				<div class="spinner-border text-primary" role="status" style="width:2.5rem;height:2.5rem;">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		{:else if error}
			<div class="alert alert-danger mt-4">{error}</div>
		{:else if company}
			<!-- Mobile tab toggle -->
			<div class="mobile-tabs">
				<button
					class="mtab {mobileTab === 'card' ? 'mtab-active' : ''}"
					on:click={() => (mobileTab = 'card')}
				>
					<i class="bi bi-building"></i> Company Card
				</button>
				<button
					class="mtab {mobileTab === 'details' ? 'mtab-active' : ''}"
					on:click={() => (mobileTab = 'details')}
				>
					<i class="bi bi-pencil-square"></i> Details
				</button>
			</div>

			<div class="profile-layout">
				<!-- SIDEBAR -->
				<aside class="profile-sidebar" class:mobile-hidden={mobileTab !== 'card'}>
					<div class="id-card">
						<div class="id-strip" style="background: {avatarColor};"></div>
						<div class="id-body">
							<div class="avatar-anchor">
								<div class="avatar" style="background:{avatarColor};">{initials}</div>
							</div>

							<h2 class="id-name">{company.name}</h2>

							<div class="id-role-badge {isVerified ? '' : 'id-role-empty'}">
								<i class="bi {isVerified ? 'bi-patch-check-fill' : 'bi-hourglass-split'}"></i>
								{company.status}
							</div>

							<div class="id-chips">
								<span class="id-tag">{company.id}</span>
								<span class="id-tag">{company.type}</span>
							</div>

							<hr class="id-hr" />

							<div class="contact-list">
								<div class="cl-row">
									<span class="cl-icon"><i class="bi bi-geo-alt"></i></span>
									{#if company.address}
										<span class="cl-val">{company.address}</span>
									{:else}
										<span class="cl-val cl-empty">No address set</span>
									{/if}
								</div>
								<div class="cl-row">
									<span class="cl-icon"><i class="bi bi-map"></i></span>
									{#if company.lat !== null}
										<button
											class="location-link"
											type="button"
											on:click={() => (showViewModal = true)}
										>
											<i class="bi bi-box-arrow-up-right"></i>
											View Location
										</button>
									{:else}
										<span class="cl-val cl-empty">No location set</span>
									{/if}
								</div>
							</div>

							<hr class="id-hr" />

							<div class="act-list">
								<div class="act-row">
									<span class="act-label"><i class="bi bi-calendar-plus"></i> Created</span>
									<span class="act-val">{company.createdAt || '—'}</span>
								</div>
								<div class="act-row">
									<span class="act-label"><i class="bi bi-clock-history"></i> Updated</span>
									<span class="act-val">{company.updatedAt || '—'}</span>
								</div>
							</div>
						</div>
					</div>
				</aside>

				<!-- MAIN -->
				<div class="profile-main" class:mobile-hidden={mobileTab !== 'details'}>
					<div class="fields-card">
						<!-- Company Name (read-only) -->
						<div class="field-row">
							<span class="field-label">Company Name</span>
							<div class="field-input-wrap">
								<span class="field-readonly">{company.name}</span>
							</div>
						</div>

						<!-- Type (read-only) -->
						<div class="field-row">
							<span class="field-label">Type</span>
							<div class="field-input-wrap">
								<span class="field-readonly">{company.type}</span>
							</div>
						</div>

						<!-- Status (read-only) -->
						<div class="field-row">
							<span class="field-label">Status</span>
							<div class="field-input-wrap">
								<span class="field-readonly">
									<span class="status-pill {isVerified ? 'pill-green' : 'pill-yellow'}">
										{company.status}
									</span>
								</span>
							</div>
						</div>

						<!-- Description (editable) -->
						<div class="field-row">
							<span class="field-label">
								Description <span class="field-hint">(optional)</span>
							</span>
							<div class="field-input-wrap">
								<textarea
									class="form-control field-input"
									rows="3"
									bind:value={editDescription}
									disabled={!canEditCompanyFields}
									title={noPermissionTooltip}
									placeholder="Add a description…"
								></textarea>
								{#if dirtyDescription && canEditCompanyFields}
									<div class="field-actions">
										<button
											class="fa-tick"
											type="button"
											on:click={() => saveField('description')}
											disabled={isSaving}
											aria-label="Save"><i class="bi bi-check-lg"></i></button
										>
										<button
											class="fa-cancel"
											type="button"
											on:click={() => revertField('description')}
											aria-label="Cancel"><i class="bi bi-x-lg"></i></button
										>
									</div>
								{/if}
							</div>
						</div>

						<!-- Address (editable) -->
						<div class="field-row">
							<span class="field-label">Address</span>
							<div class="field-input-wrap">
								<input
									class="form-control field-input"
									type="text"
									bind:value={editAddress}
									disabled={!canEditCompanyFields}
									title={noPermissionTooltip}
									placeholder="Enter address…"
								/>
								{#if dirtyAddress && canEditCompanyFields}
									<div class="field-actions">
										<button
											class="fa-tick"
											type="button"
											on:click={() => saveField('address')}
											disabled={isSaving}
											aria-label="Save"><i class="bi bi-check-lg"></i></button
										>
										<button
											class="fa-cancel"
											type="button"
											on:click={() => revertField('address')}
											aria-label="Cancel"><i class="bi bi-x-lg"></i></button
										>
									</div>
								{/if}
							</div>
						</div>

						<!-- Location (editable via map) -->
						<div class="field-row">
							<span class="field-label">Location</span>
							<div class="field-input-wrap location-wrap">
								<div class="location-display">
									{#if editLat !== null && editLon !== null}
										<span class="location-coords">
											<i class="bi bi-pin-map-fill"></i>
											{editLat.toFixed(6)}, {editLon.toFixed(6)}
										</span>
									{:else}
										<span class="cl-empty" style="font-size:0.82rem;">No location set</span>
									{/if}
									<div class="location-actions">
										<button
											class="pick-location-btn"
											type="button"
											on:click={() => (showEditModal = true)}
											disabled={!canEditCompanyFields}
											title={noPermissionTooltip}
										>
											<i class="bi bi-crosshair"></i>
											{editLat !== null ? 'Change Location' : 'Pick Location'}
										</button>
										{#if dirtyLocation && canEditCompanyFields}
											<div class="field-actions">
												<button
													class="fa-tick"
													type="button"
													on:click={() => saveField('location')}
													disabled={isSaving}
													aria-label="Save"><i class="bi bi-check-lg"></i></button
												>
												<button
													class="fa-cancel"
													type="button"
													on:click={() => revertField('location')}
													aria-label="Cancel"><i class="bi bi-x-lg"></i></button
												>
											</div>
										{/if}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	.page-root {
		background: var(--bg-primary);
		min-height: 100vh;
	}

	.profile-layout {
		display: grid;
		grid-template-columns: 340px 1fr;
		gap: 1.5rem;
		align-items: start;
		margin-top: 1.25rem;
	}

	.profile-sidebar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: sticky;
		top: 76px;
	}

	.id-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
	}

	.id-strip {
		height: 80px;
	}

	.id-body {
		padding: 0 1.25rem 1.25rem;
		display: flex;
		flex-direction: column;
	}

	.avatar-anchor {
		align-self: flex-start;
		margin-top: -44px;
		margin-bottom: 0.8rem;
	}

	.avatar {
		width: 88px;
		height: 88px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.8rem;
		font-weight: 700;
		color: #fff;
		border: 4px solid var(--bg-card);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
	}

	.id-name {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0 0 0.45rem 0;
		line-height: 1.3;
	}

	.id-role-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.25rem 0.7rem;
		background: var(--detail-avatar-card);
		border: 1px solid var(--border);
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--edit-btn);
		margin-bottom: 0.5rem;
		width: fit-content;
	}

	.id-role-badge i {
		font-size: 0.75rem;
	}

	.id-role-empty {
		color: var(--text-muted);
		background: var(--bg-primary);
		font-weight: 500;
	}

	.id-chips {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.id-tag {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--text-muted);
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: 5px;
		padding: 0.15rem 0.5rem;
	}

	.id-hr {
		border-color: var(--border);
		margin: 0.65rem 0;
		opacity: 1;
	}

	.contact-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.cl-row {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		padding: 0.3rem 0.5rem;
		border-radius: 8px;
		background: var(--bg-primary);
	}

	.cl-icon {
		width: 26px;
		height: 26px;
		border-radius: 6px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		color: var(--edit-btn);
		flex-shrink: 0;
		margin-top: 1px;
	}

	.cl-val {
		font-size: 0.78rem;
		color: var(--text-primary);
		line-height: 1.45;
		word-break: break-word;
		flex: 1;
	}

	.cl-empty {
		color: var(--text-muted);
		font-style: italic;
	}

	.location-link {
		background: none;
		border: none;
		padding: 0;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--edit-btn);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.location-link:hover {
		opacity: 0.8;
	}

	.act-list {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.act-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.4rem;
		padding: 0.28rem 0.5rem;
		border-radius: 7px;
		background: var(--bg-primary);
	}

	.act-label {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.7rem;
		color: var(--text-muted);
		font-weight: 500;
		white-space: nowrap;
	}

	.act-label i {
		font-size: 0.67rem;
		color: var(--edit-btn);
	}

	.act-val {
		font-size: 0.73rem;
		color: var(--text-primary);
		font-weight: 500;
		text-align: right;
	}

	.profile-main {
		flex: 1;
	}

	.fields-card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
	}

	.field-row {
		padding: 0.9rem 1.25rem;
		border-bottom: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.field-row:last-child {
		border-bottom: none;
	}

	.field-label {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.field-hint {
		text-transform: none;
		font-size: 0.68rem;
		font-weight: 400;
		opacity: 0.7;
	}

	.field-input-wrap {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.field-input {
		flex: 1;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.45rem 0.75rem;
		font-size: 0.85rem;
		color: var(--text-primary);
		outline: none;
		resize: vertical;
	}

	.field-input:focus {
		border-color: var(--edit-btn);
	}

	.field-readonly {
		font-size: 0.85rem;
		color: var(--text-primary);
		padding: 0.35rem 0;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.field-actions {
		display: flex;
		gap: 0.3rem;
		flex-shrink: 0;
		padding-top: 2px;
	}

	.fa-tick,
	.fa-cancel {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		border: 1px solid var(--border);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 0.8rem;
		transition: opacity 0.15s;
	}

	.fa-tick {
		background: var(--edit-btn);
		border-color: var(--edit-btn);
		color: #fff;
	}

	.fa-tick:hover:not(:disabled) {
		opacity: 0.85;
	}
	.fa-tick:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.fa-cancel {
		background: var(--bg-primary);
		color: var(--text-primary);
	}

	.fa-cancel:hover {
		background: var(--bg-card);
	}

	.status-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.65rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.pill-green {
		background: rgba(16, 185, 129, 0.12);
		color: #059669;
	}
	.pill-yellow {
		background: rgba(251, 191, 36, 0.15);
		color: #b45309;
	}

	.location-wrap {
		flex-direction: column;
		align-items: stretch;
	}

	.location-display {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.5rem 0.75rem;
		min-height: 36px;
	}

	.location-coords {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--text-primary);
		font-family: monospace;
	}

	.location-coords i {
		color: var(--edit-btn);
	}

	.location-actions {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-left: auto;
	}

	.pick-location-btn {
		background: none;
		border: 1px solid var(--edit-btn);
		border-radius: 8px;
		padding: 0.25rem 0.65rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--edit-btn);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		white-space: nowrap;
		flex-shrink: 0;
		transition: background 0.15s;
	}

	.pick-location-btn:hover {
		background: rgba(13, 110, 253, 0.08);
	}

	.pick-location-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.location-actions .field-actions {
		padding-top: 0;
	}

	.mobile-tabs {
		display: none;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.mtab {
		flex: 1;
		padding: 0.5rem;
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--bg-card);
		color: var(--text-muted);
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		transition: background 0.15s;
	}

	.mtab-active {
		background: var(--edit-btn);
		border-color: var(--edit-btn);
		color: #fff;
	}

	.fields-card :global(.form-control) {
		height: auto;
		min-height: 36px;
	}

	@media (max-width: 900px) {
		.profile-layout {
			grid-template-columns: 1fr;
		}
		.profile-sidebar {
			position: static;
		}
	}

	@media (max-width: 768px) {
		.mobile-tabs {
			display: flex;
		}
		.mobile-hidden {
			display: none !important;
		}
		main {
			padding: 1rem !important;
		}
	}
</style>

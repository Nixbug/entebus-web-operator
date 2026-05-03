<script lang="ts">
	import entebusLogo from '$lib/assets/entebus_logo.png';
	import { goto } from '$app/navigation';
	import { tick, onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { components } from '$lib/api/types';
	import {
		executiveLogin,
		validateToken,
		getClientDetails,
		storeToken,
		scheduleTokenRefresh,
		loadPermissions,
		getToken
	} from '$lib/services/auth';
	import { fetchCompanyAccount } from '$lib/services/company';
	import { Store } from '$lib/stores/session-store';
	import { handleApiError } from '$lib/utils/api-error';
	import { loginSchema } from '$lib/schemas';
	import toast from '$lib/utils/toast';
	import { writable } from 'svelte/store';

	type CompanyItem = Pick<components['schemas']['CompanySchema'], 'id' | 'name'>;

	const LIMIT = 10;

	let username: string = '';
	let password: string = '';
	let rememberMe: boolean = false;
	let companySearch: string = '';
	let selectedCompany: string = '';
	let selectedCompanyId: number | null = null;
	let companyInput: HTMLInputElement | null = null;
	let showDropdown = false;
	let showPassword = false;
	let companyName: string | null = null;
	let companies: CompanyItem[] = [];
	let companyLoading = false;
	let hasMore = false;
	let companyOffset = 0;
	let loginError = '';
	let prefilledCompany = false;
	let loading = false;
	let error = '';
	let checkingToken = true;
	let searchDebounce: ReturnType<typeof setTimeout> | null = null;
	const fieldErrors = writable<{ username?: string; password?: string }>({});
	const clientDetails = getClientDetails();

	//-- Check URL for companyName or name query parameter to pre-fill company field --
	$: companyName =
		$page.url.searchParams.get('companyName') ?? $page.url.searchParams.get('name') ?? null;

	//-- If companyName is set, pre-fill company field and load (run once) --
	$: if (companyName && !selectedCompany && !prefilledCompany) {
		companySearch = companyName;
		prefilledCompany = true;
		showDropdown = true;
		(async () => {
			await loadCompanies(true);
			const exact = companies.find((c) => c.name.toLowerCase() === companyName!.toLowerCase());
			if (exact) selectCompany(exact.id, exact.name);
			await tick();
			companyInput?.focus();
		})();
	}

	async function loadCompanies(reset = false) {
		if (companyLoading) return;
		companyLoading = true;
		const offset = reset ? 0 : companyOffset;
		try {
			const result = await fetchCompanyAccount({
				search: companySearch || undefined,
				limit: LIMIT,
				offset,
				publicAccess: true
			});
			companies = reset ? result : [...companies, ...result];
			hasMore = result.length === LIMIT;
			companyOffset = offset + result.length;
		} catch {
			// silently ignore
		} finally {
			companyLoading = false;
		}
	}

	//-- Toggle password visibility --
	function togglePassword() {
		showPassword = !showPassword;
	}

	//-- Handle company input with debounced search --
	function onCompanyInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		companySearch = val;
		selectedCompany = '';
		selectedCompanyId = null;
		loginError = '';
		showDropdown = true;
		if (searchDebounce) clearTimeout(searchDebounce);
		searchDebounce = setTimeout(() => loadCompanies(true), 300);
	}

	//-- Select company from dropdown --
	function selectCompany(id: number, name: string) {
		companySearch = name;
		selectedCompany = name;
		selectedCompanyId = id;
		loginError = '';
		showDropdown = false;
	}

	//-- Focus on company input when dropdown is opened --
	function onCompanyFocus() {
		showDropdown = true;
		if (companies.length === 0) loadCompanies(true);
	}

	//-- Handle click outside of dropdown --
	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.company-field-container')) {
			showDropdown = false;
		}
	}

	//-- Toggle dropdown --
	function toggleDropdown() {
		showDropdown = !showDropdown;
		if (showDropdown && companies.length === 0) loadCompanies(true);
		tick().then(() => companyInput?.focus());
	}

	//-- Handle login --
	const handleLogin = async () => {
		if (!selectedCompanyId) {
			loginError = 'Please select a company from the list';
			return;
		}
		loading = true;
		error = '';
		//-- Reset field errors --
		fieldErrors.set({ username: '', password: '' });
		//-- Validate with Zod --
		const result = loginSchema.safeParse({ username, password });
		if (!result.success) {
			//-- Extract errors --
			const formatted = result.error.format();
			fieldErrors.set({
				username: formatted.username?._errors[0] || '',
				password: formatted.password?._errors[0] || ''
			});
			loading = false;
			return;
		}
		const { username: parsedUsername, password: parsedPassword } = result.data;
		try {
			const token = await executiveLogin(
				parsedUsername,
				parsedPassword,
				selectedCompanyId,
				clientDetails ? JSON.stringify(clientDetails) : undefined
			);
			if (rememberMe) {
				localStorage.setItem('username', parsedUsername);
				Store.clearData('username');
			} else {
				Store.storeData<string>('username', parsedUsername);
				localStorage.removeItem('username');
			}
			storeToken(token, rememberMe);
			scheduleTokenRefresh(token);
			await loadPermissions();
			toast.success('User login successful!');
			goto('/dashboard');
		} catch (err: any) {
			error = await handleApiError(err);
			toast.error(error);
		} finally {
			loading = false;
		}
	};
	//-- Validate token on mount --
	onMount(async () => {
		try {
			const valid = await validateToken();
			if (valid) {
				await loadPermissions();
				const token = getToken();
				if (token) scheduleTokenRefresh(token);
				goto('/dashboard', { replaceState: true });
			}
		} catch (err) {
			console.error('Token validation failed:', err);
			toast.error('Unable to validate session. Please sign in again.');
		} finally {
			checkingToken = false;
		}
	});
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="d-flex justify-content-center align-items-center vh-100 bg-light login-bg">
	<div class="card login-card shadow-sm p-4 mx-3 mx-sm-0 w-100">
		<div class="text-center mb-4">
			<img src={entebusLogo} alt="Entebus Logo" class="logo-img" />
			<h3 class="mt-2 fw-inter-700">Operator Sign In</h3>
			{#if companyName}
				<p class="text-secondary mb-1">Access <b>{companyName}</b> Dashboard</p>
			{:else}
				<p class="text-secondary mb-1">Access Your Company Dashboard</p>
			{/if}
		</div>

		<form on:submit|preventDefault={handleLogin}>
			<!-- Company field with dropdown -->
			<div class="mb-3 company-field-container">
				<label for="companyName" class="form-label">Company</label>
				<div class="input-group">
					<input
						id="companyName"
						class="form-control form-control-lg"
						placeholder="search or select your company"
						bind:this={companyInput}
						bind:value={companySearch}
						on:input={onCompanyInput}
						on:focus={onCompanyFocus}
						autocomplete="off"
						role="combobox"
						aria-autocomplete="list"
						aria-controls="company-listbox"
						aria-expanded={showDropdown}
						required
					/>
					<button
						class="input-group-text company-toggle"
						type="button"
						on:click={toggleDropdown}
						on:mousedown|preventDefault
						aria-expanded={showDropdown}
						aria-label="Toggle company list"
					>
						<i class={`bi ${showDropdown ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
					</button>
				</div>

				<!-- Dropdown -->
				{#if showDropdown}
					<div class="dropdown-menu-custom" id="company-listbox" role="listbox">
						{#if companyLoading && companies.length === 0}
							<div class="dropdown-empty">
								<div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
								<p class="mb-0 mt-2">Loading companies...</p>
							</div>
						{:else if companies.length > 0}
							{#each companies as comp, i}
								<button
									type="button"
									id={'company-option-' + i}
									role="option"
									class="dropdown-item-custom"
									class:selected={comp.id === selectedCompanyId}
									aria-selected={comp.id === selectedCompanyId}
									on:click={() => selectCompany(comp.id, comp.name)}
									on:keydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											selectCompany(comp.id, comp.name);
										}
									}}
								>
									<i class="bi bi-building me-2"></i>
									{comp.name}
								</button>
							{/each}
							{#if hasMore}
								<button
									type="button"
									class="dropdown-load-more"
									on:click|stopPropagation={() => loadCompanies(false)}
									disabled={companyLoading}
								>
									{#if companyLoading}
										<span class="spinner-border spinner-border-sm me-1" role="status"></span>
									{/if}
									Load more
								</button>
							{/if}
						{:else}
							<div class="dropdown-empty">
								<i class="bi bi-search mb-2 fs-4"></i>
								<p class="mb-0">No companies found matching "{companySearch}"</p>
							</div>
						{/if}
					</div>
				{/if}
				{#if loginError}
					<p class="text-danger mt-1 mb-0 small">{loginError}</p>
				{/if}
			</div>

			<!-- Username field -->
			<div class="mb-3">
				<label for="username" class="form-label">Username</label>
				<input
					type="text"
					class="form-control form-control-lg"
					id="username"
					bind:value={username}
					placeholder="username"
					required
				/>
			</div>

			<!-- Password field -->
			<div class="mb-3">
				<label for="password" class="form-label">Password</label>
				<div class="input-group">
					<input
						type={showPassword ? 'text' : 'password'}
						class="form-control form-control-lg"
						id="password"
						bind:value={password}
						placeholder="password"
						required
					/>
					<span
						class="input-group-text bg-white border-1 password-toggle"
						role="button"
						tabindex="0"
						on:click={togglePassword}
						on:keydown={(e) =>
							(e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), togglePassword())}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						aria-pressed={showPassword}
					>
						<i class={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'} eye-color`}></i>
					</span>
				</div>
			</div>

			<!-- Remember me checkbox -->
			<div class="mb-3 form-check">
				<input
					type="checkbox"
					class="form-check-input"
					id="remember-me"
					bind:checked={rememberMe}
				/>
				<label class="form-check-label text-secondary" for="remember-me">Remember Me</label>
			</div>

			<!-- Login button -->
			<button type="submit" class="btn sign-in-btn mb-3 w-100 fw-inter-700" disabled={loading}>
				{#if loading}
					<span class="spinner-border spinner-border-sm me-2" role="status"></span>
					Signing in...
				{:else}
					Sign in
				{/if}
			</button>
		</form>
	</div>
</div>

<style>
	.login-bg {
		background: radial-gradient(rgba(4, 70, 105, 0.293), rgba(255, 255, 255, 1) 60%);
	}
	.eye-color {
		color: #47c7ff;
	}
	.sign-in-btn {
		background: linear-gradient(90deg, #2033b1 0%, #47c7ff 50%, #10c555 100%);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 12px;
	}
	.sign-in-btn:hover {
		box-shadow: 0 8px 24px rgba(14, 201, 167, 0.35);
	}
	.company-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		background: #ffffff;
		border-left: 1px solid rgba(0, 0, 0, 0.06);
		cursor: pointer;
	}
	.company-toggle i {
		color: #6c757d;
		font-size: 1rem;
	}

	.dropdown-menu-custom {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		right: 0;
		max-height: 250px;
		overflow-y: auto;
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		padding: 0.5rem 0;
		animation: dropdownFade 0.2s ease;
	}

	@keyframes dropdownFade {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.dropdown-item-custom {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		background: none;
		text-align: left;
		font-size: 0.95rem;
		color: #333;
		cursor: pointer;
		transition: all 0.2s;
	}

	.dropdown-item-custom:hover,
	.dropdown-item-custom.highlighted {
		background: linear-gradient(
			90deg,
			rgba(32, 51, 177, 0.05) 0%,
			rgba(71, 199, 255, 0.05) 50%,
			rgba(16, 197, 85, 0.05) 100%
		);
	}

	.dropdown-item-custom.selected {
		background: linear-gradient(
			90deg,
			rgba(32, 51, 177, 0.1) 0%,
			rgba(71, 199, 255, 0.1) 50%,
			rgba(16, 197, 85, 0.1) 100%
		);
		color: #2033b1;
		font-weight: 500;
	}

	.dropdown-item-custom i {
		color: #47c7ff;
		font-size: 1rem;
	}

	.dropdown-empty {
		padding: 2rem 1rem;
		text-align: center;
		color: #999;
	}

	.dropdown-empty i {
		color: #47c7ff;
		opacity: 0.5;
	}

	.dropdown-load-more {
		display: block;
		width: 100%;
		padding: 0.6rem 1rem;
		border: none;
		border-top: 1px solid #f0f0f0;
		background: none;
		text-align: center;
		font-size: 0.85rem;
		color: #2033b1;
		cursor: pointer;
	}

	.dropdown-load-more:hover:not(:disabled) {
		background: rgba(32, 51, 177, 0.05);
	}

	.dropdown-load-more:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.login-card {
		max-width: 30rem;
	}

	.logo-img {
		width: 4rem;
		height: 4rem;
		object-fit: contain;
	}

	.company-field-container {
		position: relative;
	}

	.password-toggle {
		cursor: pointer;
	}

	.password-toggle .bi {
		font-size: 1.25rem;
	}
</style>

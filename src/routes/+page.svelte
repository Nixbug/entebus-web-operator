<script lang="ts">
	import entebusLogo from '$lib/assets/entebus_logo.png';
	import { goto } from '$app/navigation';
	import { tick, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { companies } from '$lib/dummy-data';
	import type { Company } from '$lib/types/type';

	let username: string = '';
	let password: string = '';
	let rememberMe: boolean = false;
	let companySearch: string = '';
	let selectedCompany: string = '';
	let companyInput: HTMLInputElement | null = null;
	let showDropdown = false;
	let showPassword = false;
	let companyName: string | null = null;
	let filteredCompanies: Company[] = [];
	let loginError = '';
	let prefilledCompany = false;

	//-- Check URL for companyName or name query parameter to pre-fill company field --
	$: companyName =
		$page.url.searchParams.get('companyName') ?? $page.url.searchParams.get('name') ?? null;

	//-- Filter companies based on search input --
	$: filteredCompanies = companies.filter((c) =>
		c.name.toLowerCase().includes(companySearch.toLowerCase())
	);

	//-- If companyName is set, pre-fill company field and show dropdown (run once) --
	$: if (companyName && !selectedCompany && !prefilledCompany) {
		const name = companyName;
		if (!companySearch) {
			companySearch = name;
		}
		const exact = companies.find((c) => c.name.toLowerCase() === name.toLowerCase());
		if (exact) {
			selectedCompany = exact.name;
		}
		showDropdown = true;
		prefilledCompany = true;
		tick().then(() => companyInput?.focus());
	}

	//-- Toggle password visibility --
	function togglePassword() {
		showPassword = !showPassword;
	}

	//-- Handle company input --
	function onCompanyInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		companySearch = val;
		selectedCompany = '';
		loginError = '';
		showDropdown = true;
	}

	//-- Select company from dropdown --
	function selectCompany(name: string) {
		companySearch = name;
		selectedCompany = name;
		loginError = '';
		showDropdown = false;
	}

	//-- Focus on company input when dropdown is opened --
	function onCompanyFocus() {
		showDropdown = true;
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
		tick().then(() => companyInput?.focus());
	}

	//-- Handle login --
	function handleLogin() {
		if (!selectedCompany) {
			loginError = 'Please select a company from the list.';
			return;
		}
		goto('/dashboard');
	}
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
						{#if filteredCompanies.length > 0}
							{#each filteredCompanies as comp, i}
								<button
									type="button"
									id={'company-option-' + i}
									role="option"
									class="dropdown-item-custom"
									class:selected={comp.name === selectedCompany}
									aria-selected={comp.name === selectedCompany}
									on:click={() => selectCompany(comp.name)}
									on:keydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											selectCompany(comp.name);
										}
									}}
								>
									<i class="bi bi-building me-2"></i>
									{comp.name}
								</button>
							{/each}
						{:else}
							<div class="dropdown-empty">
								<i class="bi bi-search mb-2" style="font-size: 1.5rem;"></i>
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
							(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') &&
							(e.preventDefault(), togglePassword())}
						aria-label="Toggle password visibility"
						aria-pressed={showPassword}
					>
						<i class={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'} eye-color`}></i>
					</span>
				</div>
			</div>

			<!-- Remember me checkbox -->
			<div class="mb-3 form-check">
				<input type="checkbox" class="form-check-input" id="remember-me" bind:checked={rememberMe} />
				<label class="form-check-label text-secondary" for="remember-me">Remember Me</label>
			</div>

			<!-- Login button -->
			<button type="submit" style="color: white;" class="btn sign-in-btn mb-3 w-100 fw-inter-700">
				Sign in
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

	.sign-in-btn {
		color: white;
	}
</style>

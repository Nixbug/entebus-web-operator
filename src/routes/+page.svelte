<script lang="ts">
	import entebusLogo from '$lib/assets/entebus_logo.png';
	import { goto } from '$app/navigation';
	let username: string = '';
	let password: string = '';
	let company: string = '';
	let selectedCompany: string = '';
	let companies: string[] = [
		'Entebus',
		'Acme Transport',
		'TransitCo',
		'CityLines',
		'Global Transit',
		'MetroLink',
		'National Buses'
	];
	let showCompanyList = false;
	let filteredCompanies = companies;
	let showPassword: boolean = false;

  //-- Password visibility toggle handler --
	function togglePassword() {
		showPassword = !showPassword;
	}

	//-- Company search handlers --
	function onCompanyInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		company = val;
		// typing clears explicit selection until user picks from list
		selectedCompany = '';
		filteredCompanies = companies.filter((c) => c.toLowerCase().includes(val.toLowerCase()));
		showCompanyList = true;
	}

	function selectCompany(c: string) {
		company = c;
		selectedCompany = c;
		showCompanyList = false;
	}

	function onCompanyFocus() {
		if (selectedCompany && company === selectedCompany) {
			filteredCompanies = [selectedCompany];
		} else {
			filteredCompanies = companies;
		}
		showCompanyList = true;
	}

	function onCompanyBlur() {
		setTimeout(() => (showCompanyList = false), 150);
	}

	function toggleCompanyList() {
		showCompanyList = !showCompanyList;
		if (showCompanyList) {
			filteredCompanies =
				selectedCompany && company === selectedCompany ? [selectedCompany] : companies;
		}
		setTimeout(() => (document.getElementById('companyName') as HTMLInputElement)?.focus(), 0);
	}

	//-- Login handler (mock) --
	function handleLogin() {
		goto('/dashboard');
		alert('Login successful!');
		console.log('Company:', company);
		console.log('Username:', username);
		console.log('Password:', password);
	}
</script>

<div class="d-flex justify-content-center align-items-center vh-100 bg-light login-bg">
	<div class="card login-card shadow-sm p-4 mx-3 mx-sm-0 w-100" style="max-width: 30rem;">
		<div class="text-center mb-4">
			<img src={entebusLogo} alt="Entebus Logo" style="width: 4rem; height: 4rem;" />
			<h3 class="mt-2 fw-inter-700">Operator Sign In</h3>
			<h6 class="text-secondary fw-inter-400">Access your company dashboard</h6>
		</div>
		<form on:submit|preventDefault={handleLogin}>
			<!-- company field -->
			<div class="mb-3" style="position: relative;">
				<label for="companyName" class="form-label">Company</label>
				<div class="input-group">
					<input
						id="companyName"
						class="form-control form-control-lg"
						placeholder="search company"
						bind:value={company}
						on:input={onCompanyInput}
						on:focus={onCompanyFocus}
						on:blur={onCompanyBlur}
						autocomplete="off"
						required
					/>
					<span
						class="input-group-text company-toggle"
						role="button"
						tabindex="0"
						on:mousedown|preventDefault={toggleCompanyList}
						aria-expanded={showCompanyList}
						aria-label="Toggle company list"
					>
						<i class={`bi ${showCompanyList ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
					</span>
				</div>
				{#if showCompanyList && filteredCompanies.length}
					<ul class="company-list position-absolute w-100 shadow-sm" role="listbox">
						{#each filteredCompanies as comp}
							<li
								tabindex="0"
								role="option"
								aria-selected={comp === selectedCompany}
								class="company-item"
								class:selected={comp === selectedCompany}
								on:mousedown={() => selectCompany(comp)}
							>
								{comp}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
			<!-- username field -->
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
			<!--password field -->
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
						class="input-group-text bg-white border-1"
						role="button"
						tabindex="0"
						on:click={togglePassword}
						on:keydown={(e) => e.key === 'Enter' && togglePassword()}
						aria-label="Toggle password visibility"
						aria-pressed={showPassword}
						style="cursor: pointer;"
					>
						<i
							class={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash '} eye-color`}
							style="font-size: 1.25rem;"
						></i>
					</span>
				</div>
			</div>
			<!-- remember me checkbox -->
			<div class="mb-3 form-check">
				<input type="checkbox" class="form-check-input" id="remember-me" />
				<label class="form-check-label text-secondary" for="rememberMe">Remember Me</label>
			</div>
			<!-- login button -->
			<button type="submit" style="color: white;" class="btn sign-in-btn mb-3 w-100 fw-inter-700"
				>Sign in</button
			>
		</form>
	</div>
</div>

<!-- style -->
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

	.company-list {
		top: calc(100% + 0.4rem);
		left: 0;
		max-height: 12rem;
		overflow: auto;
		z-index: 1050;
		border-radius: 0.5rem;
		background: #ffffff;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
		margin: 0;
		padding: 0.25rem 0;
	}

	.company-item {
		list-style: none;
		padding: 0.55rem 0.75rem;
		cursor: pointer;
		color: #212529;
	}

	.company-item + .company-item {
		border-top: 1px solid rgba(0, 0, 0, 0.04);
	}

	.company-item:hover {
		background: #f8f9fa;
	}

	.company-item.selected {
		background: #e9f7ff;
		font-weight: 600;
		color: #0b63a3;
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
</style>

<script lang="ts">
	import RoleForm from '$lib/components/role-permission-components/RoleForm.svelte';
	import { operatorRolePermissionTree } from '$lib/role-permissions/role-permission-tree';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { createRole } from '$lib/services/operator-role';
	import toast from '$lib/utils/toast';
	import { handleApiError } from '$lib/utils/api-error';

	let isSubmitting = false;
	let listingHref = '/operator-role';

	//-- Handle form submission for creating a new operator role --
	async function createOperatorRoleHandler(e: CustomEvent<{ name: string; permissions: any }>) {
		if (isSubmitting) return;
		const formData = e.detail;
		const payload = {
			name: formData.name,
			permissions: formData.permissions
		};
		isSubmitting = true;
		try {
			await createRole(payload);
			toast.success('Role created successfully.');
			goto(listingHref);
		} catch (err: any) {
			const message = await handleApiError(err);
			if (err.status === 409) {
				toast.error('Role name already exists. Please choose a different name.');
			} else {
				toast.error(message || 'Failed to create role.');
			}
		} finally {
			isSubmitting = false;
		}
	}

	function onCancel() {
		goto(listingHref);
	}
</script>

<HeaderBar />
<main>
	<RoleForm
		permissionTree={operatorRolePermissionTree}
		on:save={createOperatorRoleHandler}
		on:cancel={onCancel}
		isEditMode={false}
		{listingHref}
		{isSubmitting}
	/>
</main>

<style>
	:global(body) {
		background-color: var(--bg-primary);
	}

	main {
		min-height: 80vh;
		padding: 2rem 1rem;
		max-width: 1100px;
		margin: 0 auto;
	}
</style>

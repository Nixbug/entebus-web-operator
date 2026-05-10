<script lang="ts">
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import FarePageTemplate from '$lib/components/fare-template-components/FarePageTemplate.svelte';
	import { goto } from '$app/navigation';
	import { createFare } from '$lib/services/dynamic-fare';
	import { handleApiError } from '$lib/utils/api-error';
	import toast from '$lib/utils/toast';
	import { canCreateFare } from '$lib/utils/permissions';
	import { FARE_SCOPE } from '$lib/constants';
	import { validateFare } from '$lib/schemas';

	let pageTitle = 'Create Local Fare';
	let pageDescription = 'Use this page to create a new local fare.';
	let isSubmitting = false;
	let listingHref = '/local-fare';

	//-- Handle form submission for creating a new local fare --
	async function handleCreate(e: CustomEvent) {
		if (isSubmitting) return;
		if (!canCreateFare()) {
			toast.error('You do not have permission to create fares.');
			return;
		}
		const formData = e.detail;
		//-- Validate before API call --
		const validation = validateFare(formData);
		if (!validation.valid) {
			toast.error(validation.error || 'Fare validation failed.');
			return;
		}
		const payload = {
			scope: FARE_SCOPE.LOCAL,
			name: formData.name,
			attributes: formData.attributes,
			function: formData.function
		};
		isSubmitting = true;
		try {
			await createFare(payload);
			toast.success('Local fare created successfully.');
			goto(listingHref);
		} catch (err: any) {
			const message = await handleApiError(err);
			if (err.status === 409) {
				toast.error('Local fare name already exists. Please choose a different name.');
			} else {
				toast.error(message || 'Failed to create local fare.');
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<HeaderBar />
<FarePageTemplate
	{pageTitle}
	{pageDescription}
	on:create={handleCreate}
	{listingHref}
	{isSubmitting}
/>

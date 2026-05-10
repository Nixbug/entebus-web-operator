import { apiFetch } from '$lib/services/fetch-client';
import { API_BASE_URL } from '$lib/services/config';
import type { operations } from '$lib/api/types';

export type companyGetResponse =
	operations['fetch_company_operator_company_get']['responses']['200']['content']['application/json'];
export type companyUpdateRequest =
	operations['update_company_operator_company__id__patch']['requestBody']['content']['application/json'];
export type companyUpdateResponse =
	operations['update_company_operator_company__id__patch']['responses']['200']['content']['application/json'];

// Public base: strips /operator to hit https://dev-api.entebus.com/public/company
const PUBLIC_COMPANY_BASE = API_BASE_URL.replace(/\/operator$/, '') + '/public/company';

//-- Fetch a company account from public API --
export async function fetchCompanyAccount({
	id,
	search,
	status,
	type,
	limit,
	offset,
	location,
	publicAccess = false
}: {
	id?: string;
	search?: string;
	status?: number;
	type?: number;
	limit?: number;
	offset?: number;
	location?: string;
	publicAccess?: boolean;
} = {}): Promise<companyGetResponse> {
	const params = new URLSearchParams();
	if (id) params.append('id', id);
	if (search) params.append('search', search);
	if (status !== undefined) params.append('status_list', String(status));
	if (type !== undefined) params.append('type_list', String(type));
	if (limit !== undefined) params.append('limit', String(limit));
	if (offset !== undefined) params.append('offset', String(offset));
	if (location) params.append('location', location);
	const query = params.toString();

	if (publicAccess) {
		const url = `${PUBLIC_COMPANY_BASE}${query ? `?${query}` : ''}`;
		const res = await fetch(url);
		if (!res.ok) throw { ok: false, status: res.status };
		return (await res.json()) ?? [];
	}

	const url = `/company${query ? `?${query}` : ''}`;
	const res = await apiFetch<companyGetResponse>('GET', url);
	if (!res.ok) throw res;
	return res.data ?? [];
}

//-- Fetch a company account by its ID --
export async function fetchOperatorCompany({
	offset
}: {
	offset?: number;
} = {}): Promise<companyGetResponse> {
	const params = new URLSearchParams();
	if (offset !== undefined) params.append('offset', String(offset));

	const query = params.toString();
	const url = `/company${query ? `?${query}` : ''}`;

	const res = await apiFetch<companyGetResponse>('GET', url);
	if (!res.ok) throw res;
	return res.data ?? [];
}
//-- Update a company account by its ID --
export async function updateCompany(
	id: number,
	payload: companyUpdateRequest
): Promise<companyUpdateResponse> {
	const url = `/company/${encodeURIComponent(String(id))}`;
	const res = await apiFetch<companyUpdateResponse>('PATCH', url, {
		body: payload,
		contentType: 'json'
	});
	if (!res.ok) throw res;
	return res.data as companyUpdateResponse;
}

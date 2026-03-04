import type { PermissionNodeData } from './build-state';

//---- Defines the hierarchical structure of permissions ----
export const operatorRolePermissionTree: PermissionNodeData[] = [
	{
		id: 'company',
		label: 'Company',
		actions: ['fetch', 'update']
	},
	{
		id: 'bus',
		label: 'Bus',
		actions: ['fetch', 'create', 'update', 'delete']
	},
	{
		id: 'fare',
		label: 'Fare',
		actions: ['fetch', 'create', 'update', 'delete']
	},
	{
		id: 'route',
		label: 'Route',
		actions: ['fetch', 'create', 'update', 'delete']
	},
	{
		id: 'operator',
		label: 'Operator',
		actions: ['fetch', 'create', 'update', 'delete'],
		children: [
			{
				id: 'role',
				label: 'Role',
				actions: ['fetch', 'create', 'update', 'delete']
			},
			{
				id: 'token',
				label: 'Token',
				actions: ['fetch', 'create', 'update', 'delete']
			}
		]
	},
	{
		id: 'service',
		label: 'Service',
		actions: ['fetch', 'create', 'update', 'delete'],
		children: [
			{
				id: 'duty',
				label: 'Duty',
				actions: ['fetch', 'create', 'update', 'delete']
			}
		]
	}
];

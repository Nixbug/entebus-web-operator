import type { PermissionNodeData } from './build-state';

//---- Defines the hierarchical structure of permissions ----
export const operatorRolePermissionTree: PermissionNodeData[] = [
	{
		id: 'company',
		label: 'Company',
		actions: ['update'],
		children: [
			{
				id: 'operator',
				label: 'Operator',
				actions: ['create', 'update', 'delete'],
				children: [
					{
						id: 'role',
						label: 'Role',
						actions: ['create', 'update', 'delete']
					},
					{
						id: 'token',
						label: 'Token',
						actions: ['fetch', 'delete']
					}
				]
			},
			{
				id: 'vehicle',
				label: 'Vehicle',
				actions: ['create', 'update', 'delete']
			},
			{
				id: 'fare',
				label: 'Fare',
				actions: ['create', 'update', 'delete']
			},
			{
				id: 'route',
				label: 'Route',
				actions: ['create', 'update', 'delete']
			},
			{
				id: 'service',
				label: 'Service',
				actions: ['create', 'update', 'delete'],
				children: [
					{
						id: 'duty',
						label: 'Duty',
						actions: ['update'] // only update
					},
					{
						id: 'assignment',
						label: 'Assignment',
						actions: ['create', 'update', 'delete']
					},
					{
						id: 'ticket',
						label: 'Ticket',
						actions: ['create']
					},
					{
						id: 'statement',
						label: 'Statement',
						actions: ['create']
					}
				]
			},
			{
				id: 'schedule',
				label: 'Schedule',
				actions: ['create', 'update', 'delete']
			}
		]
	}
];

import type { Company, Operator, OperatorRole } from '$lib/types/type';

//-- Dummy data: List of companies --
export const companies: Company[] = [
	{
		id: 1,
		name: 'TechCorp Solutions'
	},
	{
		id: 2,
		name: 'Global Industries Ltd'
	},
	{
		id: 3,
		name: 'InnovateTech Systems'
	},
	{
		id: 4,
		name: 'Pacific Enterprises'
	},
	{
		id: 5,
		name: 'Metro Business Group'
	},
	{
		id: 6,
		name: 'Atlas Corporation'
	},
	{
		id: 7,
		name: 'Summit Technologies'
	},
	{
		id: 8,
		name: 'Vista Solutions'
	},
	{
		id: 9,
		name: 'Horizon Industries'
	},
	{
		id: 10,
		name: 'Prime Business Systems'
	}
];

//-- Dummy data: List of operators --
export const operators: Operator[] = [
	{
		id: 'OPER-001',
		companyId: 'COMP-001',
		name: 'John Mathew',
		gender: 'Male',
		initials: 'JM',
		email: 'john@entebus.com',
		username: 'john',
		password: 'test@123',
		isYou: true,
		phone: '98765 00001',
		createdAt: 'Jan 18, 2024',
		isActive: true
	},
	{
		id: 'OPER-002',
		companyId: 'COMP-002',
		name: 'Alice Joseph',
		gender: 'Female',
		initials: 'AJ',
		email: 'alice@entebus.com',
		username: 'alice',
		password: 'test@123',
		phone: '98765 00002',
		createdAt: 'Feb 02, 2024',
		isActive: true
	},
	{
		id: 'OPER-003',
		companyId: 'COMP-001',
		name: 'Rahul Menon',
		gender: 'Male',
		initials: 'RM',
		email: 'rahul@entebus.com',
		username: 'rahul',
		password: 'test@123',
		phone: '98765 00003',
		createdAt: 'Feb 10, 2024',
		isActive: true
	},
	{
		id: 'OPER-004',
		companyId: 'COMP-001',
		name: 'Sneha Kumar',
		gender: 'Female',
		initials: 'SK',
		email: 'sneha@entebus.com',
		username: 'sneha',
		password: 'test@123',
		phone: '98765 00004',
		createdAt: 'Feb 15, 2024',
		isActive: false
	},
	{
		id: 'OPER-005',
		companyId: 'COMP-001',
		name: 'Arjun Reddy',
		gender: 'Male',
		initials: 'AR',
		email: 'arjun@entebus.com',
		username: 'arjun',
		password: 'test@123',
		phone: '98765 00005',
		createdAt: 'Mar 01, 2024',
		isActive: true
	},
	{
		id: 'OPER-006',
		companyId: 'COMP-001',
		name: 'Priya Nair',
		gender: 'Female',
		initials: 'PN',
		email: 'priya@entebus.com',
		username: 'priya',
		password: 'test@123',
		phone: '98765 00006',
		createdAt: 'Mar 05, 2024',
		isActive: true
	},
	{
		id: 'OPER-007',
		companyId: 'COMP-001',
		name: 'Vikram Singh',
		gender: 'Male',
		initials: 'VS',
		email: 'vikram@entebus.com',
		username: 'vikram',
		password: 'test@123',
		phone: '98765 00007',
		createdAt: 'Mar 12, 2024',
		isActive: false
	},
	{
		id: 'OPER-008',
		companyId: 'COMP-001',
		name: 'Anjali Varma',
		gender: 'Female',
		initials: 'AV',
		email: 'anjali@entebus.com',
		username: 'anjali',
		password: 'test@123',
		phone: '98765 00008',
		createdAt: 'Mar 18, 2024',
		isActive: true
	},
	{
		id: 'OPER-009',
		companyId: 'COMP-001',
		name: 'Kiran Das',
		gender: 'Male',
		initials: 'KD',
		email: 'kiran@entebus.com',
		username: 'kiran',
		password: 'test@123',
		phone: '+91 98765 00009',
		createdAt: 'Apr 01, 2024',
		isActive: true
	},
	{
		id: 'OPER-010',
		companyId: 'COMP-001',
		name: 'Meera Thomas',
		gender: 'Female',
		initials: 'MT',
		email: 'meera@entebus.com',
		username: 'meera',
		password: 'test@123',
		phone: '+91 98765 00010',
		createdAt: 'Apr 05, 2024',
		isActive: false
	},
	{
		id: 'OPER-011',
		companyId: 'COMP-001',
		name: 'Sanjay Pillai',
		gender: 'Male',
		initials: 'SP',
		email: 'sanjay@entebus.com',
		username: 'sanjay',
		password: 'test@123',
		phone: '+91 98765 00011',
		createdAt: 'Apr 10, 2024',
		isActive: true
	},
	{
		id: 'OPER-012',
		companyId: 'COMP-001',
		name: 'Divya Krishnan',
		gender: 'Female',
		initials: 'DK',
		email: 'divya@entebus.com',
		username: 'divya',
		password: 'test@123',
		phone: '+91 98765 00012',
		createdAt: 'Apr 15, 2024',
		isActive: true
	},
	{
		id: 'OPER-013',
		companyId: 'COMP-001',
		name: 'Manoj Kumar',
		gender: 'Male',
		initials: 'MK',
		email: 'manoj@entebus.com',
		username: 'manoj',
		password: 'test@123',
		phone: '+91 98765 00013',
		createdAt: 'Apr 20, 2024',
		isActive: false
	},
	{
		id: 'OPER-014',
		companyId: 'COMP-001',
		name: 'Neha Sharma',
		gender: 'Female',
		initials: 'NS',
		email: 'neha@entebus.com',
		username: 'neha',
		password: 'test@123',
		phone: '+91 98765 00014',
		createdAt: 'May 01, 2024',
		isActive: true
	},
	{
		id: 'OPER-015',
		companyId: 'COMP-001',
		name: 'Amit Roy',
		gender: 'Male',
		initials: 'AR',
		email: 'amit@entebus.com',
		username: 'amit',
		password: 'test@123',
		phone: '+91 98765 00015',
		createdAt: 'May 05, 2024',
		isActive: true
	},
	{
		id: 'OPER-016',
		companyId: 'COMP-001',
		name: 'Riya Sen',
		gender: 'Female',
		initials: 'RS',
		email: 'riya@entebus.com',
		username: 'riya',
		password: 'test@123',
		phone: '+91 98765 00016',
		createdAt: 'May 10, 2024',
		isActive: true
	},
	{
		id: 'OPER-017',
		companyId: 'COMP-001',
		name: 'Deepak Nambiar',
		gender: 'Male',
		initials: 'DN',
		email: 'deepak@entebus.com',
		username: 'deepak',
		password: 'test@123',
		phone: '+91 98765 00017',
		createdAt: 'May 15, 2024',
		isActive: false
	},
	{
		id: 'OPER-018',
		companyId: 'COMP-001',
		name: 'Lakshmi Iyer',
		gender: 'Female',
		initials: 'LI',
		email: 'lakshmi@entebus.com',
		username: 'lakshmi',
		password: 'test@123',
		phone: '+91 98765 00018',
		createdAt: 'May 20, 2024',
		isActive: true
	},
	{
		id: 'OPER-019',
		companyId: 'COMP-001',
		name: 'Rohit Babu',
		gender: 'Male',
		initials: 'RB',
		email: 'rohit@entebus.com',
		username: 'rohit',
		password: 'test@123',
		phone: '+91 98765 00019',
		createdAt: 'May 25, 2024',
		isActive: true
	},
	{
		id: 'OPER-020',
		companyId: 'COMP-001',
		name: 'Pooja Menon',
		gender: 'Female',
		initials: 'PM',
		email: 'pooja@entebus.com',
		username: 'pooja',
		password: 'test@123',
		phone: '+91 98765 00020',
		createdAt: 'Jun 01, 2024',
		isActive: true
	}
];

function generateRandomPermissionFlag(): boolean {
	return Math.random() > 0.5;
}
function generateCrudPermissions() {
	return {
		create: generateRandomPermissionFlag(),
		update: generateRandomPermissionFlag(),
		delete: generateRandomPermissionFlag(),
		fetch: generateRandomPermissionFlag()
	};
}

function generatePermissions() {
	return {

		company: {
			...generateCrudPermissions(),
			bus: {
				...generateCrudPermissions()
			},
			fare: {
				...generateCrudPermissions()
			},
			route: {
				...generateCrudPermissions()
			},
			operator: {
				...generateCrudPermissions(),
				role: {
					...generateCrudPermissions()
				},
				token: {
					...generateCrudPermissions()
				}
			},
			service: {
				...generateCrudPermissions(),
				duty: {
					...generateCrudPermissions()
				}
			}
		}
	};
}

export const operatorRoles: OperatorRole[] = [
	{
		id: 'ROLE-001',
		name: 'System Administrator',
		permissions: generatePermissions(),
		createdAt: 'Jan 02, 2024',
		updatedAt: 'Jan 05, 2024'
	},
	{
		id: 'ROLE-002',
		name: 'Guest Role',
		permissions: generatePermissions(),
		createdAt: 'Jan 03, 2024',
		updatedAt: 'Jan 04, 2024'
	},
	{
		id: 'ROLE-003',
		name: 'Executive Manager',
		permissions: generatePermissions(),
		createdAt: 'Jan 06, 2024',
		updatedAt: 'Jan 06, 2024'
	},
	{
		id: 'ROLE-004',
		name: 'Operations Lead',
		permissions: generatePermissions(),
		createdAt: 'Jan 07, 2024',
		updatedAt: 'Jan 09, 2024'
	},
	{
		id: 'ROLE-005',
		name: 'HR Supervisor',
		permissions: generatePermissions(),
		createdAt: 'Jan 08, 2024',
		updatedAt: 'Jan 11, 2024'
	},
	{
		id: 'ROLE-006',
		name: 'Finance Controller',
		permissions: generatePermissions(),
		createdAt: 'Jan 10, 2024',
		updatedAt: 'Jan 12, 2024'
	},
	{
		id: 'ROLE-007',
		name: 'Support Specialist',
		permissions: generatePermissions(),
		createdAt: 'Jan 11, 2024',
		updatedAt: 'Jan 14, 2024'
	},
	{
		id: 'ROLE-008',
		name: 'Project Coordinator',
		permissions: generatePermissions(),
		createdAt: 'Jan 12, 2024',
		updatedAt: 'Jan 13, 2024'
	},
	{
		id: 'ROLE-009',
		name: 'Technical Lead',
		permissions: generatePermissions(),
		createdAt: 'Jan 14, 2024',
		updatedAt: 'Jan 16, 2024'
	},
	{
		id: 'ROLE-010',
		name: 'QA Analyst',
		permissions: generatePermissions(),
		createdAt: 'Jan 15, 2024',
		updatedAt: 'Jan 17, 2024'
	},
	{
		id: 'ROLE-011',
		name: 'Deployment Manager',
		permissions: generatePermissions(),
		createdAt: 'Jan 16, 2024',
		updatedAt: 'Jan 18, 2024'
	},
	{
		id: 'ROLE-012',
		name: 'Data Entry Executive',
		permissions: generatePermissions(),
		createdAt: 'Jan 17, 2024',
		updatedAt: 'Jan 19, 2024'
	},
	{
		id: 'ROLE-013',
		name: 'Vendor Manager',
		permissions: generatePermissions(),
		createdAt: 'Jan 19, 2024',
		updatedAt: 'Jan 20, 2024'
	},
	{
		id: 'ROLE-014',
		name: 'Logistics Coordinator',
		permissions: generatePermissions(),
		createdAt: 'Jan 20, 2024',
		updatedAt: 'Jan 22, 2024'
	},
	{
		id: 'ROLE-015',
		name: 'Marketing Analyst',
		permissions: generatePermissions(),
		createdAt: 'Jan 21, 2024',
		updatedAt: 'Jan 23, 2024'
	},
	{
		id: 'ROLE-016',
		name: 'Content Reviewer',
		permissions: generatePermissions(),
		createdAt: 'Jan 23, 2024',
		updatedAt: 'Jan 25, 2024'
	},
	{
		id: 'ROLE-017',
		name: 'Field Inspector',
		permissions: generatePermissions(),
		createdAt: 'Jan 24, 2024',
		updatedAt: 'Jan 26, 2024'
	},
	{
		id: 'ROLE-018',
		name: 'Security Officer',
		permissions: generatePermissions(),
		createdAt: 'Jan 26, 2024',
		updatedAt: 'Jan 28, 2024'
	},
	{
		id: 'ROLE-019',
		name: 'Shift Supervisor',
		permissions: generatePermissions(),
		createdAt: 'Jan 27, 2024',
		updatedAt: 'Jan 29, 2024'
	},
	{
		id: 'ROLE-020',
		name: 'Junior Assistant',
		permissions: generatePermissions(),
		createdAt: 'Jan 28, 2024',
		updatedAt: 'Jan 30, 2024'
	}
];

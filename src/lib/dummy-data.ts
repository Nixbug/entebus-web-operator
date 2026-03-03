import type { Company, Operator } from '$lib/types/type';

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
		phone: '+91 98765 00001',
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
		phone: '+91 98765 00002',
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
		phone: '+91 98765 00003',
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
		phone: '+91 98765 00004',
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
		phone: '+91 98765 00005',
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
		phone: '+91 98765 00006',
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
		phone: '+91 98765 00007',
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
		phone: '+91 98765 00008',
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

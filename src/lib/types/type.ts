//-- Company type definition --
export interface Company {
	id: number;
	name: string;
}

//-- Operator type definition --
export type Operator = {
	id: string;
	companyId: string;
	username: string;
	password: string;
	name: string;
	initials: string;
	email: string;
	phone: string;
	gender: string;
	isYou?: boolean;
	createdAt: string;
	updatedAt?: string;
	isActive?: boolean;
};

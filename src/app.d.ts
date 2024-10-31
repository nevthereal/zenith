import type { User } from '$lib/db/schema';
import type { Session } from '$lib/db/schema';

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
		}
	}
}

export {};

import type { AppUser, Session } from '$lib/auth';

declare global {
	namespace App {
		interface Locals {
			user: AppUser | null;
			session: Session | null;
		}
	}
}

export {};

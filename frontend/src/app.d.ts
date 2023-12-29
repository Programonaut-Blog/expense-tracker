import PocketBase from 'pocketbase';

declare global {
	declare namespace App {
		interface Locals {
			pb: Pocketbase;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}

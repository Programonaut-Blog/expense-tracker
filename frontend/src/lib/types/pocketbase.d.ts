/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Categories = "categories",
	Expenses = "expenses",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type CategoriesRecord = {
	icon?: string
	name?: string
}

export enum ExpensesCurrencyOptions {
	"€" = "€",
}
export type ExpensesRecord = {
	category?: RecordIdString
	currency?: ExpensesCurrencyOptions
	expense?: number
	label?: string
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CategoriesResponse<Texpand = unknown> = Required<CategoriesRecord> & BaseSystemFields<Texpand>
export type ExpensesResponse<Texpand = unknown> = Required<ExpensesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	categories: CategoriesRecord
	expenses: ExpensesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	categories: CategoriesResponse
	expenses: ExpensesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'categories'): RecordService<CategoriesResponse>
	collection(idOrName: 'expenses'): RecordService<ExpensesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}

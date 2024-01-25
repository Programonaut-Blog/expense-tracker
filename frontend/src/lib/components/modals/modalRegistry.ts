import type { ModalComponent } from "@skeletonlabs/skeleton";
import AddExpenseModal from "./AddExpenseModal.svelte";

export const modalRegistry: Record<string, ModalComponent> = {
    addExpenseModal: { ref: AddExpenseModal }
};
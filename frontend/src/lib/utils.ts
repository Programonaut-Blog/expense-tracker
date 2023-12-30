export const serializeNonPOJOs = (obj: any) => {
	return structuredClone(obj);
};
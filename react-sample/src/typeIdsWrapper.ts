import { typeIdToDataId, typeIdToID } from "./typeIds.js";

//react-selectでoptionsとして使うための形に変換する
export const typeIdOptions = [
	...Array.from(typeIdToDataId.keys()).map((key) => ({ label: key, value: typeIdToDataId.get(key) })),
	...Array.from(typeIdToID.keys()).map((key) => ({ label: key, value: typeIdToID.get(key) })),
];

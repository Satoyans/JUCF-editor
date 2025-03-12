import { typeIdToID } from "./typeIds";

//react-selectでoptionsとして使うための形に変換する
export const typeIdOptions = [...Array.from(typeIdToID.keys()).map((key) => ({ label: key, value: typeIdToID.get(key) }))];

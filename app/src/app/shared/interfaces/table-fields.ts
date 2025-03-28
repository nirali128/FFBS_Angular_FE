import { iActionField } from "./action-fields";

export interface iTableField {
    name: string,
    label: string,
    type: string,
    sort: boolean,
    arr?: iActionField[],
    disabled?: boolean
}
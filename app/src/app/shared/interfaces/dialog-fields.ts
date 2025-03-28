export interface iDialogField {
    title?: string,
    message?: string,
    btnOkText?: string,
    btnCancelText?: string
    requiresReason? :boolean
}

export interface DialogRepsone {
    confirmed: boolean;
    reason?: string;
}
export interface ColumnField<T> {
    key: keyof T;
    label: string;
    icon?: string; 
    labelType: 'title' | 'list' | 'badge' | 'description';
    isVisible: boolean;
}
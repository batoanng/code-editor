export type CellType = 'code' | 'text';

export interface Cell {
    id: string;
    content: string;
    type: CellType;
}

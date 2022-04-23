import { ActionType } from '../action-types';
import { Cell, CellType } from '../cell';
import { Direction } from '../direction';

export interface MoveCellAction {
    type: ActionType.MOVE_CELL;
    payload: {
        id: string;
        direction: Direction;
    };
}

export interface DeleteCellAction {
    type: ActionType.DELETE_CELL;
    payload: string;
}

export interface InsertCellAfterAction {
    type: ActionType.INSERT_CELL_AFTER;
    payload: {
        id: string | null;
        type: CellType;
    };
}

export interface UpdateCellAction {
    type: ActionType.UPDATE_CELL;
    payload: {
        id: string;
        content: string;
    };
}

export interface BundleStartAction {
    type: ActionType.BUNDLE_START;
    payload: {
        cellId: string;
    };
}

export interface BundleCompleteAction {
    type: ActionType.BUNDLE_COMPLETE;
    payload: {
        cellId: string;
        bundle: {
            code: string;
            err: string;
        };
    };
}

export interface FetchCellAction {
    type: ActionType.FETCH_CELL;
}

export interface FetchCellCompleteAction {
    type: ActionType.FETCH_CELL_COMPLETE;
    payload: Cell[];
}

export interface FetchCellErrorAction {
    type: ActionType.FETCH_CELL_ERROR;
    payload: string;
}

export interface SaveCellErrorAction {
    type: ActionType.SAVE_CELL_ERROR;
    payload: string;
}

export type Action =
    | MoveCellAction
    | DeleteCellAction
    | InsertCellAfterAction
    | UpdateCellAction
    | BundleStartAction
    | BundleCompleteAction
    | FetchCellAction
    | FetchCellCompleteAction
    | FetchCellErrorAction
    | SaveCellErrorAction;

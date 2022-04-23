import { Dispatch } from 'redux';
import { Action, DeleteCellAction, InsertCellAfterAction, MoveCellAction, UpdateCellAction } from '../actions';
import { ActionType } from '../action-types';
import { Cell, CellType } from '../cell';
import { Direction } from '../direction';
import bundler from '../../bundler';
import axios from 'axios';

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
    return {
        type: ActionType.MOVE_CELL,
        payload: {
            id,
            direction
        }
    };
};

export const deleteCell = (id: string): DeleteCellAction => {
    return {
        type: ActionType.DELETE_CELL,
        payload: id
    };
};

export const insertCellAfter = (id: string | null, type: CellType): InsertCellAfterAction => {
    return {
        type: ActionType.INSERT_CELL_AFTER,
        payload: {
            id,
            type
        }
    };
};

export const updateCell = (id: string, content: string): UpdateCellAction => {
    return {
        type: ActionType.UPDATE_CELL,
        payload: {
            id,
            content
        }
    };
};

export const createBundle = (cellId: string, input: string) => async (dispatch: Dispatch<Action>) => {
    dispatch({
        type: ActionType.BUNDLE_START,
        payload: {
            cellId
        }
    });

    const result = await bundler(input);

    dispatch({
        type: ActionType.BUNDLE_COMPLETE,
        payload: {
            cellId,
            bundle: {
                code: result.code,
                err: result.err
            }
        }
    });
};

export const fetchCell = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({ type: ActionType.FETCH_CELL });

        try {
            const { cells }: { cells: Cell[] } = await axios.get('/cells');
            dispatch({ type: ActionType.FETCH_CELL_COMPLETE, payload: cells });
        } catch (err: any) {
            dispatch({ type: ActionType.FETCH_CELL_ERROR, payload: err.message });
        }
    };
};

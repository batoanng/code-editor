import { Dispatch } from 'redux';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { RootState } from '../reducers';
import { saveCell } from '../action-creators';

export const persistMiddleware = ({
    dispatch,
    getState
}: {
    dispatch: Dispatch<Action>;
    getState: () => RootState;
}) => {
    let timer: any;
    return (next: (action: Action) => void) => {
        return (action: Action) => {
            next(action);
            if (
                [
                    ActionType.MOVE_CELL,
                    ActionType.DELETE_CELL,
                    ActionType.UPDATE_CELL,
                    ActionType.INSERT_CELL_AFTER
                ].includes(action.type)
            ) {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    saveCell()(dispatch, getState);
                }, 500);
            }
        };
    };
};

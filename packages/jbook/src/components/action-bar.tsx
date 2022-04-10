import React from 'react';
import styled from 'styled-components';
import { useActions } from '../hooks/use-actions';

const ActionBarStyle = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    opacity: 0.25;
    transition: opacity 0.3s;

    &:hover {
        opacity: 1;
    }
`;

export interface ActionBarProps {
    id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
    const { moveCell, deleteCell } = useActions();
    return (
        <ActionBarStyle>
            <button className="button is-primary is-small" onClick={() => moveCell(id, 'up')}>
                <span className="icon">
                    <i className="fas fa-arrow-up" />
                </span>
            </button>
            <button className="button is-primary is-small" onClick={() => moveCell(id, 'down')}>
                <span className="icon">
                    <i className="fas fa-arrow-down" />
                </span>
            </button>
            <button className="button is-primary is-small" onClick={() => deleteCell(id)}>
                <span className="icon">
                    <i className="fas fa-times" />
                </span>
            </button>
        </ActionBarStyle>
    );
};

export default ActionBar;

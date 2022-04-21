import React from 'react';
import styled from 'styled-components';
import { Cell } from '../state';
import CodeCell from './code-cell';
import TextEditor from './text-editor';
import ActionBar from './action-bar';

const CellListItemStyle = styled.div`
    position: relative;
    margin: 40px 10px;
`;

const ActionBarWrapperStyle = styled.div`
    height: 30px;
    width: 100%;
    background-color: #37414b;
`;

export interface CellListItemProps {
    cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
    let child: JSX.Element;
    if (cell.type === 'code') {
        child = (
            <>
                <ActionBarWrapperStyle>
                    <ActionBar id={cell.id} />
                </ActionBarWrapperStyle>
                <CodeCell cell={cell} />
            </>
        );
    } else {
        child = (
            <>
                <ActionBar id={cell.id} />
                <TextEditor cell={cell} />
            </>
        );
    }
    return <CellListItemStyle>{child}</CellListItemStyle>;
};

export default CellListItem;

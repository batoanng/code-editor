import React from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell';

const CellListStyle = styled.div`
    padding-top: 20px;
`;

export interface CellListProps {}

const CellList: React.FC<CellListProps> = () => {
    const cells = useTypedSelector(({ cells: { data, order } }) => order.map((id) => data[id]));

    const renderCells = cells.map((cell) => (
        <div key={cell.id}>
            <AddCell nextCellId={cell.id} />
            <CellListItem cell={cell} />
        </div>
    ));

    return (
        <CellListStyle>
            {renderCells}
            <AddCell nextCellId={null} isVisible={cells.length <= 0} />
        </CellListStyle>
    );
};

export default CellList;

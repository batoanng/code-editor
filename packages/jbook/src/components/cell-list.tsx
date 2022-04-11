import React from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell';

const CellListStyle = styled.div`
    padding: 20px 0;
`;

export interface CellListProps {}

const CellList: React.FC<CellListProps> = () => {
    const cells = useTypedSelector(({ cells: { data, order } }) => order.map((id) => data[id]));

    const renderCells = cells.map((cell) => (
        <div key={cell.id}>
            <CellListItem cell={cell} />
            <AddCell previousCellId={cell.id} />
        </div>
    ));

    return (
        <CellListStyle>
            <AddCell previousCellId={null} isVisible={cells.length <= 0} />
            {renderCells}
        </CellListStyle>
    );
};

export default CellList;

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell';
import { useActions } from '../hooks/use-actions';

const CellListStyle = styled.div`
    padding: 20px 0;
    margin: 0 25px;
`;

export interface CellListProps {}

const CellList: React.FC<CellListProps> = () => {
    const cells = useTypedSelector(({ cells: { data, order } }) => order.map((id) => data[id]));
    const { fetchCell, saveCell } = useActions();

    useEffect(() => {
        fetchCell();
    }, []);

    useEffect(() => {
        saveCell();
        // hacking way to deep compare
        // can be exchange with immutable object
    }, [JSON.stringify(cells)]);

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

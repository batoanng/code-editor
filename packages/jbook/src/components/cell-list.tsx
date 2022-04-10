import React from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';

export interface CellListProps {}

const CellList: React.FC<CellListProps> = () => {
    const cells = useTypedSelector(({ cells: { data, order } }) => order.map((id) => data[id]));

    const renderCells = cells.map((cell) => <CellListItem key={cell.id} cell={cell} />);

    return <>{renderCells}</>;
};

export default CellList;

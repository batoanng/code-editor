import React, { Props } from 'react';
import styled from 'styled-components';
import { useActions } from '../hooks/use-actions';

interface AddCellStyleProps {
    isVisible?: boolean;
}

const AddCellStyle = styled.div<AddCellStyleProps>`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease-in 0.1s;
    margin: 10px 0;
    opacity: ${(props) => (props.isVisible ? 1 : 0)};

    &:hover {
        opacity: 1;
    }

    button {
        margin: 0 20px;
    }
`;

const DividerStyle = styled.div`
    position: absolute;
    top: 50%;
    bottom: 50%;
    left: 2.5%;
    right: 2.5%;
    width: 95%;

    border-bottom: 1px solid gray;
    z-index: -1;
`;

export interface AddCellProps {
    previousCellId: string | null;
    isVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ previousCellId, isVisible }) => {
    const { insertCellAfter } = useActions();
    return (
        <AddCellStyle isVisible={isVisible}>
            <button
                className="button is-rounded is-primary is-small"
                onClick={() => insertCellAfter(previousCellId, 'code')}
            >
                <span className="icon is-small">
                    <i className="fas fa-plus" />
                </span>
                <span>Code</span>
            </button>
            <button
                className="button is-rounded is-primary is-small"
                onClick={() => insertCellAfter(previousCellId, 'text')}
            >
                <span className="icon is-small">
                    <i className="fas fa-plus" />
                </span>
                <span>Text</span>
            </button>
            <DividerStyle />
        </AddCellStyle>
    );
};

export default AddCell;

import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import CodeEditor, { CodeEditorProps } from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

const StyleCell = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
`;

const StyleCellContainer = styled.div`
    margin-bottom: 10px;
`;

const fadeIn = keyframes`
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const PreviewWrapperStyle = styled.div`
    height: 100%;
    flex-grow: 1;
    background-color: white;
`;

const LoadingStyle = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 10%;
    padding-right: 10%;
    animation: ${fadeIn} 0.5s;
`;

export interface CodeCellProps {
    cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
    const { updateCell, createBundle } = useActions();
    const bundle = useTypedSelector(({ bundles }) => bundles[cell.id]);
    const cumulativeCode = useTypedSelector((state) => {
        const { order, data } = state.cells;
        const orderedCells = order.map((id) => data[id]);
        const result = [];
        for (const c of orderedCells) {
            if (c.type === 'code') {
                result.push(c.content);
            }
            if (c.id === cell.id) {
                break;
            }
        }
        return result;
    });

    useEffect(() => {
        // Create bundle for the first time
        // no need to wait 1 sec
        if (!bundle) {
            createBundle(cell.id, cumulativeCode.join('\n'));
            return;
        }

        const timer = setTimeout(() => {
            createBundle(cell.id, cumulativeCode.join('\n'));
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [cell.id, cumulativeCode.join('\n')]);

    const codeEditorProps: CodeEditorProps = {
        initialValue: cell.content,
        onChange: (value) => updateCell(cell.id, value)
    };

    return (
        <StyleCellContainer>
            <Resizable direction="vertical">
                <StyleCell>
                    <Resizable direction="horizontal">
                        <CodeEditor {...codeEditorProps} />
                    </Resizable>
                    <PreviewWrapperStyle>
                        {!bundle || bundle.loading ? (
                            <LoadingStyle>
                                <progress className="progress is-small is-primary">Loading...</progress>
                            </LoadingStyle>
                        ) : (
                            <Preview code={bundle.code} err={bundle.err} />
                        )}
                    </PreviewWrapperStyle>
                </StyleCell>
            </Resizable>
        </StyleCellContainer>
    );
};

export default CodeCell;

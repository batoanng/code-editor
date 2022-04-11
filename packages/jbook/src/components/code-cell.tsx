import React, { useEffect } from 'react';
import styled from 'styled-components';
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

export interface CodeCellProps {
    cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
    const { updateCell, createBundle } = useActions();
    const bundle = useTypedSelector(({ bundles }) => bundles[cell.id]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            await createBundle(cell.id, cell.content);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [cell.id, cell.content]);

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
                    {bundle && <Preview code={bundle.code} err={bundle.err} />}
                </StyleCell>
            </Resizable>
        </StyleCellContainer>
    );
};

export default CodeCell;

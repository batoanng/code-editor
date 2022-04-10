import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CodeEditor, { CodeEditorProps } from './code-editor';
import Preview from './preview';
import bundler from '../bundler';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

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
    const [code, setCode] = useState('');
    const [err, setErr] = useState('');
    const { updateCell } = useActions();

    useEffect(() => {
        const timer = setTimeout(async () => {
            const compiledCode = await bundler(cell.content);
            setCode(compiledCode.code);
            setErr(compiledCode.err);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [cell.content]);

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
                    <Preview code={code} err={err} />
                </StyleCell>
            </Resizable>
        </StyleCellContainer>
    );
};

export default CodeCell;

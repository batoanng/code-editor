import '../libs/resizable.css';
import React from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';

interface ResizableProps {
    direct: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direct, children }) => {
    let resizableProps: ResizableBoxProps;

    if (direct === 'vertical') {
        resizableProps = {
            height: 300,
            width: Infinity,
            resizeHandles: ['s'],
            minConstraints: [Infinity, 40],
            maxConstraints: [Infinity, window.innerHeight * 0.9]
        };
    } else {
        resizableProps = {
            height: Infinity,
            width: window.innerWidth * 0.75,
            resizeHandles: ['e'],
            minConstraints: [window.innerWidth * 0.2, Infinity],
            maxConstraints: [window.innerWidth * 0.75, Infinity],
            className: 'resize-horizontal'
        };
    }

    return (
        <>
            <ResizableBox {...resizableProps}>{children}</ResizableBox>
        </>
    );
};

export default Resizable;

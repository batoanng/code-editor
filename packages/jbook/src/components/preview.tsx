import React, { useEffect, useRef } from 'react';

export interface PreviewProps {
    code: string;
}

const html = `
    <html lang='en'>
        <head title='Code Preview'><title>Code Preview</title></head>
        <body>
            <div id='root'></div>
            <script>
                window.addEventListener('message', (event) => {
                    try {
                      eval(event.data);
                    } catch (e) {
                        const rootEl = document.querySelector('#root');
                        rootEl.innerHTML = '<div style="color: red"><h4>Runtime Error</h4>' + e + '</div>';
                        throw e;
                    }
                }, false);
            </script>
        </body>
    </html>
`;

const Preview: React.FC<PreviewProps> = ({ code }) => {
    const iframe = useRef<any>();

    useEffect(() => {
        iframe.current.srcdoc = html;

        // setTimeout is used because of the time gap from send and receive event
        // affects iframe.current.srcdoc = html; run again
        setTimeout(() => {
            // Instead of use set code, we use this to overcome passing event from parent to child
            // Also pass code as a string, prevent case unescaped code
            iframe.current.contentWindow.postMessage(code, '*');
        }, 1000);
    }, [code]);

    return <iframe title="Code Preview" sandbox="allow-scripts" srcDoc={html} ref={iframe} />;
};

export default Preview;

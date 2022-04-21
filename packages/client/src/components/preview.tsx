import '../libs/preview.css';
import React, { useEffect, useRef } from 'react';

export interface PreviewProps {
    code: string;
    // Instead of solving CORS when communicate between root and iframe
    // use this prop to render the bundling error
    err: string;
}

const html = `
    <html lang='en'>
        <head title='Code Preview'>
            <title>Code Preview</title>
            <style>
                html{
                    background-color: white;
                }
            </style>
        </head>
        <body>
            <div id='root'></div>
            <script>
                const handleError = err => {
                    const rootEl = document.querySelector('#root');
                    rootEl.innerHTML = '<div style="color: red"><h4>Runtime Error</h4>' + err + '</div>';
                    throw err;
                }

                // This is used to handle the async error (ex. error from setTimeOut)
                // catch async error and process the same as sync error
                // event.preventDefault(); is used to prevent the default log error
                window.addEventListener('error', (event) => {
                    event.preventDefault();
                    handleError(event.error);
                });

                window.addEventListener('message', (event) => {
                    eval(event.data);
                }, false);
            </script>
        </body>
    </html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
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

    return (
        <div className="preview-wrapper">
            <iframe
                title="Code Preview"
                sandbox="allow-scripts"
                srcDoc={html}
                ref={iframe}
                height="100%"
                width="100%"
            />
            {err && <div className="preview-error">{err}</div>}
        </div>
    );
};

export default Preview;

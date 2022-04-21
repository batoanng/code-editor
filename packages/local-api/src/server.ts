import 'source-map-support/register';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';

const app = express();

startServer();

function startServer() {
    const host = process.env.HOST || '0.0.0.0';
    const port = process.env.PORT || '5000';

    app.listen({ host, port }, () => {
        console.log(`Server ready at http://localhost:${port}`);
    });
}

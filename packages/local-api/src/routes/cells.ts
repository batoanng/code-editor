import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
    id: string;
    content: string;
    type: 'code' | 'text';
}

export const createCellsRouter = (filename: string, dir: string) => {
    const router = express.Router();
    router.use(express.json());

    const fullPath = path.join(dir, 'books', filename);

    router.get('/cells', async (req: express.Request, res: express.Response) => {
        try {
            const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
            res.send(JSON.parse(result));
        } catch (err) {
            // @ts-ignore
            if (err.code === 'ENOENT') {
                // if file is not existed
                // create file and add default cells
                await fs.writeFile(fullPath, '[]', 'utf-8');
                res.send([]);
            } else {
                throw err;
            }
        }
    });

    router.post('/cells', async (req: express.Request, res: express.Response) => {
        const { cells }: { cells: Cell[] } = req.body;
        await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
        res.send({ status: 'ok' });
    });

    return router;
};

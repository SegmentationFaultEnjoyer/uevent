const { createServer: createViteServer } = require('vite');
const { server } = require('./api/server');
const { readFileSync } = require('fs');
const { resolve } = require('path');
 
async function injectViteMiddleWare() {
    const vite = await createViteServer({
        server: { middlewareMode: true} ,
        appType: 'custom'
    })

    server.use(vite.middlewares);

    server.use('*', async (req, resp, next) => {
        const url = req.originalUrl;

        try {
            let template = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');

            template = await vite.transformIndexHtml(url, template);

            const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');

            const appHtml = await render(url);

            const html = template.replace(`<!--ssr-outlet-->`, appHtml);

            resp.status(200).set({ 'Content-Type': 'text/html' }).end(html);
            
        } catch (error) {
            vite.ssrFixStacktrace(error);
            next(error);
        }
    })
}

module.exports = injectViteMiddleWare;

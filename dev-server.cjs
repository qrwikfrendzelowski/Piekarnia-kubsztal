const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 8000);
const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const requestedFile = path.resolve(root, `.${pathname}`);

  if (!requestedFile.startsWith(`${root}${path.sep}`) && requestedFile !== root) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  const file = pathname === '/' ? path.join(root, 'index.html') : requestedFile;
  fs.readFile(file, (error, content) => {
    if (error) {
      if (request.headers.accept?.includes('text/html') && !path.extname(pathname)) {
        fs.readFile(path.join(root, 'index.html'), (indexError, indexContent) => {
          if (indexError) {
            response.writeHead(500).end('Unable to load the application entry point.');
            return;
          }
          response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(indexContent);
        });
        return;
      }
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': `${contentTypes[path.extname(file)] || 'application/octet-stream'}; charset=utf-8`,
    });
    response.end(content);
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`Piekarnia Kubsztal is available at http://127.0.0.1:${port}`);
});

const http = require('http');
const log4js = require('log4js');

const hostname = '0.0.0.0';
const port = 3000;

log4js.configure('logs/displa.log')

// log4js.configure({
//     appenders: [
//         { type: 'console' },
//         { type: 'file', filename: 'logs/test.log', category: 'cheese' }
//     ]
// });

const logger = log4js.getLogger('cheese');

const server = http.createServer((req: any, res: { statusCode: number; setHeader: (arg0: string, arg1: string) => void; end: (arg0: string) => void; }) => {
    console.log('Serving request')
    logger.info('Serving request')
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
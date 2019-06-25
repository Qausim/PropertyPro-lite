/* eslint-disable linebreak-style */
import http from 'http';

import app from './app';

const PORT = 3000;
const server = http.createServer(app);

app.get('/', (request, response) => response.status(200).send('Welcome to PropertyPro-lite'));

server.listen(PORT, () => console.log(`Server running on ${PORT}`));

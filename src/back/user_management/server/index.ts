// import Fastify from 'fastify';
// import userRoutes from '../../api/user_management/routes';
// import pongRoutes from '../../pong_app/api/routes';
// // import tetrisRoutes from '../../api/tetris/routes';
//
// const fastify = Fastify({ logger: true });
//
// // Register routes
// // TODO: Create the others API
// fastify.register(userRoutes, { prefix: '/api/user' });
// fastify.register(pongRoutes, { prefix: '/api' });
// // fastify.register(tetrisRoutes, { prefix: '/api/tetris' });
//
//
// // TODO: Make it the rout to the SPA
// fastify.get('/', async (request, reply) => {
//     return { message: 'test' };});
//
// // Start the server
// fastify.listen({ port: 3000 }, (err) => {
//     if (err) {
//         fastify.log.error(err);
//         process.exit(1);
//     }
//     console.log('Server is running on http://localhost:3000');
// });

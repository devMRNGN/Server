const fastify = require("fastify")({
  logger: true,
});

fastify.register(require('@fastify/cors'), {});

// Declare a route
fastify.register(require('./routes'));

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});

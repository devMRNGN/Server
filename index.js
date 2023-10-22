require('dotenv').config();

const fastify = require("fastify")({
  logger: true,
});

fastify.register(require('@fastify/cors'), {});

// Declare a route
fastify.register(require('./routes'));

// Run the server!
fastify.listen({ port: Number(process.env.PORT) || 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running`);
});

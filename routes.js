const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  fastify.get("/users", async (request, reply) => {
    const users = await prisma.user.findMany();

    return users;
  });

  //funcionando
  fastify.post("/cadastrar", async (request, reply) => {
    const { username, password, email, photo, name, curso } = request.body;
    console.log(`BODY ===========> ${request.body}`);

    try {
      const user = await prisma.user.findFirst({
        where: {OR: [{username},{email}]}
      });
  
      if(!user){
        const createUser = await prisma.user.create({
          data: {
            email: email,
            password: password,
            username: username,
            curso: curso,
            name: name,
            photo: photo
          }
        });

        return reply
          .status(200)
          .header("Content-Type", "application/json")
          .send(JSON.stringify({response: `Sua conta com username: ${createUser.username} foi criada`, success: true}));
      }
      
      if(user.email === email){
        return reply
        .status(200)
        .header("Content-Type", "application/json")
        .send(JSON.stringify({response: `Email: ${user.email} já está cadastrado`, success: false}));
      }else if(user.username === username){
        return reply
        .status(200)
        .header("Content-Type", "application/json")
        .send(JSON.stringify({response: `Username: ${user.username} ja está sendo utilizado.`, success: false}));
      }

    } catch(e){
      return reply
        .status(500)
        .header("Content-Type", "application/json")
        .send(JSON.stringify({erro: `Aconteceu um erro inesperado: ${e}`, success: false}));
    } 
  });

  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;

    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{username: email},{email: email}],
          password
        }
      });

      if(user){
        const userToken = { name: email };
        const accessToken = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET);

        return reply
          .status(200)
          .header("Content-Type", "application/json")
          .send(JSON.stringify({login: true ,accessToken: accessToken, user: user.username, photo: user.photo}));
      }

      return reply
        .status(200)
        .header("Content-Type", "application/json")
        .send(JSON.stringify({login: false}));

    } catch(e){
      return reply
        .status(500)
        .header("Content-Type", "application/json")
        .send(JSON.stringify({erro: `Aconteceu um erro inesperado: ${e}`}));
    }
  });
}

module.exports = routes;
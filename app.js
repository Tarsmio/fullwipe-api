const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors')

const stageRouter = require("./routes/stage")
const teamRouter = require("./routes/team")
const matchRouter = require("./routes/match")
const groupRouter = require("./routes/group");
const logger = require('./logger');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Fullwipe API',
            version: '0.0.1',
            description: 'Une API destiné au backend du site fullwipe de esportBrosTV',
        },
        servers: [
            {
                url: `${process.env.URL_API}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to your API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

const app = express();

app.use(express.json())

app.use(cors())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//routes
app.use('/stage', stageRouter)
app.use('/team', teamRouter)
app.use('/match', matchRouter)
app.use('/group', groupRouter)

module.exports = app;
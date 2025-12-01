const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors')

const stageRouter = require("./routes/stage")

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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(cors())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//routes
app.use('/stage', stageRouter)

module.exports = app;
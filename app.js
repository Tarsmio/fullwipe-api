const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors')
const YAML = require('yamljs')

const stageRouter = require("./routes/stage")
const teamRouter = require("./routes/team")
const matchRouter = require("./routes/match")
const groupRouter = require("./routes/group");
const messageRouter = require("./routes/message")
const logger = require('./logger');

const swaggerDocs = YAML.load("./doc.yml");

const app = express();

app.use(express.json())

app.use(cors())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//routes
app.use('/stage', stageRouter)
app.use('/team', teamRouter)
app.use('/match', matchRouter)
app.use('/group', groupRouter)
app.use('/message', messageRouter)

module.exports = app;
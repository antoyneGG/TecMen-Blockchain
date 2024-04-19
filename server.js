const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;
app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
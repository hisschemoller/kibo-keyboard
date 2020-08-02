const express = require('express');

const app = express();
const port = process.env.PORT || 3016;

// Set docs folder as root
app.use(express.static('docs'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Listen for HTTP requests on port 3016
app.listen(port, () => {
  console.log('listening on %d', port);
});

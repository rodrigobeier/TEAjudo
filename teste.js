const express = require('express');
console.log('Express carregado:', typeof express);
console.log('express.Router é função:', typeof express.Router);
const app = express();
console.log('app é função:', typeof app);
app.get('/', (req, res) => res.send('OK'));
app.listen(3000, () => console.log('Teste rodando'));
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// collection: 
// wallet {
//     id: sytem generated
//     balance: decimal upto 4
//     name: string

// }

// transaction {
//     id: system generated
//     walletId: string
//     amount: decimal upto 4
//     balance: decimal upto 4
//     description: text
//     type: "CREDIT"/"DEBIT"
//     timestamp: date

// }
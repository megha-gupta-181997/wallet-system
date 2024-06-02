# Wallet System

This service Initialize the wallet and allows credit and debit transaction.

## Getting Started
Following are the steps to get started with the service up and running.

### Pre requisites
* Nodejs
* MongoDB

### Database Schema

![alt text](https://drive.google.com/file/d/1m1p3hbOIHhu-4Hd76Mj8oJiVmrHRR8PS/view?usp=sharing)

### Installing
Clone the project
username: megha-gupta-181997
token: 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

In the project folder, run `npm install`, Once node_modules are installed, run `node index.js`
Setup mongodb connection string in the env file with key `MONGO_DB_CONNECT_STRING`. 

## Project Live On
http://34.131.74.77:4000/

Health Route: http://34.131.74.77:4000/health

# API's

### Initialize Wallet

```
Method: POST
Endpoint: /setup
Payload: {
    "name": "Wallet-r2",
    "balance":10.2333
}

Response: 201 Created

Response: {
    "data": {
        "id": "665c34406ab4c576cbce211a",
        "balance": 10.2333,
        "transactionId": "665c34406ab4c576cbce211c",
        "name": "wallet-r2",
        "date": "2024-06-02T08:58:40.622Z"
    },
    "error": ""
}

Response: 400 Bad Request

Response: {
    "data": "",
    "error": "Given wallet name exist"
}
```

### Credit/Debit Wallet

```
Method: POST
Endpoint: /transact/:walletId
Payload: {
    "amount": 2.90, // for debit, add minus 
    "description": "Recharge"
}

Response: 200 Ok

Response: {
    "data": {
        "balance": 13.1333,
        "transactionId": "665c358f6ab4c576cbce2122"
    },
    "error": ""
}

Response: 400 Bad Request

Response: {
    "data": "",
    "error": "Wallet does not exist"
}
```

### Get Wallet

```
Method: GET
Endpoint: /wallet/:walletId

Response: 200 Ok

Response: {{
    "data": {
        "id": "665c34406ab4c576cbce211a",
        "balance": 13.1333,
        "name": "wallet-r2"
    },
    "error": ""
}

Response: 400 Bad Request

Response: {
    "data": "",
    "error": "Wallet does not exist"
}
```

### Get Transactions

```
Method: GET
Endpoint: /transactions?walletId=665a251b656b9113d90fe4ae&skip=0&limit=10

Response: 200 Ok

Response: {
    "data": [
        {
            "id": "665c34406ab4c576cbce211c",
            "walletId": "665c34406ab4c576cbce211a",
            "amount": 10.2333,
            "balance": 10.2333,
            "description": "Setup",
            "type": "CREDIT",
            "date": "2024-06-02T08:58:40.622Z"
        },
        {
            "id": "665c35ff6ab4c576cbce212a",
            "walletId": "665c34406ab4c576cbce211a",
            "amount": 2.9,
            "balance": 13.1333,
            "description": "Recharge",
            "type": "CREDIT",
            "date": "2024-06-02T09:06:07.771Z"
        }
    ],
    "error": ""
}
```
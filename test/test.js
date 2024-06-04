const chai = require('chai');
const chaiHttp = require('chai-http');

let wallet = ""

const server = require('../index');
chai.use(chaiHttp);


describe('Initialize Wallet', () => {
    const name = `${Date.now()}`;
    it('Initialize Wallet with correct payload', (done) => {
        chai.request(server)
            .post('/setup')
            .set('content-type', 'application/json')
            .send({
                "name": name,
                "balance": 100
            })
            .end((err, res) => {
                wallet = res.body.data.id
                chai
                    .expect(res).to.have.status(201);
                chai
                    .expect(res.body.data).to.have.property("id").length("24");
                    chai.expect(res.body.data).to.have.property("balance").equals(100);
                    chai.expect(res.body.data).to.have.property("name").equals(name);
                    chai.expect(res.body.data).to.have.property("transactionId").length("24");
                    chai.expect(res.body.data).to.have.property("date");
                done();
            })
    });

    it('Test should fail with existing wallet name', (done) => {
        chai.request(server)
            .post('/setup')
            .set('content-type', 'application/json')
            .send({
                "name": name,
                "balance": 100
            })
            .end((err, res) => {
            chai
                .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals("Given wallet name exist");
            done();
        });
    });

    it('Test should fail with balance less than 0',  (done) => {
        chai.request(server)
        .post('/setup')
        .set('content-type', 'application/json')
        .send({
            "name": name,
            "balance": -1
        })
        .end((err, res) => {
            chai
            .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals('"balance" must be greater than or equal to 1');
            done();
        });
    });

    it('Test should fail with name having less than 5 character',  (done) => {
        chai.request(server)
        .post('/setup')
        .set('content-type', 'application/json')
        .send({
            "name": "test",
            "balance": 100
        })
        .end((err, res) => {
            chai
                .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals("\"name\" length must be at least 5 characters long");
            done();
        });
    });

    it('Test should fail with name having more than 15 character',  (done) => {
        chai.request(server)
        .post('/setup')
        .set('content-type', 'application/json')
        .send({
            "name": "Testtestingtesing tesingting testing",
            "balance": 100
        })
        .end((err, res) => {
            chai
                .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals("\"name\" length must be less than or equal to 15 characters long");
            done();
        });
    });

    it('Test should fail with balance having more 4 decimal places',  (done) => {
        chai.request(server)
            .post('/setup')
            .set('content-type', 'application/json')
            .send({
                "name": name,
                "balance": 100.42678
            })
            .end((err, res) => {
            chai
                .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).to.equal("\"balance\" must have no more than 4 decimal places");
            done();
        });
    });
});

describe('Credit Debit Wallet', () => {

    it('Credit Debit Wallet with correct payload',  (done) => {
        chai.request(server)
        .post(`/transact/${wallet}`)
        .set('content-type', 'application/json')
        .send({
            "amount": 100.6,
            "description": "recharge"
        })
        .end((err, res) => {
            chai
                .expect(res).to.have.status(200);
            chai
                .expect(res.body.data)
                chai.expect(res.body.data).to.have.property("balance").equals(200.6)
                chai.expect(res.body.data).to.have.property("transactionId").length("24");
            done();
        });
    });


    it('Test should fail when amount is greater than balance in case of debit transaction',  (done) => {
        chai.request(server)
        .post(`/transact/${wallet}`)
        .set('content-type', 'application/json')
        .send({
            "amount": -200.61,
            "description": "paid at grocery"
        })
        .end((err, res) => {
            chai
            .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals("Wallet balance cannot be zero");
            done();
        });
    });

    it('Test should fail with wrong wallet Id',  (done) => {
        chai.request(server)
        .post(`/transact/665f226347d629f003cb2c11`)
        .set('content-type', 'application/json')
        .send({
            "amount": 100.7,
            "description": "recharge"
        })
        .end((err, res) => {
            chai
                .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals("Wallet does not exist");
            done();
        });
    });

    it('Test should fail with amount value with more than 4 decimal place',  (done) => {
        chai.request(server)
        .post(`/transact/${wallet}`)
        .set('content-type', 'application/json')
        .send({
            "amount": 100.672133,
            "description": "recharge"
        })
        .end((err, res) => {
            chai
                .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).to.equal("\"amount\" must have no more than 4 decimal places");
            done();
        });
    });

    it('Test should fail with no description key',  (done) => {
        chai.request(server)
        .post(`/transact/${wallet}`)
        .set('content-type', 'application/json')
        .send({
            "amount": 100.6
        })
        .end((err, res) => {
            chai
                .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).to.equal("\"description\" is required");
            done();
        });
    });
});

describe('Get Wallet', () => {

    it('Get Wallet with correct payload',  (done) => {
        chai.request(server)
        .get(`/wallet/${wallet}`)
        .set('content-type', 'application/json')
        .end((err, res) => {
            chai
                .expect(res).to.have.status(200);
            chai
                .expect(res.body.data)
                chai.expect(res.body.data).to.have.property("id").length("24")
                chai.expect(res.body.data).to.have.property("balance")
                chai.expect(res.body.data).to.have.property("name");
            done();
        });
    });


    it('Test should fail when wrong wallet Id is passed',  (done) => {
        chai.request(server)
        .get(`/wallet/665f226347d629f003cb2c11`)
        .set('content-type', 'application/json')
        .end((err, res) => {
            chai
            .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals("Wallet does not exist");
            done();
        });
    });

    it('Test should fail with wrong wallet Id',  (done) => {
        chai.request(server)
        .get(`/wallet/665f226347d629f003cb2c1`)
        .set('content-type', 'application/json')
        .end((err, res) => {
            chai
                .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals("\"id\" length must be at least 24 characters long");
            done();
        });
    });
});

describe('Get Transactions', () => {

    it('Get Transactions with correct payload',  (done) => {
        chai.request(server)
        .get(`/transactions?walletId=${wallet}&skip=0&limit=2`)
        .set('content-type', 'application/json')
        .end((err, res) => {
            chai
                .expect(res).to.have.status(200);
            chai
                .expect(res.body.data).to.be.an('array')
                chai
                .expect(res.body.data.length).to.be.above(0);
                chai.expect(res.body.data[0]).to.have.property("id").length("24")
                chai.expect(res.body.data[0]).to.have.property("walletId").length("24")
                chai.expect(res.body.data[0]).to.have.property("amount")
                chai.expect(res.body.data[0]).to.have.property("description")
                chai.expect(res.body.data[0]).to.have.property("balance")
                chai.expect(res.body.data[0]).to.have.property("type")
                chai.expect(res.body.data[0]).to.have.property("date");
            done();
        });
    });


    it('Test should fail when wrong wallet Id is passed',  (done) => {
        chai.request(server)
        .get(`/transactions?walletId=665f226347d629f003cb2c1&skip=0&limit=2`)
        .set('content-type', 'application/json')
        .end((err, res) => {
            chai
            .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals("\"walletId\" length must be at least 24 characters long");
            done();
        });
    });

    it('Test should fail when wrong limit is not passed',  (done) => {
        chai.request(server)
        .get(`/transactions?walletId=665f226347d629f003cb2c11&skip=0&limit=`)
        .set('content-type', 'application/json')
        .end((err, res) => {
            chai
            .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals("\"limit\" is not allowed to be empty");
            done();
        });
    });

    it('Test should fail when wrong skip is not passed',  (done) => {
        chai.request(server)
        .get(`/transactions?walletId=665f226347d629f003cb2c47&skip=&limit=2`)
        .set('content-type', 'application/json')
        .end((err, res) => {
            chai
            .expect(res).to.have.status(400);
            chai
                .expect(res.body.error).equals("\"skip\" is not allowed to be empty");
            done();
        });
    });
});
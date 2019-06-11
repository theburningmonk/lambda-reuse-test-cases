const expect = require('chai').expect
const when   = require('../steps/when')

describe('When we hit the GET / endpoint', () => {
  it('Should return a stark warning message', async () => {
    let res = await when.we_invoke_get();
    console.log(res);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal("winter is coming");
  })
})
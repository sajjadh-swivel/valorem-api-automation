import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
const expect = chai.expect;

class AssertionHandler {
  assertEqual(actual, expected, message = "") {
    return expect(actual, message).to.equal(expected);
  }

  assertNotEqual(actual, expected, message = "") {
    return expect(actual, message).to.not.equal(expected);
  }

  assertTrue(actual, message = "") {
    return expect(actual, message).to.be.true;
  }

  assertTruthy(actual, message = "") {
    return expect(actual, message).to.be.ok;
  }

  assertFalse(actual, message = "") {
    return expect(actual, message).to.be.false;
  }

  assertThrows(fn, message = "") {
    return expect(fn, message).to.throw();
  }

  assertThrowsAsync(fn, message = "") {
    return expect(fn, message).to.be.rejected;
  }

  async assertElementDisplayed(element, message = "") {
    await element.waitForDisplayed(5000);
    return expect(element, message).to.exist;
  }

  async assertElementClickable(element, message = "") {
    await element.waitForClickable(5000);
    return expect(element, message).to.exist;
  }

  async assertContains(actual, expected, message = "") {
      assert.ok(actual.includes(expected), message);

  }
}
export default new AssertionHandler();

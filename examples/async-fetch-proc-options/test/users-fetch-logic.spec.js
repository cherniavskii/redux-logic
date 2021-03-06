
import expect from 'expect';
import { usersFetchLogic } from '../src/users/logic';

describe('usersFetchLogic', () => {
  describe('using valid url', () => {
    let resolvedValue;
    beforeEach((done) => {
      const httpClient = {
        get(url) {
          return new Promise((resolve, reject) => {
            resolve({
              data: { // match shape of reqres.in api
                data: [{ id: 1 }]
              }
            });
          });
        }
      };

      usersFetchLogic.process({ httpClient })
        .then(result => {
          resolvedValue = result;
          done();
        });
    });

    it('should return promise that resolves to users', () => {
      expect(resolvedValue).toEqual([{ id: 1 }]);
    });
  });

  describe('invalid url', () => {
    let rejectedValue;
    beforeEach((done) => {
      const httpClient = {
        get(url) {
          return new Promise((resolve, reject) => {
            reject(new Error('not found 404'));
          });
        }
      };

      usersFetchLogic.process({ httpClient })
        .catch(err => {
          rejectedValue = err;
          done();
        });
    });

    it('should reject to a 404 error', () => {
      expect(rejectedValue.message).toBe('not found 404');
    });
  });
});

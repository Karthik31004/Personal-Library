/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
var id1;
suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({ "title": "Harry Potter" })
            .end(function(err , res) {
              assert.equal(res.status , 200)
              assert.isObject(res.body , 'response should be in object')
              assert.property(res.body , 'title' , 'Response should contain title')
              assert.property(res.body , '_id' , 'Response should contain _id')
              id1 = res.body._id;
              done();
        })
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err , res) {
            assert.equal(res.status , 200)
            assert.isString(res.body , 'response should be in string')
            assert.equal(res.body , 'missing required field title')
            done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
            .get('/api/books')
            .end(function(err , res) {
              assert.equal(res.status , 200)
              assert.isArray(res.body , 'Response should be in array')
              assert.isObject(res.body[0] , 'Each of them in the array are in object')
              assert.property(res.body[0] , 'title' , 'Each object should contain a propery title')
              assert.property(res.body[0] , '_id' , 'Each object should contain a propery _id')
              assert.property(res.body[0] , 'commentcount' , 'Each object should contain a propery commentcount')
              done();
                 })
        
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
            .get('/api/books/60432548fef58e7084b5b82q')
            .end((err , res) => {
              assert.equal(res.status , 200)
              assert.isString(res.body , 'Response should be in string')
              assert.equal(res.body , 'no book exists')
              done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
            .get(`/api/books/${id1}`)
            .end((err , res) => {
              assert.equal(res.status , 200)
              assert.isObject(res.body , 'Response should be in object')
              assert.property(res.body , 'title' , 'title should be present in the object')
              assert.property(res.body , '_id' , '_id should be present in the object')
              assert.property(res.body , 'comments' , 'comments should be present in the object')
              done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
            .post(`/api/books/${id1}`)
            .send({ comment: 'Extra-ordinary' })
            .end((err , res) => {
              assert.equal(res.status , 200)
              assert.isObject(res.body , 'Response should be in object')
              assert.property(res.body , 'title' , 'title should be present in the object')
              assert.property(res.body , '_id' , '_id should be present in the object')
              assert.property(res.body , 'comments' , 'comments should be present in the object')
              done();
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
            .post(`/api/books/${id1}`)
            .end((err , res) => {
              assert.equal(res.status , 200)
              assert.isString(res.body , 'Response should be in string')
              assert.equal(res.body , 'missing required field comment')
              done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
            .post('/api/books/60432548fef58e7084b5b82q')
            .send({ comment: 'Awesome' })
            .end((err , res) => {
              assert.equal(res.status , 200)
              assert.isString(res.body , 'Response should be in string')
              assert.equal(res.body , 'no book exists')
              done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
            .delete(`/api/books/${id1}`)
            .end((err , res) => {
              assert.equal(res.status , 200)
              assert.isString(res.body , 'Response shoubd be in string')
              assert.equal(res.body , 'delete successful')
              done();
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
            .delete('/api/books/60432548fef58e7084b5b82q')
            .end((err , res) => {
              assert.equal(res.status , 200)
              assert.isString(res.body , 'Response should be in string')
              assert.equal(res.body , 'no book exists')
              done();
        })
        //done();
      });

    });

  });

});

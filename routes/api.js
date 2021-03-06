/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
var Books = require('../models/bookSchema');

module.exports = function (app) {
  mongoose.connect(process.env.DB_URI , {useUnifiedTopology: true , useFindAndModify: false , useNewUrlParser: true} , (err , done) => {
    if(err) console.log(err)
    else console.log("Connected")
  })
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Books.find({} , (err , arrayOfBooks) => {
        let result = [];
        
        for(let book of arrayOfBooks)  {
          let obj = {_id: book._id , title: book.title , comments: book.comment , commentcount: book.comment.length};
          result.push(obj);
        }
        return res.json(result)
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      
      if(!title)
        return res.json("missing required field title")
      else  {
        var newBook = new Books({
          title: title
        })
        
        newBook.save()
          .then(data => res.json({ _id: data._id , title: data.title , comment: data.comment}))
          .catch(err => console.log("error in insert "))
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Books.remove({} , (err , data) => {
        if(!err && data)
        return res.send("complete delete successful");
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Books.findById(bookid , (err , doc) => {
        if(err)  return res.json("no book exists")
        else return res.json({ title: doc.title ,_id: doc._id , comments: doc.comment})
      }).catch(err => res.json("no book exists"))
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if( !comment)
        {
          return res.json("missing required field comment")
        }
      //json res format same as .get
      Books.findByIdAndUpdate( bookid , { $push: {comment: comment} } , {new: true} )
            .then( data => res.json({ _id: data._id , title: data.title  ,comments: data.comment }) )
            .catch(err => res.json("no book exists"))
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Books.findByIdAndDelete(bookid , (err , doc) => {
        if(err) return res.json("no book exists")
        return res.json("delete successful")
      })
    });
  
};

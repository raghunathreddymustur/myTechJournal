//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "This site is stimulation of blogs, which consits of information about techonology and Computer science that i learnt every day.  ";
const aboutContent = "Currently, an undergraduate pursuing B. Tech focused on Computer Science and Engineering. Willing to obtain a position that will allow me to utilize my technical skills and willingness to learn and add to the success of the organization.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-raghu:Test123@cluster0-infww.mongodb.net/blogpostsDB",{useNewUrlParser:true,useUnifiedTopology:true});

const postSchema=new mongoose.Schema({
  post_title:String,
  post_content:String
});
const Post=mongoose.model("Post",postSchema);
const default_post1=new Post({
  post_title:"Binary Tree Data Structure",
  post_content:"A tree whose elements have at most 2 children is called a binary tree. Since each element in a binary tree can have only 2 children, we typically name them the left and right child."
});
const default_post2=new Post({
  post_title:"Tree Traversals",
  post_content:"Unlike linear data structures (Array, Linked List, Queues, Stacks, etc) which have only one logical way to traverse them, trees can be traversed in different ways. Following are the generally used ways for traversing trees."
});
var default_items=[default_post1,default_post2];


app.get("/", function(req, res){

  Post.find(function(err,results)
{
  if(results.length===0)
  {
    Post.insertMany(default_items,function(err,success){
      if(err){console.log(err);}
      else{
        console.log("success");
        res.redirect("/");
      }
    });
  }else{
    res.render("home", {
      startingContent: homeStartingContent,
      posts: results
      });
  }

});

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent:""});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const user_posts=new Post(
    {
      post_title:req.body.postTitle,
      post_content:req.body.postBody
    }
  );
  user_posts.save();


  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = req.params.postName;
  Post.findOne({post_title:requestedTitle},function(err,results){
    res.render("post",{
      title:results.post_title,
      content:results.post_content
    });
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

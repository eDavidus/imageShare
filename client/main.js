import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

// var img_data = [
// {
//   img_src: "img_1.jpg",
//   img_alt: "graffiti"
// },
// {
//   img_src: "img_4.jpg",
//   img_alt: "img4"
// },
// {
//   img_src: "img_3.jpg",
//   img_alt: "img3"
// }
// ];

// Template.images.helpers({images:img_data});

// router configuration of super template
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

// routing to root level
Router.route('/', function () {
    this.render('welcome', {
      to: "main"
    });
  });

// routing to images level
Router.route('/images', function () {
    this.render('image_add_form', {
      to: "image_form"
    });
    this.render('navbar', {
      to: "navbar"
    });
    this.render('images', {
        to: "main"
      });
  });

// routing to display a single image
Router.route('/image/:_id', function () {
    this.render('navbar', {
      to: "navbar"
    });
    this.render('image', {
        to: "main",
        data: function() {
          console.log("in image router: ");
          console.log(this);
          return Images.findOne({_id: this.params._id});
        }
      });
  });

// set in session a variable defining the max number of images in window for infinite scroll
Session.set("imageLimit", 9);
// lastScrollTop = 0;

//scroll event listener
$(window).scroll(function(event) {
  // console.log("scrollTop: "+$(window).scrollTop()+" "+$(this).scrollTop()+", window height: "+$(window).height()+" "+$(this).height());
  // console.log("document height: "+$(document).height());
  // test if we are near the bottom of window
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100){
    
    // add 4 more images in session variable imageLimit
    Session.set("imageLimit", Session.get("imageLimit") + 4);
    
    // where are we in the page
    // var scrollTop = $(this).scrollTop();
    // if (scrollTop > lastScrollTop){
    //   console.log("going down");
    //   Session.set("imageLimit", Session.get("imageLimit") + 4);
    // }
    // console.log("we are: "+scrollTop);
    // console.log(new Date());
  }
});

// Add username in create user form
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

// to add functions and files in the template
Template.images.helpers({
      // retrieve images on database, sort them and display them in images template
      images: function(){
        if (Session.get("userFilter")){
          return Images.find({createdBy: Session.get("userFilter")}, {sort: {rating:-1, createdOn:-1}, limit: Session.get("imageLimit")});
        }
        else {
          return Images.find({}, {sort:{rating:-1, createdOn:-1}, limit: Session.get("imageLimit")});
        }
      },
      // template function to test if images are filtered by user
      filtering_images: function(){
        if (Session.get("userFilter")){
          return true;
        }
        else {
          return false;
        }
      },
      // template function to return username with user_id
      getUser: function(user_id){
        var user = Meteor.users.findOne({_id: user_id});
        if (user) {
          return user.username;
        }
        else {
          return "anon";
        }
      },
      // template function to get the images username when filter applied
      getFilterUser: function() {
        if (Session.get("userFilter")){
          var user = Meteor.users.findOne({_id: Session.get("userFilter")});
            return user.username;
        }        
      },
      // check if current image belongs to user
      image_owner: function() {
        var ownerId = this.createdBy;
        if (Meteor.user()._id == ownerId) {
          return true;
        }
        else {
          return false;
        }
        
      }
      
  
});

console.log("main.js client says "+Images.find().count());

// set the field username in the body
Template.body.helpers({
  username:function(){
    if (Meteor.user()){
      console.log(Meteor.user()); 
      return Meteor.user().username;
      // return Meteor.user().emails[0].address;
    }
    else {
      return "visitor";
    }
  }
});

// envent listeners in images template
Template.images.events({
  // make image small
  'click .js-images':function(event){
    //$(event.target).css("width", "50px");
    //console.log(Meteor.userId());
  },
  // delete image
  'click .js-del-image':function(event){
    var image_id = this._id;
    console.log(this);
    $("#"+image_id).hide('slow', function(){
      Images.remove({"_id":image_id});      
    })
  },
  // upade image with rate
  'click .js-rate-image':function(event){
    var rating = $(event.currentTarget).data("userrating");
    console.log(rating);
    var image_id = this.id;
    console.log(this);
    Images.update({_id: image_id}, 
                  {$set: {rating:rating}}
                  );
  },
  // show form in modal to add new image
  'click .js-show-image-form': function(event) {
    $("#image_add_form").modal('show');
  },
  // set userFilter field in session
  'click .js-set-user-filter':function(event){
    Session.set("userFilter", this.createdBy);
  },
  // unset userFilter field in session
  'click .js-unset-user-filter':function(event){
    Session.set("userFilter", undefined);
  }
});

// event listners in modal form to add new image
Template.image_add_form.events({
  // add new image
  'submit .js-add-image':function(event) {
    var img_src, img_alt;
    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    console.log("src: "+img_src+" alt: "+img_alt);
    if (Meteor.user()){
      Images.insert({
        img_src: img_src,
        img_alt: img_alt,
        createdOn: new Date(),
        createdBy: Meteor.user()._id
      });
    }
    $("#image_add_form").modal('hide');
    return false;
  }
});

// for test only
Template.image.events({
  'click, single-img': function(event) {
    console.log("look at this "+this.img_alt);
    console.log(this);
  }
});
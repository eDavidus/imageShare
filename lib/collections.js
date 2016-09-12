// create a mongo db collection named Images
Images = new Mongo.Collection("images");

// setup security on Images collection
Images.allow({
    // set conditions to insert images
    insert: function(userId, doc) {
        console.log("testing security on image insert"); // works only on server
        // return false => not allowed to insert on server
        if (Meteor.user()) {
            // force the image to be owned by the user
            if (doc.createdBy != userId) {
                return false;
            }
            else { // the user is loggedin, the image has the correct user id
                return true;
            }
        }
        else { // user not logged in
            return false;
        }
        
    },
    // set conditions to update images
    update: function(userId, doc) {
        // return false => not allowed to update on server
        if (Meteor.user()) {
            // force the image to be owned by the user
            if (doc.createdBy != userId) {
                return false;
            }
            else { // the user is loggedin, the image has the correct user id
                return true;
            }
        }
        else { // user not logged in
            return false;
        }
        
    },
    
    // allow to remove images
    remove: function(userId, doc) {
        // return false => not allowed to delete image on server
        if (Meteor.user()) {
            // force the image to be owned by the user
            if (doc.createdBy != userId) {
                return false;
            }
            else { // the user is loggedin, the image has the correct user id
                return true;
            }
        }
        else { // user not logged in
            return false;
        }
    }})

// code to run on server at startup
// if (Meteor.isServer) {
//     Meteor.startup(function(){
//         // insert images if database empty
//         if (Images.find().count() == 0) {
//             for (var i = 1; i < 23; i++) {
//             Images.insert(
//                 {
//                   img_src: "img_"+i+".jpg",
//                   img_alt: "image number "+i
//                 });                
//             } // end for
//             console.log("Startup.js initialize says: "+Images.find().count());
//         } // end if
//     });
// }


console.log("Starup.js says: "+Images.find().count());
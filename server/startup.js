import { Meteor } from 'meteor/meteor';

Meteor.startup(function(){
    // insert images if database empty
    if (Images.find().count() == 0) {
        for (var i = 1; i < 23; i++) {
        Images.insert(
            {
              img_src: "img_"+i+".jpg",
              img_alt: "image number "+i
            });                
        } // end for
        console.log("Startup.js initialize says: "+Images.find().count());
    } // end if
});

Meteor.startup(() => {
  // code to run on server at startup
  
});

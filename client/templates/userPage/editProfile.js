ImageLocVar = new ReactiveVar();
var area;
var count = new ReactiveVar(0);

Template.editProfile.onRendered(function(){
  area = document.getElementById('userDescUpdate');
});

Template.editProfile.events({
  'click #userDescUpdate': function(){
      Countable.live(area, function (counter) {
      count.set(counter.all);
      })
  }
});

Template.editProfile.helpers({
  userDescCounter: function() {
    return count.get();
  }
});


Template.editProfile.events({
    // Submit signup form event
    'submit .edit-profile': function(e, t){
          // Prevent default actions
          e.preventDefault();
      var file = [];
      var file = $('#profileImage')[0].files[0];
     

      Cloudinary._upload_file(file,{tags:"profileImages",folder:"profileImages"}, function(err, res){
           console.log("Upload Error: " + err);
            $('form :input').attr('value', '');
           //console.log("Upload Result: " + res);
           ImageLocVar.set(res.public_id);
              var $image = $('#cropImg > img'), cropBoxData, canvasData;
              var cancelCrop = false;
              $('#cropEditProfile').modal({backdrop:'static',keyboard: false});
              $('#cropEditProfile').modal('show');
              $('#cropEditProfile').on('shown.bs.modal', function () {
                backdrop: 'static'
                  $image.cropper({
                      aspectRatio: 1/1,
                      autoCropArea: 0.5,
                      viewMode: 1,
                      guides: false,
                      dragMode:'move',
                      zoomable: true,
                      cropBoxMovable: true,
                      cropBoxResizable: true,
                      built: function () {
                          // Strict mode: set crop box data first
                          $image.cropper('setCropBoxData', cropBoxData);
                          $image.cropper('setCanvasData', canvasData);
                      }
                  });
                  $("#cancelCrop").click(function () {
                      cancelCrop = true;
                  });
              }).on('hidden.bs.modal', function () {
                          if(cancelCrop === true) {
                              $image.cropper('destroy');
                              window.location.reload();
                          } else {
                                    var imageCloudId = UserData.findOne({username: Meteor.user().username}).imageCloudId;
                                    Cloudinary.delete(imageCloudId);
                                    cropBoxData = $image.cropper('getData');
                                    canvasData = $image.cropper('getCanvasData');
                                    var profileId = UserData.findOne({username: Meteor.user().username})._id;
                                    var croppedSpecs = "x_"+Math.round(cropBoxData.x)
                                                       +",y_"+Math.round(cropBoxData.y)
                                                       +",w_"+Math.round(cropBoxData.width)
                                                       +",h_"+Math.round(cropBoxData.height)
                                                       +",c_crop/"
                                    UserData.update(profileId,{
                                      $set: {cropImage: croppedSpecs+ImageLocVar.get(), imageCloudId: ImageLocVar.get()}
                                    });
                                    $image.cropper('destroy');
                                    window.location.reload();
                                  }
                });
             // document.getElementById("edit-profile").reset();

      });
    }       
});

Template.editProfile.helpers({
    ImageLoc: function() {
    return ImageLocVar.get();
    },
    'showModal': function(){
      return Session.get('showModal');
    }
});

Template.cropEditProfile.helpers({
    TempImageLoc: function() {
    return ImageLocVar.get();
    }
});

AutoForm.addHooks(['userDescUpdate'], {
  onSuccess: function(operation, result, template) {
   FlashMessages.sendSuccess('Success!');
   //Router.go("/"+Meteor.user().username);
  }
});

Template.editProfile.events({
  
  
});


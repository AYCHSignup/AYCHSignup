var domain = 'https://databox.me';


/* ---- DON'T EDIT BELOW ---- */
var accURL = {};
var cardPath = "/profile/card";

var init = function() {
  // Prepare domain
  var parser = document.createElement('a');
  parser.href = domain;
  accURL.host = parser.host; // => "example.com"
  accURL.path = parser.pathname; // => "/pathname/"
  accURL.schema = parser.protocol + '//';

  // Add listener
  document.querySelector(".account").addEventListener('keypress', function(e) {
    if (e.which == 13) {
      checkExists();
    }
  });

  document.querySelector(".schema").innerHTML = accURL.schema;
  document.querySelector(".domain").innerHTML = accURL.host;
  // Hide success
  document.querySelector(".successbox").style.display = "none";
  // Hide example
  document.querySelector(".accountinfo").style.display = "none";
  // Article
  document.querySelector(".first").style.display = "";
  document.querySelector(".second").style.display = "none";
  document.querySelector(".third").style.display = "none";
  // Tooltips
  document.querySelector(".left").style.display = "";
  document.querySelector(".middle").style.display = "none";
  document.querySelector(".right").style.display = "none";
  // Availability
  resetAvailability();

  // setStep(2);
}

var resetAvailability = function() {
  document.querySelector(".email").style.display = "none";
  document.querySelector(".next").style.display = "none";
  document.querySelector(".available").style.display = "none";
  document.querySelector(".taken").style.display = "none";
  document.querySelector(".createacc").style.display = "none";
  document.querySelector(".check").style.display = "";
  document.querySelector(".accountinfo").classList.remove('green');
  document.querySelector(".accountinfo").style.display = "none";
  document.querySelector(".check").classList.add("disabled");
  document.querySelector(".createacc").classList.remove("greenbg");
  document.querySelector(".createacc").classList.add("disabled");
}

var setProgression = function(val) {
  if (val) {
    document.querySelector(".progression").style.width = val;
  }
};

var makeURI = function(username) {
  if (username.length > 0) {
    return accURL.schema + username + '.' + accURL.host;
  }
  return null;
}

var validateAccount = function() {
  var account = document.querySelector(".account").value;
  document.querySelector(".username").innerHTML = account;
  if (account.length > 0) {
    document.querySelector(".accountinfo").style.display = "";
    document.querySelector(".check").classList.remove("disabled");
  } else {
    resetAvailability();
  }
};

var validateEmail = function() {
  // var account = document.querySelector(".account").value;
  var address = document.querySelector(".address").value;
  var re = /\S+@\S+\.\S+/;
  if (re.test(address)) {
    document.querySelector(".createacc").style.pointerEvents = "";
    document.querySelector(".createacc").classList.add("greenbg");
    document.querySelector(".createacc").classList.remove("disabled");
  } else {
    document.querySelector(".createacc").style.pointerEvents = "none";
    document.querySelector(".createacc").classList.add("disabled");
    document.querySelector(".createacc").classList.remove("greenbg");
  }
};

var isAvailable = function(url) {
  document.querySelector(".available").style.display = "";
  document.querySelector(".taken").style.display = "none";
  document.querySelector(".createacc").style.display = "";
  document.querySelector(".check").style.display = "none";
  document.querySelector(".email").style.display = "";
  document.querySelector(".accountinfo").classList.add('green');
};

var isTaken = function(url) {
  document.querySelector(".available").style.display = "none";
  document.querySelector(".taken").style.display = "";
}

var checkExists = function() {
  var account = document.querySelector(".account").value;
  if (account.length > 0) {
    var url = makeURI(account) + '/';
    var http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          if (this.status === 404) {
            isAvailable(url);
          } else {
            isTaken(url);
          }
        }
    };
    http.send();
  }
}

var createAccount = function() {
  var account = document.querySelector(".account").value;
  if (account.length > 0) {
    var url = makeURI(account) + cardPath;

    var query = "<> a <http://xmlns.com/foaf/0.1/PersonalProfileDocument> ;\n"+
    "<http://purl.org/dc/terms/title> \"Main WebID profile\" ;\n"+
    "<http://xmlns.com/foaf/0.1/maker> <#me> ;\n"+
    "<http://xmlns.com/foaf/0.1/primaryTopic> <#me> .\n\n"+
    "<#me> a <http://xmlns.com/foaf/0.1/Person> .";

    var http = new XMLHttpRequest();
    http.open('PUT', url);
    http.setRequestHeader('Content-Type', 'text/turtle');
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          if (this.status === 200 || this.status === 201) {
            accountDone();
          } else {
            console.log('Error creating WebID at '+url);
          }
        }
    };
    http.send(query);
  }
}

var accountDone = function() {
  document.querySelector(".first-bullet").classList.add("completed");
  document.querySelector(".createacc").style.display = "none";
  document.querySelector(".first").style.display = "none";
  document.querySelector(".successbox").style.display = "";
  document.querySelector(".next").style.display = "";
};

var setStep = function(step) {
  console.log("Step: "+step);
  switch(step) {
    case 1:
      // Progression
      setProgression("0%");
      document.querySelector(".first-bullet").classList.remove("completed");
      document.querySelector(".second-bullet").classList.remove("completed");
      document.querySelector(".third-bullet").classList.remove("completed");
      // Article
      document.querySelector(".first").style.display = "";
      document.querySelector(".second").style.display = "none";
      document.querySelector(".third").style.display = "none";
      // Tooltips
      document.querySelector(".left").style.display = "";
      document.querySelector(".middle").style.display = "none";
      document.querySelector(".right").style.display = "none";
      break;
    case 2:
      // Progression
      setProgression("50%");
      document.querySelector(".first-bullet").classList.add("completed");
      document.querySelector(".second-bullet").classList.remove("completed");
      document.querySelector(".third-bullet").classList.remove("completed");
      // Article
      document.querySelector(".first").style.display = "none";
      document.querySelector(".second").style.display = "";
      document.querySelector(".third").style.display = "none";
      document.querySelector(".successbox").style.display = "none";
      // Tooltips
      document.querySelector(".left").style.display = "none";
      document.querySelector(".middle").style.display = "";
      document.querySelector(".right").style.display = "none";
      break;
    case 3:
      // Navigation
      document.querySelector(".check").innerHTML = "Finish";
      // Progression
      setProgression("100%");
      document.querySelector(".first-bullet").classList.add("completed");
      document.querySelector(".second-bullet").classList.add("completed");
      document.querySelector(".third-bullet").classList.remove("completed");
      // Article
      document.querySelector(".first").style.display = "none";
      document.querySelector(".second").style.display = "none";
      document.querySelector(".third").style.display = "";
      // Tooltips
      document.querySelector(".left").style.display = "none";
      document.querySelector(".middle").style.display = "none";
      document.querySelector(".right").style.display = "";

      break;
  }
};

var clickFileInput = function() {
  document.querySelector("#inputFileToLoad").click();
}

var loadImageFileAsURL = function() {
  var dataURL;
  var filesSelected = document.getElementById("inputFileToLoad").files;
  if (filesSelected.length > 0) {
    var fileToLoad = filesSelected[0];
    var img = document.querySelector(".profilepic");

    if (fileToLoad.type.match("image.*")) {
      console.log(fileToLoad.size);

      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        img.src = fileLoadedEvent.target.result;
        var canvas = document.createElement("canvas");
        canvas.style.display = "none";
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 300;
        var MAX_HEIGHT = 300;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // show new image
        document.querySelector(".camera-wrap").classList.add('hidden');
        img.classList.remove('hidden');

        // prepare to upload profile image
        var dataURI = canvas.toDataURL(fileToLoad.type);

        // clean up used elements
        delete canvas;
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  }
};

var updateProfile = function() {
  console.log("Called update");
  var profile = {};
  profile.fullname = document.querySelector('.fullname').value;

  var account = document.querySelector(".account").value;
  if (account.length > 0) {
    var url = makeURI(account) + '/profile/';
    profile.url = url+'card';
    // upload profile picture
    var dataURI = document.querySelector('.profilepic').src;
    if (dataURI && dataURI.length > 0) {
      // convert dataURL to blob (binary)
      var byteString = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var ext = mimeString.split('/')[1];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++)
      {
          ia[i] = byteString.charCodeAt(i);
      }

      var bb = new Blob([ab], { "type": mimeString });

      var fd = new FormData();
      fd.append("File", bb, 'avatar.'+ext);
      // xhr request
      var http = new XMLHttpRequest();
      http.open("POST", url);
      http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          if (this.status === 200 || this.status === 201) {
            // patch profile
            profile.picture = this.getResponseHeader('Location');
            uploadProfile(profile);
          }
        }
      };
      http.send(fd);
    } else {
      uploadProfile(profile);
    }
  }
};

var uploadProfile = function(profile) {

  var query = '';

  if (profile && profile.fullname && profile.fullname.length > 0) {
    query += "INSERT DATA { <#me> <http://xmlns.com/foaf/0.1/name> \""+profile.fullname+"\" . }";
  }

  if (profile && profile.picture && profile.picture.length > 0) {
    query += " ;\n";
    query += "INSERT DATA { <#me> <http://xmlns.com/foaf/0.1/img> <"+profile.picture+"> . }";
  }

  console.log(profile, query);

  var http = new XMLHttpRequest();
  http.open("PATCH", profile.url);
  http.setRequestHeader('Content-Type', 'application/sparql-update');
  http.onreadystatechange = function() {
    if (this.readyState == this.DONE) {
      if (this.status === 200) {
        console.log("Save profile!");
      }
    }
  };
  http.send(query);
};

// Init app
init();
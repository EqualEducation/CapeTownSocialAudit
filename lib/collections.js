var onlineSchools = new Meteor.Collection('schools');
Schools = new Ground.Collection(onlineSchools);

var onlineAudits = new Meteor.Collection('audits');
Audits = new Ground.Collection(onlineAudits);

if (Meteor.isServer) {
  // Publish only the current user's items
  ReactiveTable.publish("user-audits", Audits, function () {
    if (Roles.userIsInRole(this.userId, ['admin'])){
      return {"isDeleted" : false};
    }
    return {"user.id": this.userId, "isDeleted" : false};
  }, {fields: {'school.schoolDetails.INSTITUTION_NAME': 1, 'school.schoolDetails.DISTRICT_NAME': 1, 'user.email' : 1, 'complete' : 1}});


  ReactiveTable.publish("all-schools", Schools, function () {
      return {};
  });

  Meteor.publish('audits', function(auditId) {
    if (auditId) {
      check(auditId, String)
      return Audits.find({_id : auditId});

    } else {
      return Audits.find();
    }
  });

  Meteor.publish('schools', function(schoolId) {
    if (schoolId) {
      check(schoolId, String)
      return Schools.find({_id : schoolId});

    } else {
      return Schools.find();
    }
  });

  Meteor.publish("allUsers", function () {
  var currentUser = Meteor.users.findOne({"_id": this.userId});

  if(currentUser!=undefined) {
    // if(currentUser.emails[0].verified==true) {
      return Meteor.users.find();
    // }
  }

  });
}

// Accounts.config({ restrictCreationByEmailDomain: 'tedxcapetown.org', sendVerificationEmail: true });
Meteor.startup(function () {
  if (Meteor.isServer) {
  // smtp = {
  //    username: 'carla@equaleducation.org',   // eg: server@gentlenode.com
  //    password: 'carla!@#',   // eg: 3eeP1gtizk5eziohfervU
  //    server:   'email2.texo.co.za',  // eg: mail.gandi.net
  //    port: 465
  //  }
 // var url = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

  // process.env.MAIL_URL = url


  var audits = Audits.find({});
  audits.forEach(function(audit){
    versionUpdate(audit);
    if (audit.isDeleted == undefined) {
      var updated =   Audits.update({_id: audit._id}, {$set: {isDeleted: false} });
    }
  })

//CREATE ADMIN ROLE
  var user = Meteor.users.findOne({'emails.address' : {$in: ['carla@equaleducation.org.za']}});
  console.log(user);
  if (!user){
    console.log('*** creating admin user ***')
    var id = Accounts.createUser({
       email: 'carla@equaleducation.org.za',
       password: "carla!@#",
       profile: { name: 'Admin'}
     });

     Roles.addUsersToRoles(id,['admin']);

   } else if (!Roles.userIsInRole(user._id, ['admin']) || !user.emails[0].verified){
      Roles.addUsersToRoles(user._id, ['admin']);
      console.log('*** updating existing admin user ***');
      var emails = [{'address' : 'carla@equaleducation.org.za', 'verified' : true}];
      console.log(emails);
      Meteor.users.update({'_id' : user._id}, {$set: {'emails' : emails}})
   }
 }
});

versionUpdate =  function(audit) {
  var forms = audit.forms
  var version = 27;

  if (audit.version != version) {

    console.log('Updating from version '+ audit.version + ' to version ' + version + ' for _id ' + audit._id);

      var school = Schools.findOne(audit.school._id);
      audit.school.schoolDetails = school.schoolDetails;

    forms.forEach(function(form) {
      form = updateQuestionsOfTypeDropdownOrCheckbox(form, audit._id);

      if (form.name == 'formA'){

        //fixing Form A, 2.2.3
        form.sections[1].sub_sections[1].questions[2].hasComment = true;

        //fixing Form A, 2.4.3
        form.sections[1].sub_sections[3].questions[2].options = ['There is no security guard', 'Yes', 'No', 'Don\'t know'],


        //fixing Form A, 2.5.1
        form.sections[1].sub_sections[4].questions[0].label = '2.5.1 How safe do you feel learners and educators are at the school?';
        form.sections[1].sub_sections[4].questions[0].options = ['Very Safe','Safe', 'Neither Safe Nor Unsafe', 'Unsafe', 'Very Unsafe'];

        var index = 0;
        var newRows = [];
        form.sections[0].sub_sections[1].rows.forEach(function(row) {
          if (row.id == 'total' && index == 13) {
            var newRow = new Object();
            newRow.id = 'specialEd';
            newRow.name = 'Special Ed. Students';
            newRow.type = 'label';
            newRows[index] = newRow;
            newRows[index + 1] = row;
          } else {
            newRows[index] = row;
          }
          index++;
        })

        form.sections[0].sub_sections[1].rows = newRows;

        //adding calculated field to grades
        var calculatedObj_grades = new Object();
        calculatedObj_grades.id = 'calculated';
        calculatedObj_grades.name = 'Calculated';
        calculatedObj_grades.index = 4;
        calculatedObj_grades.type = 'calculated';
        calculatedObj_grades.operator = 'sum';
        calculatedObj_grades.fields = ['numberOfGirls','numberOfBoys'];
        form.sections[0].sub_sections[1].columns[4] = (calculatedObj_grades);
        calculateTotals(form.sections[0].sub_sections[1], calculatedObj_grades);

        var calculatedObj_staff = new Object();
        calculatedObj_staff.id = 'calculated';
        calculatedObj_staff.name = 'Calculated';
        calculatedObj_staff.index = 4;
        calculatedObj_staff.type = 'calculated';
        calculatedObj_staff.operator = 'sum';
        calculatedObj_staff.fields = ['numberOfGirls','numberOfBoys'];
        calculatedObj_staff.fields = ['male','female'];
        form.sections[0].sub_sections[2].columns[4] = (calculatedObj_staff);
        calculateTotals(form.sections[0].sub_sections[2], calculatedObj_staff);

        var diff = new Object();
        diff.id = 'difference';
        diff.name = 'Difference';
        diff.index = 5;
        diff.type = 'difference';
        form.sections[0].sub_sections[1].columns[5] = diff;
        form.sections[0].sub_sections[2].columns[5] = diff;


      }

      if (form.name.indexOf('formB') > -1) {
        //fixing Form B, 2.2.1
        form.sections[1].sub_sections[1].questions[0].options = ['Very Safe', 'Safe', 'Unsafe', 'Very Unsafe', 'Not Answered'];
        //fixing Form B, 2.1.4
        form.sections[1].sub_sections[0].questions[3].options = ['Very Safe', 'Safe', 'Unsafe', 'Very Unsafe', 'Not Answered'];
      }
    })

    Meteor.call('calculatePercentageComplete', audit, function(err, response) {
      // console.log(err);
      // console.log(response)
      var updated = Audits.update({_id: response._id}, {$set: {forms: response.forms, school : response.school, version: version, complete: response.complete} });
      // console.log('Updated: ' + updated);
    });

  }
}

calculateTotals = function(subsection, calculatedObj) {
  subsection.rows.forEach(function(row) {
    var sum = 0;
    var hasCalculatedValueAtIndex = -1;
    if (row.values == undefined) {
      return;
    }
    var index = 0;
    var inputtedTotalValue;
    var calculatedValues = row.values.forEach(function(value) {
      if (value.id == 'total') {
        inputtedTotalValue = parseInt(value.value);
      }
      calculatedObj.fields.forEach(function(field) {
        if (value.id == field) {
          if (value.value != "") {
            sum = sum + parseInt(value.value);
          }
        }
        if (value.id == 'calculated') {
          hasCalculatedValueAtIndex = index;
        }
      })
      index++;
    })

    if (hasCalculatedValueAtIndex > -1) {
      row.values.splice(hasCalculatedValueAtIndex, 1);
    }

    if (sum == 0){
      sum = "";
    }

    var calculatedValue = new Object();
    calculatedValue.id = 'calculated';
    calculatedValue.value = sum;

    row.values.push(calculatedValue)

    var diff = "";
    if (inputtedTotalValue == undefined || calculatedValue.value == undefined || isNaN(inputtedTotalValue) || isNaN(calculatedValue.value || inputtedTotalValue == "" || calculatedValue.value == "" )) {
      diff = false;
    } else {
      var difference = inputtedTotalValue-calculatedValue.value
       diff =  difference != 0;
    }

    var differenceInCalculations = new Object();
    differenceInCalculations.id = 'difference';
    differenceInCalculations.value = diff;
    row.values.push(differenceInCalculations);
  })
}

updateQuestionsOfTypeDropdownOrCheckbox =  function(form, auditID) {
  form.sections.forEach(function(section) {
    section.sub_sections.forEach(function(subsection) {
      if (subsection.questions != undefined) {
        subsection.questions.forEach(function(question){
          if (question.value != undefined && (question.type == 'dropdown' || question.type == 'checkbox')) {
            var actualValue = [];
            question.value.forEach(function(value){
              if (question.options.indexOf(value) > -1) {
                actualValue.push(value)
              }
            })
            question.value = actualValue;
          }
        })
      }
    })
  })
  return form;
}

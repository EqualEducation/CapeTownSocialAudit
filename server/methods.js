Meteor.methods({
  downloadFormConstruction: function(forms) {
    var audits = Audits.find({'isDeleted' : false}).fetch();

    var flattenedQuestions = [];

      forms.forEach(function(form) {
        form.sections.forEach(function(section) {
          section.sub_sections.forEach(function(subsection) {
            if (subsection.questions != undefined) {
              subsection.questions.forEach(function (question) {
                var newQ = new Object();
                newQ.id = question.id;
                newQ.type = question.type;
                newQ.form = form.name;
                var text = question.label;
                text = text.replace(/,/g, "");
                newQ.label = text;
                if (question.options != undefined) {
                  var options = question.options.toString();
                  // options = options.replace(/,/g, "; ")
                  newQ.options = options;
                } else {
                  newQ.options = "";
                }
                flattenedQuestions.push(newQ);
              })
            }
          })
        })
      })

    var heading = true; // Optional, defaults to true
    var delimiter = "," // Optional, defaults to ",";
    return exportcsv.exportToCSV(flattenedQuestions, heading, delimiter);

  },
  downloadForm: function(formName) {
    var audits = Audits.find({'isDeleted' : false}).fetch();

    var forms = [];

    audits.forEach(function(audit){
      audit.forms.forEach(function(form) {
        if (form.name.indexOf(formName) > -1) {
          var formValues = [];
          formValues.school_name = audit.school.schoolDetails.INSTITUTION_NAME;
          formValues.neims = audit.school.schoolDetails.NEIMS_NUMBER;
          if (audit.user != undefined){
            formValues.audited_by = audit.user.email;
          }
          formValues.name = form.name;

          form.sections.forEach(function(section) {
              section.sub_sections.forEach(function(subsection) {
                if (subsection.questions != undefined && subsection.name != 'formA.school_demographics.grades' && section.name !='formA.school_demographics.staff')
                {
                  subsection.questions.forEach(function(question) {
                    var questionObject = new Object();

                    if (question.value != undefined) {
                      if(question.value.constructor === Array) {

                        var val = question.value.toString();

                        val = val.replace(/,/g, "; ")
                        val = val.replace(/\n/g, "; ")

                        formValues[question.id] = val;

                      } else {
                        var val = question.value;
                        val = val.replace(/,/g, "")
                        val = val.replace(/\n/g, "; ")

                        formValues[question.id] = val;
                      }
                    } else {
                      formValues[question.id] = "";
                    }

                    if(question.hasComment) {
                      if (question.comment != undefined) {

                        var val = question.comment
                        val = val.replace(/,/g, "")
                        val = val.replace(/\n/g, "; ")
                        formValues[question.id + '_comment'] = val;

                      } else {
                        formValues[question.id + '_comment'] = "";
                      }
                    }
                  })
                }
              })
            })
            forms.push(formValues);
          }
        })
      })

      var heading = true; // Optional, defaults to true
      var delimiter = "," // Optional, defaults to ",";
      return exportcsv.exportToCSV(forms, heading, delimiter);
  },
  downloadStaticTable: function(formName, subtype) {
    var audits = Audits.find({'isDeleted' : false}).fetch();

    var allSchools = [];
    audits.forEach(function(audit){
      audit.forms.forEach(function(form) {
        if (form.name == formName) {
          form.sections.forEach(function(section) {
              section.sub_sections.forEach(function(subsection) {
                if (subsection.subtype == subtype){
                  var calculatedCol = subsection.columns.filter(function(col){
                                                      return col.id == 'calculated';
                                                  });

                  if (calculatedCol.length > 0) {
                    calculateTotals(subsection, calculatedCol[0]);
                  }

                  var grades = new Object();
                  grades.school_name = audit.school.schoolDetails.INSTITUTION_NAME;
                  grades.neims = audit.school.schoolDetails.NEIMS_NUMBER;
                  subsection.rows.forEach(function(row){
                    var rowValues = row.values;
                    if (rowValues != undefined) {
                      subsection.columns.forEach(function(col){
                        if (col.type != 'label') {
                          var rowValue = rowValues.filter(function(rowValue){
                                                              return rowValue.id == col.id;
                                                          });
                          if (rowValue.length > 0) {
                            grades[row.id + '_' + col.id] = rowValue[0].value;
                          } else {
                            grades[row.id + '_' + col.id] = "";
                          }
                        }
                      })
                    } else {
                      subsection.columns.forEach(function(col){
                        if (col.type != 'label'){
                          grades[row.id + '_' + col.id] = "";
                        }
                      })
                    }
                  })

                  if (audit.user != undefined){
                    grades.audited_by = audit.user.email;
                  }
                  allSchools.push(grades);
                }
              })
          })
        }
      })
    })

    var heading = true; // Optional, defaults to true
    var delimiter = "," // Optional, defaults to ",";
    return exportcsv.exportToCSV(allSchools, heading, delimiter);
  },
  downloadFormCSanitationBlocks: function() {
    var audits = Audits.find({'isDeleted' : false}).fetch();

    var allBlocks = [];
    audits.forEach(function(audit){
      var blocksArray = [];
      audit.forms.forEach(function(form) {
        if (form.name == 'formC') {
          form.sections.forEach(function(section) {
            if (section.name == 'formC.general_infrastructure') {
              section.sub_sections.forEach(function(subsection) {

                if (subsection.name == 'formC.general_infrastructure.sanitation'){
                  if (subsection.objects != undefined) {
                    var blocks = subsection.objects
                    blocks.forEach(function(blockAsArray) {
                      var block = new Object();

                      if (blocksArray != undefined) {
                        blockAsArray.forEach(function(detail) {
                          if (detail.values[0] != undefined) {
                            var val = detail.values[0];
                            val = val.replace(/,/g, "; ")
                            block[detail.id] = val;
                          } else {
                            block[detail.id] = "";
                          }
                        })
                      }
                      if (audit.user != undefined){
                        block.audited_by = audit.user.email;
                      }
                      block.school_name = audit.school.schoolDetails.INSTITUTION_NAME;
                      block.neims = audit.school.schoolDetails.NEIMS_NUMBER;
                      allBlocks.push(block);
                      // console.log(block)
                    })
                  }
                }
              })
            }
          })
        }
      })
    })

    var heading = true; // Optional, defaults to true
    var delimiter = "," // Optional, defaults to ",";
    return exportcsv.exportToCSV(allBlocks, heading, delimiter);
  },
  insertSchools: function(schools) {

    var count = schools.length;
    var i = 0;
    var uploaded = 0;


    schools.forEach(function(entry){
      i++;

      // var existingSchool = Schools.find({'schoolDetails.NEIMS_NUMBER' : entry.NEIMS_NUMBER});
      // if (typeof existingSchool === 'undefined') {

        Schools.insert({schoolDetails: entry});
        uploaded++;
      // } else {
      //   alert('School already exists! NEIMS: ' + entry.NEIMS_NUMBER);
      // }
      console.log(i + ' out of ' + count);
      if (i == count) {
        var message = ' schools were added to the database';
        if (uploaded == 1){
            message = ' school was added to the database';
        }
        return 'Upload complete! ' + uploaded + message
      }
    });
  },

  toggleUserRole: function (targetUserId, role) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser ||
        !Roles.userIsInRole(loggedInUser,
                            ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }

    var roles = [];
    var targetUser = Meteor.users.findOne({"_id" : targetUserId});
    if (targetUser != undefined && targetUser.roles != undefined) {
      roles = targetUser.roles;
    }
    if (Roles.userIsInRole(targetUserId, role)) {
      return Roles.removeUsersFromRoles(targetUserId, role);
    } else {
      roles.push(role);
      return Roles.setUserRoles(targetUserId, roles)
    }
  },
  setAdmin: function(ids) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !loggedInUser.isAdmin) {
      throw new Meteor.Error(403, "Access denied");
    }
    var didUpdate = Meteor.users.update({"_id": {$in: ids}},  { $set: { 'isAdmin': true }}, {multi: true});
    return didUpdate;
  },
  removeAdmin: function(ids) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !loggedInUser.isAdmin) {
      throw new Meteor.Error(403, "Access denied");
    }
    var didUpdate = Meteor.users.update({"_id": {$in: ids}},  { $set: { 'isAdmin': false }}, {multi: true});
    return didUpdate;
  },
  userHasAdminRole: function() {
    var loggedInUser = Meteor.user();
    return loggedInUser.isAdmin;
  },
  checkRoleOnServer: function(userId, roleToCheck) {
    var loggedInUser = Meteor.user();

    if (!loggedInUser || !loggedInUser.isAdmin) {
      throw new Meteor.Error(403, "Access denied");
    }

    var userWithRoles = Meteor.users.findOne({"_id" : userId}, {"roles" : 1});
    var hasRole = false;
    if (userWithRoles.roles != undefined) {
      var index = userWithRoles.roles.indexOf(roleToCheck);
      if (index > -1) {
        hasRole = true;
      }
    }
    return hasRole;

  },
  resendVerificationEmail: function () {
    var currentUser = Meteor.user();
    if(currentUser) {
      var emailAddress = currentUser.emails[0].address;
      if(emailAddress) Accounts.sendVerificationEmail(currentUser._id, emailAddress);
    }
    else throw new Meteor.Error("pants-not-found", "Can't find my pants");

    return "Verification email sent";
  },
  sendEmail: function (to, from, subject, html) {
    check([to, from, subject, html], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      html: html
    });
  },
  calculatePercentageComplete: function (audit) {
    console.log("ID: " + audit._id);
    var totalQs = 0;
    var totalAnsweredQs = 0;

    audit.forms.forEach(function(form)
    {
        if (form != undefined)
        {
          form.sections.forEach(function(section)
          {
            if (section != undefined && section.name != 'grades' && section.name != 'staff')
            {
              section.sub_sections.forEach(function(subsection)
              {
                if (subsection != undefined)
                {
                  var hasMissingData;
                  if (subsection != undefined && subsection.name != 'formA.school_demographics.grades' && subsection.name != 'formA.school_demographics.staff' && subsection.name != 'formC.general_infrastructure.sanitation')
                  {
                    var isComplete = true;
                    if (subsection.questions != undefined){
                      subsection.questions.forEach(function(question)
                      {
                        totalQs++;
                        if ((question.value != undefined && question.value != '') || (question.comment != undefined && question.comment != ''))
                        {
                          totalAnsweredQs++;
                        }
                        else
                        {
                          console.log(subsection.name)
                          isComplete = false;
                        }
                      })
                    }
                    subsection.isComplete = isComplete;
                  }
                  else
                  {
                    subsection.isComplete = true;
                  }
                }
              })
            }
          })
        }
      })
      var percentage = totalAnsweredQs/totalQs*100;
      audit.complete = Math.round(percentage * 1) / 1;
      return audit;

  }
});

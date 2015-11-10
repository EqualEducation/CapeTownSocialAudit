Template.manageAudits.helpers({
    settings: function ()
    {
      return {
          collection: "user-audits",
          rowsPerPage: 10,
          showFilter: true,
          fields: [
            { key: 'school.schoolDetails.INSTITUTION_NAME', label: 'Name' },
            { key: 'school.schoolDetails.DISTRICT_NAME', label: 'District' },
            { key: 'user.email', label: 'User' },
            { key: 'complete', label: '% Complete' },
            { key: 'transfer', label: '', fn: function () { return new Spacebars.SafeString('<button type="button" class="transferbtn modal-trigger" href="#transfer">Transfer</button>')}},
            { key: 'update', label: '', fn: function () { return new Spacebars.SafeString('<button type="button" class="editbtn">Update</button>') } },
            { key: 'delete', label: '', fn: function () {
                  if (userIsInRole('admin')) {
                    return new Spacebars.SafeString('<button type="button" class="deletebtn">Delete</button>')
                  }
                }
            }
          ]
      };
    }
});

Template.audits.helpers({
  transferSchoolName : function() {
    return Session.get('transferAudit').school.schoolDetails.INSTITUTION_NAME;
  },
  // transferFromUserId : function(userId) {
  //   console.log(Session.get('transferAudit').user.id)
  //   console.log(userId)
  //
  //   return Session.get('transferAudit').user._id == userId;
  // }
})

Template.audits.events({
  'click .modal-transfer' : function(event, template) {
    event.preventDefault();
    var selected = template.findAll("input[type=radio]:checked");
    var user = new Object()
    user.id = selected[0].id;
    var dbUser = Meteor.users.findOne({'_id' : user.id})
    user.email = dbUser.emails[0].address;
    console.log(user);

    var updated = Audits.update({'_id': Session.get('transferAudit')._id}, { $set : {user: user}});
    console.log(updated)
  },
  'click .reactive-table tbody tr': function (event) {
    event.preventDefault();

    // checks if the actual clicked element has the class `delete`
    if (event.target.className == "deletebtn") {
      this.isDeleted = true;
      Audits.update({_id: this._id}, {$set: {isDeleted: true} })

    }else if (event.target.className.indexOf("transferbtn") > -1) {
      console.log('open modal')
      Session.set('transferAudit', this)
      $('#transferModal').openModal();
    }
    else if (event.target.className == "editbtn") {
      Session.set('schoolName', this.school.schoolDetails.INSTITUTION_NAME)
      Session.set('formIndex', 0);
      Session.set('sectionIndex', 0);
      Session.set('subsectionIndex', 0);

      Router.go('audit.edit', {_id: this._id, _formIndex: 0, _sectionIndex: 0, _subsectionIndex: 0});
    } else {

      Session.set('schoolName', this.school.schoolDetails.INSTITUTION_NAME)
      Session.set('formIndex', 0);
      Session.set('sectionIndex', 0);
      Session.set('subsectionIndex', 0);

      Router.go('audit.edit', {_id: this._id, _formIndex: 0, _sectionIndex: 0, _subsectionIndex: 0});
    }
  }
});


Template.manageAudits.helpers({
    perecentage_complete: function() {

    },
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
            { key: 'update', label: '', fn: function () { return new Spacebars.SafeString('<button type="button" class="editbtn">Update</button>') } },
            { key: 'delete', label: '', fn: function () {
              if (userIsInRole('admin')) {
                return new Spacebars.SafeString('<button type="button" class="deletebtn">Delete</button>') } }
              }
          ]
      };
    }
});

Template.audits.events({
  'click .reactive-table tbody tr': function (event) {
    event.preventDefault();

    // checks if the actual clicked element has the class `delete`
    if (event.target.className == "deletebtn") {
      this.isDeleted = true;
      Audits.update({_id: this._id}, {$set: {isDeleted: true} })

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


Template.manageSchools.helpers({
    settings: function ()
    {
      return {
          collection: 'all-schools',
          rowsPerPage: 10,
          showFilter: true,
          fields: [
            { key: 'schoolDetails.INSTITUTION_NAME', label: 'Name' },
            { key: 'schoolDetails.DISTRICT_NAME', label: 'District' },
            { key: 'edit', label: '', fn: function () { return new Spacebars.SafeString('<button type="button" class="editbtn">View</button>') } },
            { key: 'delete', label: '', fn: function () { return new Spacebars.SafeString('<button type="button" class="deletebtn">Delete</button>') } }

          ]

      };
    }
});

Template.schools.events({
  'click .reactive-table tbody tr': function (event) {
    event.preventDefault();

    // checks if the actual clicked element has the class `delete`
    if (event.target.className == "deletebtn") {
      Schools.remove(this._id)
    }

    if (event.target.className == "editbtn") {
      Session.set('schoolDetails', this);
      $('#schoolDetails').openModal();
    }
  }
});

Template.schools.helpers({
    currentSchool: function () {
        return Session.get('schoolDetails');
    }
});

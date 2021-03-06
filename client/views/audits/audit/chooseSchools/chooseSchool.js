Template.searchSchools.helpers({
    // schools: function () {
    //     return Schools;
    // },
    settings: function () {
        return {
            collection: 'all-schools',
            rowsPerPage: 10,
            showFilter: true,
            fields: [{ key: 'schoolDetails.INSTITUTION_NAME', label: 'Name' },{ key: 'schoolDetails.DISTRICT_NAME', label: 'Disctrict' }]
        };
    }
});

Template.chooseSchool.events({
  'click .reactive-table tbody tr': function (event) {
    // set the blog post we'll display details and news for
    var post = this;
    var audit = Audits.findOne({'school.schoolDetails.INSTITUTION_NAME' : this.schoolDetails.INSTITUTION_NAME})

    if (audit != undefined) {
      alert('There is already an audit for this school. Please contact ' + audit.user.email)
      return;
    }
    audit = new Object();

    audit.school = this;
    audit.forms = forms();
    audit.isDeleted = false;
    var user = new Object()
    user.id = Meteor.userId();
    user.email = Meteor.user().emails[0].address;
    audit.user = user;
    var auditID = Audits.insert(audit);

    Session.set('schoolName', this.schoolDetails.INSTITUTION_NAME)
    Session.set('auditId', auditID);

    Session.set('formIndex', 0);
    Session.set('sectionIndex', 0);
    Session.set('subsectionIndex', 0);

    Router.go('audit.home', {_id: audit._id, _formIndex: 0, _sectionIndex: 0, _subsectionIndex: 0});

  }
});

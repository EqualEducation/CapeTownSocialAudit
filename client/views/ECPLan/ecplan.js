Meteor.subscribe("ecschools");

Template.ecplan.helpers({

  
  inputAttributes: function () {
    return { 'class': 'easy-search-input', 'placeholder': 'Example: Mandela Primary' };
  },
  schools: function () {
    return ECSchools.find({}, { sort: { schoolName: -1, name: 1 } });
  },
  index: function () {
    return ECSchoolsIndex;
  },
  resultsCount: function () {
    return ECSchoolsIndex.getComponentDict().get('count');
  },
  showMore: function () {
    return false;
  },
  renderTmpl: () => Template.renderTemplate
});


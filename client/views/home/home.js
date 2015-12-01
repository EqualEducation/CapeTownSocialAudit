/*if (Meteor.isClient) {
  Meteor.subscribe("ecschools");
}
*/ 

Template.home.helpers({

  
  inputAttributes: function () {
    return { 'class': 'easy-search-input', 'placeholder': 'Example: Mandela Primary' };
  },
  ecschools: function () {
    return ECSchools.find({}, { sort: { schoolName: -1 } });
  },
  ECSchoolsIndex: function () {
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


Template.schoolSearch.helpers({


  inputAttributes: function () {
    return { 'class': 'easy-search-input', 'placeholder': 'Example: Mandela Primary' };
  },
  ecshools: function () {
    return ECSchools.find({}, { sort: { schoolName: -1 } });
  },
  ECSchoolsIndex: function () {
    return [ECSchoolsIndex];
  },
  resultsCount: function () {
    return ECSchoolsIndex.getComponentDict().get('count');
  },
  showMore: function () {
    return false;
  },
  renderTmpl: () => Template.renderTemplate

});

/*
Template.schoolResult.helpers({
  inEC: function () {

  }

  inASIDI: function () {

  }
});
*/

Template.schoolResult.rendered = function () {
  $('.collapsible').collapsible();
};

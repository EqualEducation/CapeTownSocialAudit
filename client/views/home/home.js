ECSchoolsIndex = new EasySearch.Index({
  collection  : ECSchools,
  fields      : ['schoolName'],
  engine      : new EasySearch.MongoDB()
  // engine: new EasySearch.MongoDB({
  //   sort: function () {
  //     return { schoolName: 1 };
  //   }
  // }),
  // collection: ECSchools,
  // fields: ['schoolName'],
  // defaultSearchOptions: {
  //   limit: 10
  // }
});

Template.schoolSearch.helpers({


  inputAttributes: function () {
    return { 'class': 'easy-search-input', 'placeholder': 'Example: Mandela Primary' };
  },
  ecshools: function () {
    return ECSchools.find({}, { sort: { schoolName: -1 } });
  },
  schoolsIndex: function () {
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

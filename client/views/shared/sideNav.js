
Template.sideNav.onRendered(function() {
  $('.collapsible').collapsible({
    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });
  $('.modal-trigger').leanModal();

  $('.button-collapse').sideNav({
      menuWidth: 100, // Default is 240
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );
});


Template.form.events({
  'click .cancel_formbs' : function(event, template) {
    event.preventDefault();
  },
  'click .save_formbs' : function(event, template) {
    event.preventDefault();
    var numberOfFormBsToAdd = template.find('#numberOfFormBs').value;
    var audit = this.audit;
    var totalNumberOfForms = audit.forms.length

    var formBs = audit.forms.filter(function( form ) {
      return form.name.indexOf("formB") > -1;
    });
    var totalNumberOfFormBs= formBs.length

    for(i=0; i<numberOfFormBsToAdd; i++) {
      var formToAdd = JSON.parse(JSON.stringify(formB));
      var currentFormIndex = totalNumberOfForms + i;
      formToAdd.index = currentFormIndex;
      formToAdd.name = formToAdd.name.replace('formB', 'formB' + currentFormIndex)
      var display_index = totalNumberOfFormBs + i + 1;
      formToAdd.display_name = formToAdd.display_name.replace('Form B', 'Form B.' + display_index)
      formToAdd.sections.forEach(function(section) {
        section.name = section.name.replace('formB', 'formB' + currentFormIndex)
        section.sub_sections.forEach(function(subsection) {
          subsection.name = subsection.name.replace('formB', 'formB' + currentFormIndex)
        })
      })

      audit.forms.push(formToAdd);
    }
    Audits.update({_id: audit._id}, {$set: {forms: audit.forms} });

    template.find('#addForms').reset();
  },
  'keypress .number' : function(evt){
      var theEvent = evt;
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode( key );
      var regex = /[0-9]|\./;
      if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault)
          theEvent.preventDefault();
      }
    },
  'click .changeIndex' : function(e, t) {
    var str = this.name;
    var names = str.split(".");
    var audit = t.data.audit;
    var form = audit.forms.filter(function( form ) {
      return form.name == names[0];
    });

    var section = form[0].sections.filter(function( section ) {
      return section.name == names[0]+'.'+names[1];
    });

    var subsectionIndex = this.index;

    Session.set('formIndex', form[0].index);
    Session.set('sectionIndex', section[0].index);
    Session.set('subsectionIndex', subsectionIndex);
    Session.set('currentSubsectionId', this.id);

    if (t.find('#' + Session.get('currentSubsectionId')) != undefined)
      t.find('#' + Session.get('currentSubsectionId')).reset();

  }
})

Template.registerHelper('shouldShowSideNav', function(){
    var isViewingAnAudit = (Router.current().url.indexOf("/audit/edit") > -1);
    return isViewingAnAudit;
});

Template.registerHelper('shouldHighlightForm', function(name){
  // var addClass = ""
  // var activeForm = Session.get('activeForm')
  // if (activeForm == name){
  //     addClass= 'active'
  // }
  // console.log(activeForm + ' : ' + name + ' - ' + addClass)
  // return addClass;
});

Template.registerHelper('shouldHighlightSubsection', function(name){
  var addClass = ""
  var activeSubsection = Session.get('activeSubsection')
  if (activeSubsection == name){
      addClass= 'active'
  }
  // console.log(activeSubsection + ' : ' + name + ' - ' + addClass)
  return addClass;
});

Template.registerHelper('shouldShow', function(hasChanges, isComplete) {
  // var shouldShow = "hide";
  // if (hasChanges != undefined) {
  //   if (hasChanges == true) {
  //     shouldShow = "";
  //   }
  // }
  //
  // return shouldShow;
  if (isComplete && hasChanges) {
    return 'done';
  }

  if (!isComplete && hasChanges) {
    return 'warning';
  }
});

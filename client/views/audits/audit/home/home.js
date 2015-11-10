Template.home.events({
  'click .save' : function(event, template) {
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
    Router.go('audit.home', {_id: audit._id, _formIndex: 0, _sectionIndex: 0, _subsectionIndex: 0});

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
    }
})

forms = function() {
  var all_forms = [formA, formC];
  return all_forms;
}

Template.form.helpers({
  'currentContext' : function() {
    var formIndex = Session.get('formIndex');
    if (formIndex == undefined) {
      Session.set('formIndex', 0);
      Session.set('sectionIndex', 0);
      Session.set('subsectionIndex', 0);
    }
    formIndex = Session.get('formIndex');
    var sectionIndex = Session.get('sectionIndex');
    var subsectionIndex = Session.get('subsectionIndex');

    var audit = this.audit;
    var ret = new Object();
    var section = audit.forms[formIndex].sections[sectionIndex];
    var subsectionToDisplay = section.sub_sections[subsectionIndex];
    Session.set('currentSubsectionId', subsectionToDisplay.id);

    ret.audit = this.audit;
    ret.sectionName = section.display_name;
    ret.subsection = subsectionToDisplay;
    ret.formName = audit.forms[formIndex].display_name;

    console.log('currentContext');
    Session.set('activeForm',  audit.forms[formIndex].name)
    Session.set('activeSubsection', subsectionToDisplay.name)
    return ret;
  }
});

Template.subsection.helpers({
  'nextOrFinish' : function() {
    var formIndex = Session.get('formIndex');
    if (formIndex == undefined) {
      Session.set('formIndex', 0);
      Session.set('sectionIndex', 0);
      Session.set('subsectionIndex', 0);
    }
    formIndex = Session.get('formIndex');
    var sectionIndex = Session.get('sectionIndex');
    var subsectionIndex = Session.get('subsectionIndex');

    var audit = this.audit;
    var totalNumberOfForms = audit.forms.length;
    var totalNumberOfSectionsInCurrentForm = audit.forms[formIndex].sections.length;
    var totalNumberOfSubsectionsInCurrentSection = audit.forms[formIndex].sections[sectionIndex].sub_sections.length;

    if (formIndex == totalNumberOfForms-1 && sectionIndex == totalNumberOfSectionsInCurrentForm-1 && subsectionIndex == totalNumberOfSubsectionsInCurrentSection-1){
      return 'Save and Finish';
    } else {
      return 'Next';
    }
  },
})

Template.subsection.events({
  'click .next' : function(event, template) {
    incrementFormSubsection(template)
    $(window).scrollTop(0);
  },
  'click .previous' : function(event, template) {
    decrementFormSubsection(template)
    $(window).scrollTop(0);

  },
  'submit' : function(event, template) {
    updateAudit(this, template);
  }
});


function incrementFormSubsection(template) {
  console.log('incrementing')
  var isLastSection = false;
  var formIndex = Session.get('formIndex');
  var sectionIndex = Session.get('sectionIndex');
  var subsectionIndex = Session.get('subsectionIndex')
  var audit = template.data.audit;
  var totalNumberOfForms = audit.forms.length;
  var totalNumberOfSectionsInCurrentForm = audit.forms[formIndex].sections.length;
  var totalNumberOfSubsectionsInCurrentSection = audit.forms[formIndex].sections[sectionIndex].sub_sections.length;


  if (subsectionIndex + 1 < totalNumberOfSubsectionsInCurrentSection)
  {
    //move to next subsection in current section in current form
    subsectionIndex++;
  } else
  {
    //we have reached the last subsection in current section in current form
    if (sectionIndex + 1 < totalNumberOfSectionsInCurrentForm)
    {
      //move to next sectionin current form
      sectionIndex++;
      subsectionIndex = 0;
    } else
    {
      isLastSection = true;
      //we have reached the last section in the current form
      if (formIndex + 1 < totalNumberOfForms)
      {
        //move to next form
        formIndex++;
        sectionIndex = 0;
        subsectionIndex = 0;
        //expand new form
      } else
      {
        //we have reached the last form
        Session.set('isLastForm', true)
        console.log('isLastForm')
        return nil;
      }
    }
  }
  Session.set('formIndex', formIndex);
  Session.set('sectionIndex', sectionIndex);
  Session.set('subsectionIndex', subsectionIndex);
  Session.set('isLastForm', false)
  Session.set('isLastSection', isLastSection)

}

function decrementFormSubsection(template) {
  var formIndex = Session.get('formIndex');
  var sectionIndex = Session.get('sectionIndex');
  var subsectionIndex = Session.get('subsectionIndex')
  var audit = template.data.audit;
  // var totalNumberOfForms = audit.forms.length;
  // var totalNumberOfSectionsInCurrentForm = audit.forms[formIndex].sections.length;
  // var totalNumberOfSubsectionsInCurrentSection = audit.forms[formIndex].sections[sectionIndex].sub_sections.length;

  if (subsectionIndex > 0) {
    subsectionIndex--;
  } else if (sectionIndex > 0) {
      sectionIndex--;
      var totalNumberOfSubsectionsInCurrentSection = audit.forms[formIndex].sections[sectionIndex].sub_sections.length;
      subsectionIndex = totalNumberOfSubsectionsInCurrentSection -1;
  } else if (formIndex > 0) {
    formIndex--;
    var totalNumberOfSectionsInCurrentForm = audit.forms[formIndex].sections.length;
    sectionIndex = totalNumberOfSectionsInCurrentForm -1;

    var totalNumberOfSubsectionsInCurrentSection = audit.forms[formIndex].sections[sectionIndex].sub_sections.length;
    subsectionIndex = totalNumberOfSubsectionsInCurrentSection -1;
  } else {
    Session.set('isLastForm', true)
    return nil;
  }

  Session.set('formIndex', formIndex);
  Session.set('sectionIndex', sectionIndex);
  Session.set('subsectionIndex', subsectionIndex);
  Session.set('isLastForm', false)
}

function updateAudit(object, template) {
    event.preventDefault();
    var subsection = object.subsection;
    if (subsection.subtype == 'grades' || subsection.subtype == 'staff'){
      if (subsection.subtype == 'staff') {
        var value = template.find('#' + subsection.id + '_comment').value
        subsection.comment = value;
      }

      subsection.rows.forEach(function(row){
        var rowValues = [];
        subsection.columns.forEach(function(col){
          if (col.type == 'calculated'){
            var calculatedObj = col;
            calculateTotals(subsection, calculatedObj);
          } else if (col.type != 'label') {
            var itemId = col.id + '_' + row.id;
            var item = new Object();
            item.id = col.id;
            var element = template.find('#' + itemId);
            if (element != undefined){
              var value = element.value
              item.value = value;
              rowValues.push(item);
            }
          }
        })
        row.values = rowValues;
      })
    } else {
      subsection.questions.forEach(function(question){
        if(question.hasComment) {
            var value = template.find('#' + question.id + '_comment').value
            question.comment = value;
        }

        if (question.type == 'checkbox') {
          var selected = template.findAll( "input[type=checkbox]:checked");
          var values = [];
          selected.forEach(function(selection) {
            // console.log(selection.name + ' ---- ' + question.id);
            if (selection.name == question.id) {
              values.push(selection.value);
            }
          });
          question.value = values;
        } else if(question.type == 'dropdown') {
            var selected = template.findAll("input[type=radio]:checked");
            var values = [];
            selected.forEach(function(selection) {
              // console.log(selection.name + ' ---- ' + question.id);
              if (selection.name == question.id) {
                // console.log(selection.name + ' ---- ' + question.id);
                values.push(selection.value);
              }
            });
            question.value = values;
        } else {
          var value = template.find('#' + question.id).value
          question.value = value;
        }
      })
    }

    subsection.hasChanges = true;
    var audit = object.audit;

    var str = subsection.name;
    var navigationItems = str.split(".");

    var form = audit.forms.filter(function( form ) {
      return form.name == navigationItems[0];
    });

    var section = form[0].sections.filter(function( section ) {
      return section.name == navigationItems[0]+'.'+navigationItems[1];
    });

    audit.forms[form[0].index].sections[section[0].index].sub_sections[subsection.index] = subsection;
    Meteor.call('calculatePercentageComplete', audit, function(err, response) {
      // console.log(err);
      // console.log(response)
      var updated = Audits.update({_id: response._id}, {$set: {forms: response.forms, complete: response.complete} });
    });

    var formIndex = Session.get('formIndex');
    var sectionIndex = Session.get('sectionIndex');
    var subsectionIndex = Session.get('subsectionIndex')

    if (Session.get('isLastForm')) {
      Router.go('audits');
    } else if (formIndex != form[0].index || sectionIndex != section[0].index || subsectionIndex != subsection.index) {
        template.find('#' + subsection.id).reset();
        Router.go('audit.edit', {_id: audit._id, _formIndex: formIndex, _sectionIndex: sectionIndex, _subsectionIndex: subsectionIndex});
    }

}

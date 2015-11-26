Template.dynamicTable.events({
  'click .delete' : function(event, template) {
    var subsection = template.data.subsection;

    subsection.objects.pop(this)
    // subsection.pop(this);

    var audit = Audits.findOne({_id: Router.current().params._id, 'user.id' : Meteor.userId()})

    var str = subsection.name;
    var navigationItems = str.split(".");

    var form = audit.forms.filter(function( form ) {
      return form.name == navigationItems[0];
    });

    var section = form[0].sections.filter(function( section ) {
      return section.name == navigationItems[0]+'.'+navigationItems[1];
    });

    audit.forms[form[0].index].sections[section[0].index].sub_sections[subsection.index] = subsection;
    Audits.update({_id: audit._id}, {$set: {forms: audit.forms} });

    // subsection.objects.pop(this);
    // subsection.hasChanges = true;
    //
    // var audit = Audits.findOne({_id: Router.current().params._id, 'user.id' : Meteor.userId()})
    //
    // var str = subsection.name;
    // var navigationItems = str.split(".");
    //
    // var form = audit.forms.filter(function( form ) {
    //   return form.name == navigationItems[0];
    // });
    //
    // var section = form[0].sections.filter(function( section ) {
    //   return section.name == navigationItems[0]+'.'+navigationItems[1];
    // });
    //
    // audit.forms[form[0].index].sections[section[0].index].sub_sections[subsection.index] = subsection;
    // Audits.update({_id: audit._id}, {$set: {forms: audit.forms} });
    //
    // template.find('#' + this.subsection.id).reset();
  },
  'click .modal-save' : function(event, template) {
    event.preventDefault();
    var object = []
    var subsection = this.subsection;

    subsection.columns.forEach(function(col) {
      if (col.type == "label") {
        return;
      }
      if (col.type == 'dropdown') {
        var values = [];
        var selected = template.findAll("input[type=radio]:checked");
        selected.forEach(function(selection) {
          var idx = selection.id.indexOf(col.id);
          if (idx > -1) {

            values.push(selection.value);
          }
        });

        var item = new Object();
        item.id = col.id;
        item.values = values;
        object.push(item)
      } else {
        var values = [];
        values.push(template.find('#' + col.id).value)
        var item = new Object();
        item.id = col.id;
        item.values = values;
        object.push(item)
      }
    })

    var newObjects = [];
    if (subsection.objects == undefined) {
      subsection.objects = newObjects;
    }
    subsection.objects.push(object);
    subsection.hasChanges = true;

    var audit = Audits.findOne({_id: Router.current().params._id})

    var str = subsection.name;
    var navigationItems = str.split(".");

    var form = audit.forms.filter(function( form ) {
      return form.name == navigationItems[0];
    });

    var section = form[0].sections.filter(function( section ) {
      return section.name == navigationItems[0]+'.'+navigationItems[1];
    });

    audit.forms[form[0].index].sections[section[0].index].sub_sections[subsection.index] = subsection;
    Audits.update({_id: audit._id}, {$set: {forms: audit.forms} });
    template.find('#' + this.subsection.id).reset();

  }
})

Template.dynamicTable.onRendered(function() {
  $('.modal-trigger').leanModal();
})

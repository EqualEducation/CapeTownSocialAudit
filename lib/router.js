//GLOBAL

Meteor.startup(function() {
  if(Meteor.isClient){
  }
});

Router.configure({
  layoutTemplate: 'main',
  template: 'audit',

});

var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function(pause) {
      if (!Meteor.userId()) {
        this.render('restricted');
        return pause;
      } else {
        return this.next();
      }
    },
    adminRequired:function(pause){
      if (!Roles.userIsInRole(Meteor.user(), 'admin')) {
        this.render('restricted');
        return pause;
      } else {
        return this.next();
      }
    },
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    except: []
});

Router.onBeforeAction(OnBeforeActions.adminRequired, {
    only: ['users', 'schools', 'export']
});

//ROUTES


Router.map(function () {
  this.route('schools', {
    template: 'schools',
    name: 'schools',
    path: '/schools',
    action: function () {
      this.render('schools');
    },
    waitOn: function () {
      // return Meteor.subscribe('all-schools');
    }
  });
});

Router.route('/upload', function () {
  this.subscribe("schools");
  this.render('upload');
});


Router.map(function () {
  this.route('export', {
    template: 'export',
    name: 'export',
    path: '/export',
    action: function () {
      this.render('export');
    },
    waitOn: function () {
      return Meteor.subscribe('audits');
    }
  });
});

Router.map(function () {
  this.route('audits', {
    template: 'audits',
    name: 'audits',
    path: '/audits',
    action: function () {
      this.subscribe('allUsers');
      this.render('audits');
    },
    waitOn: function () {
      // return Meteor.subscribe('user-audits');
    }
  });
});

Router.route('/audit/new', function () {
  this.subscribe("auditSchoolNames");
  this.render('chooseSchool');
});

Router.map(function () {
  this.route('audit/edit', {
    template: 'form',
    name: 'audit.edit',
    // path: '/audit/edit/:_id/:_formIndex/:_sectionIndex/:_subsectionIndex',
    path: '/audit/edit/:_id',
    action: function () {
      this.render('form'); // same as this.render()
    },
    waitOn: function () {
    // return Meteor.subscribe('post', this.params._id);
      return Meteor.subscribe('audits', this.params._id);
    },
    data: function ()
    {
      var data = new Object();
      var audit;
      if (!Roles.userIsInRole(Meteor.user(), 'admin')) {
        audit = Audits.findOne({_id: this.params._id, 'user.id' : Meteor.userId()})
      } else {
        audit = Audits.findOne({_id: this.params._id})
      }
      // var subsection = audit.forms[this.params._formIndex].sections[this.params._sectionIndex].sub_sections[this.params._subSectionIndex]
      data.audit = audit;
      // data.subsection = subsection;
      return data;
    },
  });
});

Router.map(function () {
  this.route('audit/auditHome', {
    template: 'auditHome',
    name: 'audit.home',
    // path: '/audit/edit/:_id/:_formIndex/:_sectionIndex/:_subsectionIndex',
    path: '/audit/edit/:_id/home',
    action: function () {
      Meteor.subscribe('audits', this.params._id);
      this.render('auditHome'); // same as this.render()
    },
    data: function ()
    {
      var data = new Object();
      var audit;
      if (!Roles.userIsInRole(Meteor.user(), 'admin')) {
        audit = Audits.findOne({_id: this.params._id, 'user.id' : Meteor.userId()})
      } else {
        audit = Audits.findOne({_id: this.params._id})
      }
      // var subsection = audit.forms[this.params._formIndex].sections[this.params._sectionIndex].sub_sections[this.params._subSectionIndex]
      data.audit = audit;
      // data.subsection = subsection;
      return data;
    },
  });
});


Router.route('/audit/school', function () {
  this.subscribe("auditSchoolNames");
  this.render('chooseSchool');
});

Router.route('/users', function () {
  this.subscribe('allUsers');
  this.render('users');
});


//// MK routes

Router.route('/', function () {
  this.subscribe('ecschools');  
  this.render('/home');
});

Router.route('/about');
Router.route('/contact');




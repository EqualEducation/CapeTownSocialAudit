//GLOBAL

Meteor.startup(function() {
  if(Meteor.isClient){
  }
});

Router.configure({
  layoutTemplate: 'main',
});

//// MK routes

Router.route('/', {
  template: 'home'
});

Router.route('/home');

Router.route('/contact');

Router.route('/about');


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
  template: 'home',
  name: 'r0'
});

Router.route('/home', {
  name: 'r1'
});

Router.route('/contact', {
  name: 'r2'
});
Router.route('/about', {
  name: 'r3'
});

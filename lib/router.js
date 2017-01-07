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
  name: 'home'
});

Router.route('/contact', {
  name: 'contact'
});
Router.route('/about', {
  name: 'about'
});

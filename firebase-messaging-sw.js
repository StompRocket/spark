importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js')

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyC33Gp6-aRbajLAp22adwWJdIvXX4CVHcM',
  authDomain: 'spark-524b4.firebaseapp.com',
  databaseURL: 'https://spark-524b4.firebaseio.com',
  projectId: 'spark-524b4',
  storageBucket: '',
  messagingSenderId: '1043381207552'
}
firebase.initializeApp(config)

const messaging = firebase.messaging()

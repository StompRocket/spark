var database = firebase.database()
var global = {
  chat: function () {
    var user = firebase.auth().currentUser
    var name, email, photoUrl, uid, emailVerified

    if (user != null) {
      name = user.displayName
      email = user.email
      photoUrl = user.photoURL
      emailVerified = user.emailVerified
      uid = user.uid // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }

    function getJsonFromUrl () {
      var query = location.search.substr(1)
      var result = {}
      query.split('&').forEach(function (part) {
        var item = part.split('=')
        result[item[0]] = decodeURIComponent(item[1])
      })
      return result
    }
    var chat = getJsonFromUrl().c
    var chatRef = firebase.database().ref('chats/' + chat)
    chatRef.on('value', function (snapshot) {
      app.messages = snapshot.val().mesages
      // console.log(snapshot.val().mesages)
      document.title = snapshot.val().title
      firebase.database().ref('users/' + uid + '/' + chat).set({
        title: snapshot.val().title,
        id: chat
      })
    })
  }
}
var app = new Vue({
  el: '#app',
  data: {
    loginText: 'Login',
    profileImage: './images/profile_placeholder.png',
    title: '',
    messages: [],
    chatTitle: '',
    chats: [],
    loading: true,
    message: ''
  },
  mounted: function () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        app.loginText = 'Logout'
        var user = firebase.auth().currentUser
        var name, email, photoUrl, uid, emailVerified

        if (user != null) {
          name = user.displayName
          email = user.email
          photoUrl = user.photoURL
          emailVerified = user.emailVerified
          uid = user.uid // The user's ID, unique to the Firebase project. Do NOT use
          // this value to authenticate with your backend server, if
          // you have one. Use User.getToken() instead.
        }
        app.profileImage = photoUrl

        function getJsonFromUrl () {
          var query = location.search.substr(1)
          var result = {}
          query.split('&').forEach(function (part) {
            var item = part.split('=')
            result[item[0]] = decodeURIComponent(item[1])
          })
          return result
        }

        if (getJsonFromUrl().c) {
          // console.log(true)
          global.chat()
        } else {
          document.title = 'Spark'
         
        }
        var chatsRef = firebase.database().ref('users/' + uid)
        chatsRef.on('child_added', function (data) {
          app.chats.push({
            title: data.val().title,
            id: data.val().id
          })
          app.loading = false
        })
      } else {
        app.loginText = 'Login'
        app.profileImage = './images/profile_placeholder.png'
         firebase.auth().signInWithPopup(provider).then(function (result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken
  // The signed-in user info.
            var user = result.user
  // ...
          }).catch(function (error) {
  // Handle Errors here.
            var errorCode = error.code
            var errorMessage = error.message
  // The email of the user's account used.
            var email = error.email
  // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential
  // ...
          })
      }
    })
  },
  methods: {
    openChat: function (chat) {
      var stateObj = { foo: 'bar' }
      history.pushState(stateObj, 'Spark', '?c=' + chat)
      global.chat()
    },
    getURL: function (chat) {
      return '/?c=' + chat
    },
    send: function () {
      // console.log(chat, app.message)
      var message = app.message
      if (message) {
        // console.log('sending')

        function getJsonFromUrl () {
          var query = location.search.substr(1)
          var result = {}
          query.split('&').forEach(function (part) {
            var item = part.split('=')
            result[item[0]] = decodeURIComponent(item[1])
          })
          return result
        }
        var user = firebase.auth().currentUser
        var name, email, photoUrl, uid, emailVerified

        if (user != null) {
          name = user.displayName
          email = user.email
          photoUrl = user.photoURL
          emailVerified = user.emailVerified
          uid = user.uid // The user's ID, unique to the Firebase project. Do NOT use
          // this value to authenticate with your backend server, if
          // you have one. Use User.getToken() instead.
        }
        var chat = getJsonFromUrl().c
        var newMessageRef = firebase.database().ref('chats/' + chat + '/mesages/').push()
        newMessageRef.set({
          text: message,
          sender: {
            name: name,
            image: photoUrl
          }
        }).then(function () {
          app.message = ''
        })
      }
    },

    disabled: function () {
      // console.log(app.message)
      if (app.message) {
        return false
      } else {
        return true
      }
    },
    getProfileImage: function (image) {
      var result = image

      if (image == 'spark') {
        result = './images/profile_placeholder.png'
      }

      return result
    },
    chat: function () {
      global.chat()
    },
    newTeamSubmit: function () {
      var dialog = document.querySelector('dialog')
      var user = firebase.auth().currentUser
      var name, email, photoUrl, uid, emailVerified

      if (user != null) {
        name = user.displayName
        email = user.email
        photoUrl = user.photoURL
        emailVerified = user.emailVerified
        uid = user.uid // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
      }
      var newChat = firebase.database().ref('chats/').push()
      var key = newChat.key
      var newChatRef = newChat.set({
        title: app.title,
        id: key,
        mesages: {
          '-KuvTy9nUfCdKGkPsMrs': {
            text: 'A new spark team',
            sender: {
              name: 'admin',
              image: 'spark'
            }
          }
        }
      }).then(function (snap) {
        // console.log(key)
        var stateObj = { foo: 'bar' }
        history.pushState(stateObj, 'Spark', '?c=' + key)
        global.chat()
        app.title = ''
      })

      dialog.close()

      var stateObj = {
        foo: 'Chat'
      }
    },
    newTeam: function () {
      var dialog = document.querySelector('dialog')
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog)
      }
      dialog.showModal()
      dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close()
      })
    },
    login: function () {
      var loginToast = document.querySelector('#toast')
      var user = firebase.auth().currentUser

      if (user) {
        firebase.auth().signOut().then(function () {
          var data = {
            message: 'Signed Out'
          }
          loginToast.MaterialSnackbar.showSnackbar(data)
        }).catch(function (error) {
          // An error happened.
        })
      } else {
        firebase.auth().signInWithPopup(provider).then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken
          // The signed-in user info.
          var user = result.user
          var data = {
            message: 'Logged In'
          }
          loginToast.MaterialSnackbar.showSnackbar(data)
          // app.loginText = 'Logout'
        }).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code
          var errorMessage = error.message
          // The email of the user's account used.
          var email = error.email
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential
          // ...
        })
      }
    }
  }
})

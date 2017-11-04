const messaging = firebase.messaging()

var database = firebase.database()
var global = {
  chat: function () {
    app.loading = true
    app.welcome = false
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
    messaging.getToken().then(function (token) {
      console.log(token)
      firebase.database().ref('chats/' + chat + '/members/' + uid + '/').set({
        token: token,
        uid: uid,
        name: name
      })
    })

    var chatRef = firebase.database().ref('chats/' + chat)
    chatRef.on('value', function (snapshot) {
      if (!snapshot.val()) {
        window.location.href = './'
      }
      app.messages = snapshot.val().mesages
      app.loading = false
      // console.log(snapshot.val().mesages)
      document.title = snapshot.val().title
      firebase.database().ref('users/' + uid + '/' + chat).set({
        title: snapshot.val().title,
        id: chat
      })
      setTimeout(function () {
        var elem = document.getElementById('messagesContainer')
        elem.scrollTop = elem.scrollHeight
      }, 200)
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
    message: '',
    welcome: true,
    teamCode: '',
    sharing: false,
    user: {
      loggedIn: false,
      name: '',
      email: ''
    }
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
        app.user.loggedIn = true
        app.user.name = name
        app.user.email = email
        console.log(uid)
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
          var chat = getJsonFromUrl().c
          global.chat()
          app.welcome = false
          console.log(app.welcome)
          messaging.requestPermission()
            .then(function () {
              console.log('Notification permission granted.')
              return messaging.getToken()
            })
            .then(function (token) {
              console.log(token)
              firebase.database().ref('chats/' + chat + '/members/' + uid + '/').set({
                token: token,
                uid: uid,
                name: name
              })
            })
            .catch(function (err) {
              console.log('An error occurred while retrieving token. ', err)
              console.log('Error retrieving Instance ID token. ', err)
            })
        } else {
          document.title = 'Spark'
          app.loading = false
        }
        messaging.onMessage(function (payload) {
          console.log('message', payload)
          Materialize.toast('<b>' + payload.notification.title + ' </b> <p> &nbsp; ' + payload.notification.body + '</p>', 4000)
        })
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
        firebase.auth().signInWithRedirect(provider)
      }
    })
  },
  methods: {
    addTeamSubmit: function () {
      $('#addTeamModal').modal('close')
      var code = app.teamCode
      // console.log(code)
      firebase.database().ref('codeRef/' + code).once('value').then(function (snapshot) {
        var chatID = snapshot.val().chatID
        // console.log(snapshot.val())

        history.pushState({

          foo: chatID
        }, 'Spark', '?c=' + chatID)
        global.chat()
        app.welcome = false
      })
      app.teamCode = ''
    },
    addTeam: function () {
      var teamdialog = document.querySelector('#addTeamDialog')
      if (!teamdialog.showModal) {
        dialogPolyfill.registerDialog(teamdialog)
      }
      teamdialog.showModal()
      teamdialog.querySelector('.close').addEventListener('click', function () {
        teamdialog.close()
      })
    },
    chatURL: function () {
      return window.location.href
    },
    chatCode: function () {
      if (this.sharing) {
        function generateChatID () {
          // I generate the UID from two parts here
          // to ensure the random number provide enough bits.
          var firstPart = (Math.random() * 46656) | 0
          var secondPart = (Math.random() * 46656) | 0
          firstPart = ('000' + firstPart.toString(36)).slice(-3)
          secondPart = ('000' + secondPart.toString(36)).slice(-3)
          return firstPart + secondPart
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
        var code = generateChatID()
        firebase.database().ref('codeRef/' + code).set({
          chatID: chat
        })
        return code
        this.sharing = false
      }
    },
    openShareModal: function () {
      this.sharing = true
      $('#shareTeamModal').modal()
      $('#shareTeamModal').modal('open')
    },
    openNewTeamModal: function () {
      $('#newTeamModal').modal()
      $('#newTeamModal').modal('open')
    },
    openAddTeamModal: function () {
      $('#addTeamModal').modal()
      $('#addTeamModal').modal('open')
    },
    openShareDialog: function () {
      this.sharing = true
      var dialog = document.querySelector('#shareDialog')
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog)
      }
      dialog.showModal()
      dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close()
        this.sharing = false
      })
    },
    openChat: function (chat) {
      var stateObj = {
        foo: 'bar'
      }
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
            image: photoUrl,
            uid: uid
          }
        }).then(function () {
          app.message = ''
        })
      }
    },

    disabled: function () {
      // console.log(app.message)
      if (this.message) {
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
        var stateObj = {
          foo: 'bar'
        }
        history.pushState(stateObj, 'Spark', '?c=' + key)
        global.chat()
        app.title = ''
      })

      $('newTeamModal').modal('close')

      var stateObj = {
        foo: 'Chat'
      }
    },
    newTeam: function () {
      var dialog = document.querySelector('#newTeamDialog')
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
  },
  filters: {
    reverse: function (array) {
      return array.slice().reverse()
    }
  }
})

import firebase from 'firebase'
import router from '@/router'
export const actions = {
  userSignIn ({commit}, payload) {
    commit('setLoading', true)
    firebase.auth().signInWithPopup(provider).then(function (result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken
  // The signed-in user info.
      var user = result.user
      commit('setUser', user)
      commit('setLoading', false)
      router.push('/')
    }).catch(function (error) {
  // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
  // The email of the user's account used.
      var email = error.email
  // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential
      commit('setError', error)
      commit('setLoading', false)
  // ...
    })
  },
  userLogOut ({commit}, payload) {
    commit('setLoading', true)
    firebase.auth().signOut().then(function () {
  // Sign-out successful.
    }).catch(function (error) {
      commit('setLoading', false)
      router.push('/')
    })
  }
}

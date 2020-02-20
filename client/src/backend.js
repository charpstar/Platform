import firebase from "firebase/app"

var database = null



export default {
    init() {
        database = firebase.database()
    },

    login(email) {
        var id = 1
        if (email == "admin") {
            id = 2
        }
        return new Promise((resolve) => {
            database.ref("users/" + id).once('value').then((data) => {
                resolve(data.val())
            })
        })
    },

    getItems(id) {
        return new Promise((resolve) => {
            database.ref("items/" + id).once('value').then((data) => {
                resolve(data.val())
            })
        })
    },

    getClients() {
        return new Promise((resolve) => {
            database.ref("clients").once('value').then((data) => {
                resolve(data.val())
            })
        })
    },

    sendComment(id, comments) {
        return new Promise((resolve) => {
            database.ref("items/1/" + id + "/comments").set(comments).then((data) => {
                resolve(data.val())
            })
        })
    }
}
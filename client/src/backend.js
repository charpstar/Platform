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
    },

    uploadModels(id, android, ios, thumbnail) {
        var androidTask = new Promise((resolve) => {
            firebase.storage().ref('models/android/' + id + '.glb').putString(android, 'data_url')
            .then(snapshot => snapshot.ref.getDownloadURL()).then((androidurl) => {
                database.ref("items/1/" + id + "/modelLink").set(androidurl).then(
                    resolve(androidurl)
                )
            })
        })
        var iosTask = new Promise((resolve) => {
            firebase.storage().ref('models/ios/' + id + '.usdz').putString(ios, 'data_url')
            .then(snapshot => snapshot.ref.getDownloadURL()).then((iosurl) => {
                database.ref("items/1/" + id + "/iosLink").set(iosurl).then(
                    resolve(iosurl)
                )
            })
        })
        var thumbTask = new Promise((resolve) => {
            firebase.storage().ref('thumbnails/' + id + '.png').putString(thumbnail, 'data_url')
            .then(snapshot => snapshot.ref.getDownloadURL()).then((thumburl) => {
                database.ref("items/1/" + id + "/icon").set(thumburl).then(
                    resolve(thumburl)
                )
            })
        })
        return Promise.all([androidTask, iosTask, thumbTask])
    }
}
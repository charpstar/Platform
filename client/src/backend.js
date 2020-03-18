import firebase from "firebase/app"

var database = null

 function pad(n) {
    return n<10 ? '0'+n : n;
}
export default {
    randomid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     },

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

    updateOrderComments(order) {
        return new Promise((resolve) => {
            database.ref("orders/" + order.clientid + '/' + order.orderid + "/comments").set(order.comments).then(() => {
                resolve()
            })
        })
    },

    updateModelComments(model) {
        return new Promise((resolve) => {
            database.ref("orders/" + model.clientid + '/' + model.orderid + '/models/' + model.modelid ).set(model).then(() => {
                resolve()
            })
        })
    },

    uploadModels(model, android, ios, thumbnail) {
        var androidTask = new Promise((resolve) => {
            firebase.storage().ref('models/android/' + model.modelid + '.glb').putString(android, 'data_url')
            .then(snapshot => snapshot.ref.getDownloadURL()).then((androidurl) => {
                database.ref("orders/" + model.clientid + '/' + model.orderid + '/models/' + model.modelid + "/androidmodel").set(androidurl).then(
                    resolve(androidurl)
                )
            })
        })
        var iosTask = new Promise((resolve) => {
            firebase.storage().ref('models/ios/' + model.modelid + '.usdz').putString(ios, 'data_url')
            .then(snapshot => snapshot.ref.getDownloadURL()).then((iosurl) => {
                database.ref("orders/" + model.clientid + '/' + model.orderid + '/models/' + model.modelid + "/iosmodel").set(iosurl).then(
                    resolve(iosurl)
                )
            })
        })
        var thumbTask = new Promise((resolve) => {
            firebase.storage().ref('thumbnails/' + model.modelid + '.png').putString(thumbnail, 'data_url')
            .then(snapshot => snapshot.ref.getDownloadURL()).then((thumburl) => {
                database.ref("orders/" + model.clientid + '/' + model.orderid + '/models/' + model.modelid + "/thumbnail").set(thumburl).then(
                    resolve(thumburl)
                )
            })
        })
        return Promise.all([androidTask, iosTask, thumbTask])
    },

    getOrders(id) {
        return new Promise((resolve) => {
            database.ref("orders/" + id).once('value').then((data) => {
                data = data.val()
                if (data == null) {
                    data = []
                } else {
                    data = Object.values(data)
                }
                data.forEach(order => {
                    if(order.comments == null) {
                        order.comments = []
                    }
                    if(order.models == null) {
                        order.models = {}
                    } else {
                        order.models = Object.values(order.models)
                    }
                    order.models.forEach(model => {
                        if(model.comments == null) {
                            model.comments = []
                        }
                    })
                });
                resolve(data)
            })
        })
    },

    newModelObj(orderid, clientid) {
        return {
            comments: [],
            thumbnail: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/thumbnails%2F0.png?alt=media&token=5c84937b-e978-4ac8-a28e-1a3cfd88922f",
            modelid: this.randomid(32),
            orderid: orderid,
            clientid: clientid,
            iosmodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
            androidmodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
            blendermodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
            name: 'A Model',
            status: 'Complete',
            statusicon: 'check'
        }
    },

    addNewModel(order, modelName) {
        var backend = this
        return new Promise(resolve => {
            var modelobj = backend.newModelObj(order.orderid, order.clientid)
            modelobj.name = modelName
            var ref = database.ref("orders/" + order.clientid + '/' + order.orderid + '/models')
            ref.once('value').then(res => {
                var models = res.val()
                if (models == null) {
                    models = []
                }
                models.push(modelobj)
                ref.set(models).then(() => {
                    resolve(modelobj)
                })
            })
        })
    },

    newOrder(clientid) {
        return new Promise((resolve) => {
            var orderId = this.randomid(32)
            var time = new Date()
            var year = time.getFullYear();
            var month = pad(time.getMonth() + 1); 
            var date = pad(time.getDate());
            var hour = pad(time.getHours());
            var minute = pad(time.getMinutes());
            var models = {}
            for (let i = 0; i < 10; i++) {
                var newModel = this.newModelObj(orderId, clientid)
                models[newModel.modelid] = newModel
            }
            var order = {
                orderid: orderId,
                timestamp: time.getTime(),
                time: year + '-' + month + '-' + date + ' ' + hour + ':' + minute,
                clientid: clientid,
                amount: 10,
                status: 'Under review',
                clientname: 'DemoClient',
                comments: [],
                models: models
            }
            database.ref("orders/" + clientid + '/' + orderId).set(order).then(() => {
                resolve(order)
            })
        })
    }
}
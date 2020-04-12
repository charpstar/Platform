import firebase from "firebase/app"
import Axios from 'axios'
var database = null
Axios.defaults.withCredentials = true
Axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded'
function pad(n) {
    return n<10 ? '0'+n : n;
}

function databaseGet(ref) {
    return new Promise((resolve) => {
        database.ref(ref).once('value').then((data) => {
            resolve(data.val())
        })
    })
}

function databaseSet(ref, val) {
    return new Promise((resolve) => {
        database.ref(ref).set(val).then(() => {
            resolve()
        })
    })
}

function databaseUpload(ref, data) {
    return new Promise((resolve) => {
        firebase.storage().ref(ref).putString(data, 'data_url')
        .then(snapshot => snapshot.ref.getDownloadURL()).then((url) => {
            resolve(url)
        })
    })
}
export default {
    emptyObj(obj) {
        return Object.keys(obj).length === 0
    },

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

    login(email, password) {
        var email2 = 'root@charpstar.com'
        password = 'root'
        Axios.post('http://46.101.115.253:8081/login', {email:email2, password:password}).then((e) => {
            //eslint-disable-next-line no-console
            console.log(e)
        })
        return new Promise((resolve, reject) => {
            databaseGet("users").then((users) => {
                if (users == null) {
                    users = {}
                }
                users = Object.values(users)
                var user = users.find(u => u.email == email)
                
                if(user) {
                    resolve(user)
                } else {
                    reject()
                }
            })
        })
    },

    getUsers() {
        Axios.get('http://46.101.115.253:8081/admin/getusers').then((e) => {
            //eslint-disable-next-line no-console
            console.log(e)
        })
        return new Promise((resolve) => {
            databaseGet("users").then(data => {
                resolve(data)
            })
        })
    },

    getModelers() {
        return new Promise((resolve) => {
            databaseGet("users").then(data => {
                Object.values(data).forEach(user => {
                    if(user.type != 'modeler') {
                        delete data[user.id]
                    }
                })
                resolve(data)
            })
        })
    },

    getOrders(clientid) {
        return new Promise((resolve) => {
            databaseGet("orders").then((data) => {
                if (data == null) {
                    data = {}
                }
                Object.values(data).forEach(order => {
                    if(order.clientid != clientid) {
                        delete data[order.orderid]
                    }
                    if(order.comments == null) {
                        order.comments = []
                    }
                })
                resolve(data)
            })
        })
    },

    getAllOrders() {
        return new Promise((resolve) => {
            databaseGet("orders").then((data) => {
                if (data == null) {
                    data = {}
                }
                Object.values(data).forEach(order => {
                    if(order.comments == null) {
                        order.comments = []
                    }
                })
                resolve(data)
            })
        })
    },

    getModels(orderid) {
        return new Promise((resolve) => {
            databaseGet("models").then((data) => {
                if (data == null) {
                    data = {}
                }
                Object.values(data).forEach(model => {
                    if(model.orderid != orderid) {
                        delete data[model.modelid]
                    }
                    if(model.comments == null) {
                        model.comments = []
                    }
                })
                resolve(data)
            })
        })
    },

    getAllModels() {
        return new Promise((resolve) => {
            databaseGet("models").then((data) => {
                if (data == null) {
                    data = {}
                }
                Object.values(data).forEach(model => {
                    if(model.comments == null) {
                        model.comments = []
                    }
                })
                resolve(data)
            })
        })
    },

    updateOrderComments(order) {
        return new Promise((resolve) => {
            database.ref("orders/" + order.orderid + "/comments").set(order.comments).then(() => {
                resolve()
            })
        })
    },

    updateModelComments(model) {
        return new Promise((resolve) => {
            database.ref("models/" + model.modelid + "/comments").set(model.comments).then(() => {
                resolve()
            })
        })
    },

    uploadModels(model, android, ios, thumbnail) {
        var androidTask = new Promise((resolve) => {
            databaseUpload('android/' + model.modelid + '.glb', android).then((url) => {
                database.ref('models/' + model.modelid + "/androidmodel").set(url).then(
                    resolve(url)
                )
            })
        })
        var iosTask = new Promise((resolve) => {
            databaseUpload('ios/' + model.modelid + '.usdz', ios).then((url) => {
                database.ref('models/' + model.modelid + "/iosmodel").set(url).then(
                    resolve(url)
                )
            })
        })
        var thumbTask = new Promise((resolve) => {
            databaseUpload('thumbnails/' + model.modelid + '.png', thumbnail).then((url) => {
                database.ref('models/' + model.modelid + "/thumbnail").set(url).then(
                    resolve(url)
                )
            })
        })
        return Promise.all([androidTask, iosTask, thumbTask])
    },

    newUser(name, email, type) {
        return new Promise(resolve => {
            var user = {
                name: name,
                email: email,
                type: type.toLowerCase(),
                id: this.randomid(32)
            }
            database.ref("users/" + user.id).set(user).then(() => {
                resolve(user)
            })
        })
    },

    newModel(orderid, clientid, modelName) {
        var backend = this
        return new Promise(resolve => {
            var model = {
                comments: [],
                thumbnail: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/thumbnails%2F0.png?alt=media&token=5c84937b-e978-4ac8-a28e-1a3cfd88922f",
                modelid: backend.randomid(32),
                orderid: orderid,
                clientid: clientid,
                iosmodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
                androidmodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
                blendermodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
                name: modelName,
                status: 'Complete',
                statusicon: 'check',
                assignedmodeler: false
            }
            database.ref("models/" + model.modelid).set(model).then(() => {
                resolve(model)
            })
        })
    },

    newOrder(client) {
        return new Promise((resolve) => {
            var orderid = this.randomid(32)
            var time = new Date()
            var year = time.getFullYear();
            var month = pad(time.getMonth() + 1); 
            var date = pad(time.getDate());
            var hour = pad(time.getHours());
            var minute = pad(time.getMinutes());
            for (let i = 0; i < 10; i++) {
                this.newModel(orderid, client.id, "A new model")
            }
            var order = {
                orderid: orderid,
                timestamp: time.getTime(),
                time: year + '-' + month + '-' + date + ' ' + hour + ':' + minute,
                clientid: client.id,
                amount: 10,
                status: 'Under review',
                clientname: client.name,
                comments: [],
                assignedqa: false
            }
            database.ref("orders/" + orderid).set(order).then(() => {
                resolve(order)
            })
        })
    },

    assignQA(orderid, account) {
        return new Promise(res => {
            var assignment = {
                name: account.name,
                userid: account.id
            }
            databaseSet('orders/' + orderid + '/assignedqa', assignment).then(() => {
                res(assignment)
            })
        })
    },

    assignModeler(modelid, account) {
        return new Promise(res => {
            var assignment = {
                name: account.name,
                userid: account.id
            }
            databaseSet('models/' + modelid + '/assignedmodeler', assignment).then(() => {
                res(assignment)
            })
        })
    },

    deleteUser(userid) {
        return new Promise(res => {
            databaseSet('users/' + userid, null).then(() => {
                res()
            })
        })
    },

    resetPassword() {
        return new Promise(res => {
            res(this.randomid(10))
        })
    }
}
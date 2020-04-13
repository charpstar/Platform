import firebase from "firebase/app"
import Axios from 'axios'
Axios.defaults.withCredentials = true

const backend = 'http://46.101.115.253:8081'
var database = null

function dbPost(url, data) {
    var p = new Promise((resolve, reject) => {
        Axios.post(backend + url, data).then((res) => {
            if(res.data.error == '') {
                resolve(res.data.data)
            } else {
                reject(res.data.error)
            }
        })
    })
    p.then(e => {
        //eslint-disable-next-line no-console
        console.log(e)
    }).catch(e => {
        //eslint-disable-next-line no-console
        console.log(e)
    })
    return p 

}

function dbGet(url) {
    var p = new Promise((resolve, reject) => {
        Axios.get(backend + url).then((res) => {
            if(res.data.error == '') {
                resolve(res.data.data)
            } else {
                reject(res.data.error)
            }
        })
    })
    p.then(e => {
        //eslint-disable-next-line no-console
        console.log(e)
    }).catch(e => {
        //eslint-disable-next-line no-console
        console.log(e)
    })
    return p
}

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
        return dbPost('/login', {email:email, password:password})
    },

    logout() {
        return dbGet('/logout')
    },

    getUsers() {
        return dbGet('/admin/getusers')
    },

    getModelers() {
        return dbGet('/qa/getmodelers')
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
        //return dbGet('/qa/getorders')
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
                    if(model.blendercomments == null) {
                        model.blendercomments = []
                    }
                    if(model.blendermodel == null) {
                        model.blendermodel = ''
                    }
                    Object.values(model.products).forEach(product => {
                        if(product.comments == null) {
                            product.comments = []
                        }
                    })
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
                    if(model.blendercomments == null) {
                        model.blendercomments = []
                    }
                    if(model.blendermodel == null) {
                        model.blendermodel = ''
                    }
                    Object.values(model.products).forEach(product => {
                        if(product.comments == null) {
                            product.comments = []
                        }
                    })
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
            database.ref("models/" + model.modelid + "/blendercomments").set(model.blendercomments).then(() => {
                resolve()
            })
        })
    },

    updateProductComments(model, product) {
        return new Promise((resolve) => {
            database.ref("models/" + model.modelid + "/products/" + product.id + '/comments').set(product.comments).then(() => {
                resolve()
            })
        })
    },

    uploadModels(model, product, android, ios, thumbnail) {
        var androidTask = new Promise((resolve) => {
            databaseUpload('android/' + model.modelid + product.id + '.glb', android).then((url) => {
                database.ref('models/' + model.modelid + '/products/' + product.id + "/androidmodel").set(url).then(
                    resolve(url)
                )
            })
        })
        var iosTask = new Promise((resolve) => {
            databaseUpload('ios/' + model.modelid + product.id + '.usdz', ios).then((url) => {
                database.ref('models/' + model.modelid + '/products/' + product.id + "/iosmodel").set(url).then(
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

    uploadBlenderModel(model, blender) {
        return new Promise((resolve) => {
            databaseUpload('blender/' + model.modelid + '.blend', blender).then((url) => {
                database.ref('models/' + model.modelid + "/blendermodel").set(url).then(
                    resolve(url)
                )
            })
        })
    },

    newUser(userObj) {
        var password = this.randomid(10)
        userObj.password = password
        userObj.repeatPassword = password
        userObj.active = true
        return dbPost('/admin/createuser', userObj)
    },

    newModel(orderid, clientid, modelName) {
        var backend = this
        return new Promise(resolve => {
            var products = {}
            var id = backend.randomid(10)
            products[id] = {
                color: 'Gold',
                iosmodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
                androidmodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
                comments: [],
                id: id
            }
            id = backend.randomid(10)
            products[id] = {
                color: 'Black',
                iosmodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
                androidmodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
                comments: [],
                id: id
            }
            var model = {
                thumbnail: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/thumbnails%2F0.png?alt=media&token=5c84937b-e978-4ac8-a28e-1a3cfd88922f",
                products: products,
                modelid: backend.randomid(32),
                orderid: orderid,
                clientid: clientid,
                blendercomments: [],
                blendermodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/blender%2F2U4HFJz629ALDFeBkKegSignrGKCJInY.blend?alt=media&token=6c009964-d3de-41d8-b34d-d7d81e7c9b43",
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

    createOrder(file) {
        var formData = new FormData()
        formData.append("orderdata", file);
        return new Promise((resolve, reject) => {
            Axios.post(backend + '/client/createorder', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).then((res) => {
                if(res.data.error == '') {
                    resolve(res.data.data)
                } else {
                    reject(res.data.error)
                }
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
                this.newModel(orderid, client.userid, "A new model")
            }
            var order = {
                orderid: orderid,
                timestamp: time.getTime(),
                time: year + '-' + month + '-' + date + ' ' + hour + ':' + minute,
                clientid: client.userid,
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
                userid: account.userid
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
                userid: account.userid
            }
            databaseSet('models/' + modelid + '/assignedmodeler', assignment).then(() => {
                res(assignment)
            })
        })
    },

    deleteUser(userid) {
        return dbPost('/admin/deleteuser', {userid: userid})
    },

    resetPassword(userid, password) {
        return dbPost('/admin/edituser', {userid: userid, password: password, repeatPassword: password})
    },

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    },

    postIdFix(email) {
        var db = this
        return new Promise(resolve => {
            db.getUsers().then(users => {
                var id = db.getKeyByValue(users, email)
                databaseSet('/tempidfix/' + id, email).then(() => {
                    resolve(id)
                })
            })
        })
    },

    getIdFix(email) {
        var db = this
        return new Promise(resolve => {
            databaseGet('/tempidfix').then(users => {
                var id = db.getKeyByValue(users, email)
                resolve(id)
            })
        })
    }
}


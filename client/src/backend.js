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

const StatusIcons = {
    1: '',
    2: '',
    3: 'mdi-information',
    4: '',
    5: 'mdi-information',
    6: 'mdi-information',
    7: '',
    8: '',
    9: '',
    10: 'mdi-image-search',
    11: '',
    12: 'mdi-check',
    13: '',
    14: ''
}

const Messages = {
    1: 'Order received',
    2: 'Under review',
    3: 'Information missing',
    4: 'Under development',
    5: 'Information missing',
    6: 'Information missing',
    7: 'QA review',
    8: 'QA review',
    9: 'Redoing model',
    10: 'Client review',
    11: 'Redoing model',
    12: 'Complete',
    13: 'Pause',
    14: 'Error'

}

const ClientMessages = {
    1: 'Order received',
    2: 'Order received',
    3: 'Information missing',
    4: 'Under development',
    5: 'Information missing',
    6: 'Information missing',
    7: 'Under development',
    8: 'Under development',
    9: 'Under development',
    10: 'Ready for review',
    11: 'Incorporating feedback',
    12: 'Complete',
    13: 'Pause',
    14: 'Error'
}

export default {

    promiseHandler(fun) {
        var handler = {
            modal: false,
            loading: false,
            error: '',
            fun: fun
        }
        handler.execute = () => {
            handler.loading = true
            handler.fun().then(() => {
                handler.modal = false
                handler.loading = false
                handler.error = ''
            }).catch(error => {
                handler.error = error
                handler.loading = false
            })
        }
        return handler
    },

    messageFromStatus(status, usertype) {
        if(usertype == 'Client') {
            return ClientMessages[status]
        }
        return Messages[status]
    },

    iconFromStatus(status) {
        return StatusIcons[status]
    },


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

    relogin() {
        return dbGet('/login')
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
                    if(model.comments == null) {
                        model.comments = []
                    }
                    if(model.files == null) {
                        model.files = {}
                    }
                    Object.values(model.products).forEach(product => {
                        if(product.comments == null) {
                            product.comments = []
                        }
                        if(product.qacomments == null) {
                            product.qacomments = []
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
                    if(model.comments == null) {
                        model.comments = []
                    }
                    if(model.files == null) {
                        model.files = {}
                    }
                    Object.values(model.products).forEach(product => {
                        if(product.comments == null) {
                            product.comments = []
                        }
                        if(product.qacomments == null) {
                            product.qacomments = []
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
            database.ref("models/" + model.modelid + "/comments").set(model.comments).then(() => {
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

    updateProductQAComments(model, product) {
        return new Promise((resolve) => {
            database.ref("models/" + model.modelid + "/products/" + product.id + '/qacomments').set(product.qacomments).then(() => {
                resolve()
            })
        })
    },

    uploadAndroidModel(model, product, file) {
        return new Promise((resolve) => {
            databaseUpload('android/' + model.modelid + product.id + '.glb', file).then((url) => {
                database.ref('models/' + model.modelid + '/products/' + product.id + "/androidmodel").set(url).then(
                    resolve(url)
                )
            })
        })
    },

    uploadIosModel(model, product, file) {
        return new Promise((resolve) => {
            databaseUpload('ios/' + model.modelid + product.id + '.glb', file).then((url) => {
                database.ref('models/' + model.modelid + '/products/' + product.id + "/iosmodel").set(url).then(
                    resolve(url)
                )
            })
        })
    },

    uploadThumbnail(model, thumbnail) {
        return new Promise((resolve) => {
            databaseUpload('thumbnails/' + model.modelid + '.png', thumbnail).then((url) => {
                database.ref('models/' + model.modelid + "/thumbnail").set(url).then(
                    resolve(url)
                )
            })
        })
    },

    uploadBlenderModel(model, product, blender) {
        return new Promise((resolve) => {
            databaseUpload('blender/' + model.modelid + product.id + '.blend', blender).then((url) => {
                database.ref('models/' + model.modelid + '/products/' + product.id + "/blendermodel").set(url).then(
                    resolve(url)
                )
            })
        })
    },

    uploadModelFile(model, file) {
        return new Promise((resolve) => {
            var id = this.randomid(10)
            var reader = new FileReader();
            reader.onload = e => {
                databaseUpload('files/' + model.modelid + id, e.target.result).then((url) => {
                    var fileObj = {
                        name: file.name,
                        link: url,
                        id: id
                    }
                    database.ref('models/' + model.modelid + '/files/' + id).set(fileObj).then(
                        resolve(fileObj)
                    )
                })
            };
            reader.readAsDataURL(file)
        })
    },

    newUser(userObj) {
        var password = this.randomid(10)
        userObj.password = password
        userObj.repeatPassword = password
        userObj.active = true
        return dbPost('/admin/createuser', userObj)
    },

    newProduct() {
        var id = this.randomid(10)
        return {
            color: 'Gold',
            iosmodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
            androidmodel: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
            comments: [],
            qacomments: [],
            id: id
        }
    },

    newModel(orderid, clientid, modelName) {
        var backend = this
        return new Promise(resolve => {
            var products = {}
            var prod = backend.newProduct()
            products[prod.id] = prod
            prod = backend.newProduct()
            prod.color = 'Black'
            products[prod.id] = prod
            var files = {}
            var id = backend.randomid(10)
            files[id] = {
                name: 'A file',
                link: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/models%2Fandroid%2F0.glb?alt=media&token=89b5e290-7299-4145-90e1-2e35f1f8fe01",
                id: id
            }
            var model = {
                thumbnail: "https://firebasestorage.googleapis.com/v0/b/mvk-charpstar.appspot.com/o/thumbnails%2F0.png?alt=media&token=5c84937b-e978-4ac8-a28e-1a3cfd88922f",
                files: files,
                comments: [],
                blendercomments: [],
                products: products,
                modelid: backend.randomid(32),
                orderid: orderid,
                clientid: clientid,
                name: modelName,
                status: Math.ceil(Math.random() * 14),
                assignedmodeler: false,
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
                complete: Math.ceil(Math.random() * 10),
                clientname: client.name,
                comments: [],
                assignedqa: false,
                status: Math.ceil(Math.random() * 14)
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

    deleteModelFile(modelid, fileid) {
        return databaseSet('models/' + modelid + '/files/' + fileid, null)
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
    },


}


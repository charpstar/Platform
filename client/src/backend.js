import Axios from 'axios'
Axios.defaults.withCredentials = true

const backend = 'http://46.101.115.253:8081'
var account = false

function dbPost(url, data) {
    var p = new Promise((resolve, reject) => {
        Axios.post(backend + url, data).then((res) => {
            if (res.data.error == '') {
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
            if (res.data.error == '') {
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

function dbUpload(url, file, filename, obj) {
    //eslint-disable-next-line no-console
    console.log(file)
    var formData = new FormData()
    formData.append(filename, file);
    for (var key in obj) {
        formData.append(key, obj[key])
    }
    var p = new Promise((resolve, reject) => {
        Axios.post(backend + url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => {
            if (res.data.error == '') {
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

function dbDownload(url, data) {
    var p = new Promise((resolve, reject) => {
        Axios.post(backend + url, data).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', data.filename); //or any other extension
            document.body.appendChild(link);
            link.click();
            resolve();
        }).catch(error => {
            reject(error)
        });
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

const StatusIcons = {
    OrderReceived: "",
    OrderReview: "",
    OrderMissing: "mdi-information",
    OrderDev: "",
    OrderDone: "mdi-check",
    ModelReceived: "",
    ModelDev: "",
    ModelMissing: "mdi-information",
    ModelReview: "",
    ModelRefine: "",
    ClientModelReceived: "mdi-image-search",
    ClientFeedback: "",
    ModelDone: "mdi-check",
    Pause: "",
    Error: ""
}

const Messages = {
    OrderReceived: "Order received",
    OrderReview: "Under development",
    OrderMissing: "Information missing",
    OrderDev: "Under development",
    OrderDone: "Complete",
    ModelReceived: "Model received",
    ModelDev: "Under development",
    ModelMissing: "Information missing",
    ModelReview: "QA Review",
    ModelRefine: "Redoing model",
    ClientModelReceived: "Client review",
    ClientFeedback: "Redoing model",
    ModelDone: "Complete",
    Pause: "Pause",
    Error: "Error"
}

const ClientMessages = {
    OrderReceived: "Order received",
    OrderReview: "Under development",
    OrderMissing: "Information missing",
    OrderDev: "Under development",
    OrderDone: "Complete",
    ModelReceived: "Model received",
    ModelDev: "Under development",
    ModelMissing: "Information missing",
    ModelReview: "Under development",
    ModelRefine: "Under development",
    ClientModelReceived: "Awaiting review",
    ClientFeedback: "Under development",
    ModelDone: "Complete",
    Pause: "Pause",
    Error: "Error"
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
        if (usertype == 'Client') {
            return ClientMessages[status]
        }
        return Messages[status]
    },

    iconFromStatus(status) {
        return StatusIcons[status]
    },

    randomid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    login(email, password) {
        var promise = dbPost('/login', { email: email, password: password })
        promise.then((data) => {
            account = data;
        })
        return promise
    },

    relogin() {
        var promise = dbGet('/gen/login')
        promise.then((data) => {
            account = data;
        })
        return promise
    },

    logout() {
        var promise = dbGet('/logout')
        promise.then(() => {
            account = false;
        })
        return promise
    },

    getUsers() {
        return dbGet('/admin/getusers')
    },

    getModelers() {
        return dbGet('/qa/getmodelers')
    },

    getOrders(clientid) {
        return dbPost('/gen/getclientorders', { id: clientid })
    },

    getAllOrders() {
        return dbGet('/qa/getorders')
    },

    getOrder(orderid) {
        return new Promise((resolve, reject) => {
            if (!account) {
                reject('Not logged in')
            } else if (account.usertype == 'Client') {
                this.getOrders(account.userid).then(data => {
                    resolve(data[orderid])
                })
            } else {
                this.getAllOrders().then(data => {
                    resolve(data[orderid])
                })
            }
        })
    },

    getComments(idobj) {
        return dbPost('/gen/getComments', idobj)
    },

    sendComment(comment) {
        return dbPost('/gen/comment', comment)
    },

    getModels(orderid) {
        return dbPost('/gen/getmodels', { orderid: orderid })
    },

    getAllModels() {
        return dbGet('/qa/getallmodels')
    },

    getModellerModels() {
        return dbGet('/modeller/models')
    },

    getModel(modelid) {
        return new Promise((resolve, reject) => {
            if (!account) {
                reject('Not logged in')
            } else if (account.usertype == 'Client') {
                this.getOrders(account.userid).then(orders => {
                    Object.keys(orders).forEach(orderid => {
                        this.getModels(orderid).then(models => {
                            if (models[modelid] != null) {
                                resolve(models[modelid])
                            }
                        })
                    });
                })

            } else if (account.usertype == 'Modeller') {
                this.getModellerModels().then(data => {
                    resolve(data[modelid])
                })
            } else {
                this.getAllModels().then(data => {
                    resolve(data[modelid])
                })
            }
        })
    },

    getProducts(modelid) {
        return dbPost('/gen/getproducts', { modelid: modelid })
    },

    uploadAndroidModel(product, file) {
        return dbUpload('/qa/uploadandroid', file, 'modelfile', {productid: product.productid})
    },

    uploadIosModel(product, file) {
        return dbUpload('/qa/uploadios', file, 'modelfile', {productid: product.productid})
    },

    uploadThumbnail(model, file) {
        return dbUpload('/qa/uploadthumb', file, 'thumb', {modelid: model.modelid})
    },

    uploadModelFile(model, file) {
        return dbUpload('/modeller/uploadmodelfile', file, 'modelfile', {modelid: model.modelid})
    },

    downloadModelFile(model, filename) {
        return dbDownload('/modeller/downloadmodelfile', {modelid: model.modelid, filename: filename})
    },

    getThumbURL(modelid) {
        return backend + '/public/thumbs/' + modelid
    },

    newUser(userObj) {
        var password = this.randomid(10)
        userObj.password = password
        userObj.repeatPassword = password
        userObj.active = true
        return dbPost('/admin/createuser', userObj)
    },

    //eslint-disable-next-line no-unused-vars
    newModel(orderid, modelName) {
        return new Promise((resolve, reject) => {
            reject('Unimplemented')
        })
    },

    createOrder(file) {
        return dbUpload('/client/createorder', file, 'orderdata')
    },

    assignQA(orderid) {
        return dbPost('/qa/claimorder', { id: orderid })
    },

    assignModeler(modelid, modeler) {
        return dbPost('/qa/assignmodeler', { modelid: modelid, modelerid: modeler.userid })
    },

    getModelFiles(modelid) {
        return dbPost('/modeller/listmodelfiles', { modelid: modelid })
    },

    //eslint-disable-next-line no-unused-vars
    deleteModelFile(modelid, fileid) {
        return new Promise(resolve => {
            resolve({});
        })
    },

    deleteUser(userid) {
        return dbPost('/admin/deleteuser', { userid: userid })
    },

    resetPassword(userid, password) {
        return dbPost('/admin/edituser', { userid: userid, password: password, repeatPassword: password })
    },

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    },
}


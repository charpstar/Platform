import Axios from 'axios'
Axios.defaults.withCredentials = true

const backend = 'http://46.101.115.253:8081'

function parseResponse(axios) {
    return new Promise((resolve, reject) => {
        axios.then((res) => {
            //eslint-disable-next-line no-console
            console.log(res.data)
            if (res.data.error == '') {
                resolve(res.data.data)
            } else {
                reject(res.data.error)
            }
        })
    })
}

function dbPost(url, data) {
    return parseResponse(Axios.post(backend + url, data))
}

function dbGet(url) {
    return parseResponse(Axios.get(backend + url))
}

function dbUpload(url, file, filename, data) {
    var formData = new FormData()
    formData.append(filename, file);
    for (var key in data) {
        formData.append(key, data[key])
    }
    var header = { headers: { 'Content-Type': 'multipart/form-data' } }
    return parseResponse(Axios.post(backend + url, formData, header))
}

function dbDownload(url, data) {
    var name = data.name;
    delete(data.name);
    return new Promise((resolve, reject) => {
        Axios.post(backend + url, data, {responseType: 'blob'}).then((response) => {
            //eslint-disable-next-line no-console
            console.log(response)
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            resolve();
        }).catch(error => {
            //eslint-disable-next-line no-console
            console.log(error)
            reject(error)
        });
    })
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

    //login

    login(email, password) {
        return dbPost('/login', { email: email, password: password })
    },

    relogin() {
        return dbGet('/gen/login')
    },

    logout() {
        return dbGet('/logout')
    },

    //users

    getUsers() {
        return dbGet('/admin/getusers')
    },

    getUser(userid) {
        return dbPost('/admin/getuser', { id: userid })
    },

    getModelers() {
        return dbGet('/qa/getmodelers')
    },

    newUser(userObj) {
        var password = this.randomid(10)
        userObj.password = password
        userObj.repeatPassword = password
        userObj.active = true
        return dbPost('/admin/createuser', userObj)
    },

    deleteUser(userid) {
        return dbPost('/admin/deleteuser', { userid: userid })
    },

    resetPassword(userid, password) {
        return dbPost('/admin/edituser', { userid: userid, password: password, repeatPassword: password })
    },

    //orders

    getOrders(clientid) {
        return dbPost('/gen/getclientorders', { id: clientid })
    },

    getAllOrders() {
        return dbGet('/qa/getorders')
    },

    getOrder(orderid) {
        return dbPost('/gen/getorder', { id: orderid })
    },

    createOrder(file) {
        return dbUpload('/client/createorder', file, 'orderdata')
    },

    assignQA(orderid) {
        return dbPost('/qa/claimorder', { id: orderid })
    },

    downloadExcel(orderid) {
        return dbDownload('/gen/getexcel', {id: orderid, name: '' + orderid + '.xlsx'})
    },

    //comments

    getComments(idobj) {
        return dbPost('/gen/getComments', idobj)
    },

    sendComment(comment) {
        return dbPost('/gen/comment', comment)
    },

    //models

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
        return dbPost('/gen/getmodel', { modelid: modelid })
    },

    uploadThumbnail(modelid, file) {
        return dbUpload('/qa/uploadthumb', file, 'thumb', { modelid: modelid })
    },

    getThumbURL(modelid) {
        return backend + '/public/thumbs/' + modelid
    },

    assignModeler(modelid, userid) {
        return dbPost('/qa/assignmodeler', { modelid: modelid, modelerid: userid })
    },

    getModelFiles(modelid) {
        return dbPost('/modeller/listmodelfiles', { modelid: modelid })
    },

    //eslint-disable-next-line no-unused-vars
    newModel(orderid, modelName) {
        return new Promise((resolve, reject) => {
            reject('Unimplemented')
        })
    },

    //products

    getProducts(modelid) {
        return dbPost('/gen/getproducts', { modelid: modelid })
    },

    uploadAndroidModel(product, file) {
        return dbUpload('/qa/uploadandroid', file, 'modelfile', { productid: product.productid })
    },

    uploadIosModel(product, file) {
        return dbUpload('/qa/uploadios', file, 'modelfile', { productid: product.productid })
    },

    uploadModelFile(modelid, file) {
        return dbUpload('/modeller/uploadmodelfile', file, 'modelfile', { modelid: modelid })
    },

    downloadModelFile(modelid, filename) {
        return dbDownload('/modeller/downloadmodelfile', { modelid: modelid, filename: filename, name: filename})
    },

    //eslint-disable-next-line no-unused-vars
    deleteModelFile(modelid, fileid) {
        return new Promise(resolve => {
            resolve({});
        })
    },
}


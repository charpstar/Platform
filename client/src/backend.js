import Axios from 'axios'
Axios.defaults.withCredentials = true

const backend = 'http://46.101.115.253:8081'

function parseResponse(axios) {
    return new Promise((resolve, reject) => {
        axios.then((res) => {
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
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            resolve();
        }).catch(error => {
            reject(error)
        });
    })
}

 //eslint-disable-next-line no-unused-vars
const Icons = {
    OrderInit: "",
    OrderReceived: "",
    OrderReview: "mdi-image-search",
    OrderClientReview: "mdi-image-search",
    OrderMissing: "mdi-information",
    OrderDev: "",

    ProductInit: "",
    ProductReceived: "",
    ProductDev: "",
    ProductMissing: "mdi-information",
    ProductQAMissing: "mdi-information",
    ProductReview: "mdi-image-search",
    ProductRefine: "",
    ClientProductReceived: "mdi-image-search",

    ClientFeedback: "",
    Done: "mdi-check",
    Pause: "",
    Error: ""
}

 //eslint-disable-next-line no-unused-vars
const ClientIcons = {
    OrderInit: "",
    OrderReceived: "",
    OrderReview: "",
    OrderClientReview: "mdi-image-search",
    OrderMissing: "mdi-information",
    OrderDev: "",

    ProductInit: "",
    ProductReceived: "",
    ProductDev: "",
    ProductMissing: "",
    ProductQAMissing: "mdi-information",
    ProductReview: "",
    ProductRefine: "",
    ClientProductReceived: "mdi-image-search",

    ClientFeedback: "",
    Done: "mdi-check",
    Pause: "",
    Error: ""
}

const Messages = {
    OrderInit: "Init state",
    OrderReceived: "Unassigned",
    OrderReview: "QA review",
    OrderClientReview: "Awaiting client feedback",
    OrderMissing: "Information missing",
    OrderDev: "Under development",

    ProductInit: "Init state",
    ProductReceived: "Unassigned",
    ProductDev: "Under development",
    ProductMissing: "Information missing",
    ProductQAMissing: "Client information missing",
    ProductReview: "QA review",
    ProductRefine: "Needs revision",
    ClientProductReceived: "Client review",

    ClientFeedback: "Incorporating client feedback",
    Done: "Complete",
    Pause: "Pause",
    Error: "Error"
}

const ClientMessages = {
    OrderInit: "Init state",
    OrderReceived: "Under review",
    OrderReview: "Under review",
    OrderClientReview: "Awaiting your feedback",
    OrderMissing: "Information missing",
    OrderDev: "Under development",

    ProductInit: "Init state",
    ProductReceived: "Under review",
    ProductDev: "Under development",
    ProductMissing: "Under development",
    ProductQAMissing: "Information missing",
    ProductReview: "Under development",
    ProductRefine: "Under development",
    ClientProductReceived: "Awaiting your feedback",

    ClientFeedback: "Incorporating your feedback",
    Done: "Complete",
    Pause: "Pause",
    Error: "Error"
}

/* Colors and ClientColors:
    Code to apply colors for different products states in bar graph and in lists 
    Commented code means the colors previously used for the bar chart */
const Colors = {
    OrderInit: "grey",
    OrderReceived: "#868686",
    OrderReview: "#4A754A",
    OrderClientReview: "#744885",
    OrderMissing: "#A33636",
    OrderDev: "#7FCB7F",

    ProductInit: "grey", //maybe different color?
    ProductReceived: "#868686",
    ProductDev: "#7FCB7F",
    ProductMissing: "#EC4E4E",
    ProductQAMissing: "#A33636",
    ProductReview: "#4A754A",
    ProductRefine: "#FFA500",
    ClientProductReceived: "#744885",
    ClientFeedback: "#1DA19A",
    Done: "#188038",
    Error: "E20000"
    // ProductReceived: "grey",
    // ProductDev: "#0e6ab5",
    // ProductMissing: "#c91463",
    // ProductQAMissing: "#ad239b",
    // ProductReview: "#1496c9",
    // ProductRefine: "#0e6ab5",
    // ClientProductReceived: "#37db4d",
    // ClientFeedback: "#0e6ab5",
    // Done: "green"

}

const ClientColors = {
    OrderInit: "grey",
    OrderReceived: "#FFA500",
    OrderReview: "#FFA500",
    OrderClientReview: "#744885",
    OrderMissing: "#EC4E4E",
    OrderDev: "#7FCB7F",

    ProductInit: "grey",
    ProductReceived: "#FFA500",
    ProductDev: "#7FCB7F",
    ProductMissing: "#7FCB7F",
    ProductQAMissing: "#EC4E4E",
    ProductReview: "#7FCB7F",
    ProductRefine: "#7FCB7F",
    ClientProductReceived: "#744885",
    ClientFeedback: "#1DA19A",
    Done: "#188038",
    Error: "E20000"
    // ProductReceived: "grey",
    // ProductDev: "#0e6ab5",
    // ProductMissing: "#0e6ab5",
    // ProductQAMissing: "#ad239b",
    // ProductReview: "#0e6ab5",
    // ProductRefine: "#0e6ab5",
    // ClientProductReceived: "#37db4d",
    // ClientFeedback: "#0e6ab5",
    // Done: "green"
}

export default {

    promiseHandler(fun) {
        var handler = {
            modal: false,
            loading: false,
            error: '',
            fun: fun
        }
        handler.execute = (data) => {
            handler.loading = true
            handler.fun(data).then(() => {
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
    colorFromAccount(status,  usertype) {
        if(usertype == 'Client') {
            return ClientColors[status]
        }
        return Colors[status]
    },
    
    /* backendState: get backend message from forntend message;
    used in Order and Model lists to apply correct color in 'status' column */
    backendState(status, usertype) {
        var message;
        var backendMessage;
        if (usertype == 'Client') {
            message = Object.entries(ClientMessages).find (
                m => m[1] == status
            )
            backendMessage = message[0]
            return backendMessage
        }
        else {
            message = Object.entries(Messages).find (
                m => m[1] == status
            )
            backendMessage = message[0]
            return backendMessage                
        }
    },

    //eslint-disable-next-line no-unused-vars
    iconFromStatus(status, usertype) {
        return ''
        /* if you want to enable icons, uncomment this
        if (usertype == 'Client') {
            return ClientIcons[status]
        }
        return Icons[status]
        */
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
        return dbGet('/qa/getusers')
    },

    getUser(userid) {
        return dbPost('/qa/getuser', { userid: userid })
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
        return dbPost('/gen/getclientorders', { userid: clientid })
    },

    getAllOrders() {
        return dbGet('/qa/getorders')
    },

    getOrder(orderid) {
        return dbPost('/gen/getorder', { orderid: orderid })
    },

    createOrder(file, userid) {
        return dbUpload('/client/createorder', file, 'orderdata', {userid: userid})
    },

    assignQA(orderid) {
        return dbPost('/qa/claimorder', { id: orderid })
    },

    adminAssignQA(orderid, userid) {
        return dbPost('/admin/assignorder', { orderid: orderid, userid: userid })
    },

    downloadExcel(orderid, filename) {
        return dbDownload('/gen/getexcel', {id: orderid, name: filename})
    },

    deleteOrder(orderid) {
        return dbPost('/qa/deleteorder', {orderid: orderid})
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

    getModellerModels(userid) {
        return dbPost('/modeller/models', {modelowner: userid})
    },

    getModel(modelid) {
        return dbPost('/gen/getmodel', { modelid: modelid })
    },

    uploadThumbnail(modelid, file) {
        return dbUpload('/qa/uploadthumb', file, 'thumb', { modelid: modelid})
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

    createModels(orderid, file) {
        return dbUpload('/client/newmodels', file, 'modeldata', { orderid: orderid })
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

    editProductLink(productid, link) {
        return dbPost('/client/editproductlink', {productid: productid, newlink: link})
    },

    deleteModelFile(modelid, filename) {
        return dbPost('/modeller/deletemodelfile', {modelid: modelid, filename: filename})
    },

    deleteProduct(productid) {
        return dbPost('/qa/deleteproduct', {productid: productid})
    },

    deleteModel(modelid) {
        return dbPost('/qa/deletemodel', {modelid: modelid})
    },

    editProductModelId(productid, modelid) {
        return dbPost('/qa/editproductmodelid', {productid: productid, newmodelid: modelid})
    },

    editModelName(modelid, name) {
        return dbPost('/qa/editmodelname', {name: name, modelid: modelid})
    },

    createProducts(modelid, file) {
        return dbUpload('/client/newproducts', file, 'productdata', { modelid: modelid })
    }
}


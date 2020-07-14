const http = require("http")
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io').listen(server)
const bodyparser = require("body-parser")
const sharedsession = require("express-socket.io-session")
const fs = require('fs')
const new_years_day = new Date(2020, 0, 1);

app.use(bodyparser.urlencoded({ extended: false }))
const session = require("express-session")({
    secret: "vunonsistemim",
    resave: false,
    saveUninitialized: false

})
app.use(session)
io.use(sharedsession(session, {
    autoSave: true

}))


app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))

app.get("/", function (request, response) {

    if (!request.session.kulad) {
        response.sendFile('./index.html', { root: __dirname })
    }
    else {
        response.sendFile('./chat.html', { root: __dirname })
    }


})

app.post("/chat", function (request, response) {


    if (request.body.kulad) {
        request.session.kulad = request.body.kulad

    }

    if (request.session.kulad) {
        response.sendFile('./chat.html', { root: __dirname })
    }
    else {

        response.sendFile('./index.html', { root: __dirname })
    }


})

// socket.io sahneye çıkıyor
io.on('connection', function (socket) {
    // burada input ve output kısmına bağlantı durumunu kontrol ediyor
    console.log("bir kullanıcı bağlandı " + socket.handshake.session.kulad)

    socket.on('mesajvar', function (msg) {
        // eğer açık kanaldan birisi mesajvar gönderirse bunu yakalıyorum
        io.emit('mesajvar', socket.handshake.session.kulad, msg)
        // yakakaladığımız bu mesajı bize bğalı olan bütün açık kanallara emit (yayılma) ediyoruz
        // birden fazla kullancıı varsa işte onlarda açıkta olan tüm kanallara bunu iletmiş oluruz
    })

    socket.on('disconnect', function () {

        console.log("Bir kullanıcı ayrıldı")

    })

    socket.on('konusmakaydet', function (konusmalar) {

        var bosluksil=konusmalar.trim()
        var parcalihali=bosluksil.split("*")
       /* burada dizi halinde
        sabri - merhaba
        sabri - araba
        sabri - pc
        */
       // burada hepsini string'e çeviriyorum
        var sonhal=parcalihali.join('\n')


        fs.writeFile("konusmalar.txt", sonhal, function (err) {
            if (err) throw err
            else console.log("KONUŞMAYI İNDİR")

        })

       

    })


})

server.listen(8000, function () {

    console.log("server başladı")
})



/*

app.get("/oturumac", function (request, response) {
   // response.writeHead(200, { 'Content-type': 'text/html; charset=utf8' })
    request.session.kullaniciadi = "sabri"
    request.session.yas = 90
    response.write("Oturum Oluşturuldu " + request.session.kullaniciadi)
    response.end();

})
app.get("/oturumbak", function (request, response) {

    if (request.session.kullaniciadi) {
        response.write("1. oturum var ")
    }
    else {
        response.write("1. oturum yok ")
    }

    if (request.session.yas) {
        response.write("2. oturum var ")


    }
    else {
        response.write("2. oturum yok ")

    }
    response.end();

})
app.get("/sil", function (request, response) {

    // request.session.destroy() // tümünü siler
    delete request.session.yas

    response.end()
})
*/



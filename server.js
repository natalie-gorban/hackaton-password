const exp = require('express')
const fs = require('fs')
const path = require('path')

const app = exp()

app.use('/', exp.static(__dirname +'/public'));
app.use(exp.json())
app.use(exp.urlencoded({ extended: false }))

const port = 3001
app.listen(port, () => console.log(`Listening on port ${port}\nOpen in a browser: http://localhost:${port}`))
;

const pathStorage = path.join(__dirname, 'register.json')
const registerHtml = path.join(__dirname, 'public/register.html')
app.get('/register', (req, res) => {
  console.log(`GET /register: ${JSON.stringify(req.body)}`)

  res.sendFile(registerHtml)
})
app.post('/register', (req, res) => {
  // req.params.item + req.params.amount
  console.log(`POST /register: ${JSON.stringify(req.body)}`)
  fs.readFile(registerHtml, 'utf-8', (err, content) => {
    if (err) throw err
    fs.readFile(pathStorage, 'utf-8', (err, data) => {
      let registrationData
      if (err || data === '') registrationData = {}
      else registrationData = JSON.parse(data)

      let message
      if (registrationData.hasOwnProperty(req.body.username)){
      message = 'Username already exists'

            }else{
                registrationData[req.body.username]=req.body
                // saving new registration
                let listToLocalStorage = JSON.stringify(registrationData)
                fs.writeFile(pathStorage, listToLocalStorage, (e) => {
                    if (e) throw e
                })
                message = 'Hello Your account is now created!'
                // res.redirect('/')
                // return
            }
            res.writeHead(200, {'Content-Type':'text/html'})
            updated_content = content.replace(/<div id='message'><\/div>/, `<div id="message">${message}</div>`)

            console.log(`message to user: ${message}`)

            res.end(updated_content)
        })
    })

})

const loginHtml = `${__dirname}/public/login.html`
app.get('/login', (req, res) => {
    console.log(`GET /login: ${JSON.stringify(req.body)}`)
    res.sendFile(loginHtml)
})
app.post('/login', (req, res) => {
    // req.params.item + req.params.amount

    console.log(`POST /login: ${JSON.stringify(req.body)}`)
    fs.readFile(loginHtml, 'utf-8', (err, content) => {
        if (err) throw err

        fs.readFile(pathStorage, 'utf-8', (err, data) => {
            let loginData
            if (err || data == "") loginData = {}
            else loginData = JSON.parse(data)

            let message
            if(loginData.hasOwnProperty(req.body.username)){
                if (loginData[req.body.username].password == req.body.password) {
                    message = `Hi ${req.body.username} welcome back again`
                    // res.redirect('/')
                    // return
                } else {
                    message = `The password for ${req.body.username} is incorrect`
                }

            }else{
                loginData[req.body.username]=req.body
                // saving new registration
                let listToLocalStorage = JSON.stringify(loginData)
                fs.writeFile(pathStorage, listToLocalStorage, (e) => {
                    if (e) throw e
                })
                message = `Username is not registered, provided: ${JSON.stringify(req.body)}`

            }
            res.writeHead(200, {'Content-Type':'text/html'})
            let updated_content = content.replace(/<div id='message'><\/div>/, `<div id='message'>${message}</div>`)

            console.log(`message to user: ${message}`)

            res.end(updated_content)
        })
    })

})



app.get('/passwordGenerator', (req, res) => {

    console.log(`GET /passwordGenerator: ${JSON.stringify(req.body)}`)
    fs.readFile(`${__dirname}/public/passwordGenerator.html`, 'utf-8', (err, content) => {
        if (err) throw err

        fs.readFile(pathStorage, 'utf-8', (err, data) => {
            let generatorData
            if (err || data == "") generatorData = {}
            else generatorData = JSON.parse(data)

            let message
            if(generatorData.hasOwnProperty(req.body.password)){
                message = `password is in generator data`

            }else{
                generatorData[req.body.password]=req.body
                // saving new registration
                let listToLocalStorage = JSON.stringify(generatorData)
                fs.writeFile(pathStorage, listToLocalStorage, (e) => {
                    if (e) throw e
                })
                message = 'password added to generator data'

            }
            res.writeHead(200, {'Content-Type':'text/html'})

            res.end(content)
        })
    })

})


app.get('/logout', (req, res) => {
    console.log("GET /logout: TBD")
    res.redirect('/login')
})


app.listen(3000)

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

//middleware uvik prije rute
app.use(express.json())
const zahtjevInfo = (req, res, next) => {
    console.log('Metoda:', req.method)
    console.log('Putanja:', req.path)
    console.log('Tijelo:', req.body)
    console.log('---')
    next()
  }
  
  app.use(zahtjevInfo)

let adrese = [
  {
    id: 1,
    imeprezime: 'Ivna Vuković',
    email: 'ivnavukovic@gmail.com'
  },
  {
    id: 2,
    imeprezime: 'Ilva Ilvanić',
    email: 'ilvailvanic@gmail.com'
  }
]
//rute
app.get('/', (req, res) => {
    res.send("<h1>Pozdrav od Express servera i nodemona </h1>")
})
app.get('/api/adrese', (req, res) => {
    res.json(adrese)
})

app.get('/api/adrese/:id', (req, res) => {
    const id = Number(req.params.id)
    const adresa = adrese.find(a => a.id === id)

    //ako je poruka undefined vraca false
    if(adresa){
        res.json(adresa)
    } else {
        res.status(404).end();
    }
})
app.delete('/api/adrese/:id', (req, res) => {
    const id = Number(req.params.id)
    adrese = adrese.filter(a => a.id !== id)

    res.status(204).end()
})
app.post('/api/adrese', (req, res) => {
    const maxId = adrese.length > 0 
    ? Math.max(...adrese.map(a => a.id))
    : 0

    const podatak = req.body
    if(!podatak.imeprezime){
        return res.status(400).json({
            error: "Nedostaje ime/prezime"
        })
    }
    if(!podatak.email){
        return res.status(400).json({
            error: "Nedostaje email"
        })
    }
    const adresa = {
        imeprezime: podatak.imeprezime,
        email: podatak.email,
        id: maxId + 1
    }
    adrese = adrese.concat(adresa)
    res.json(adresa)
})
app.put('/api/adrese/:id', (req, res) => {
    const id = Number(req.params.id)
    const podatak = req.body
    adrese = adrese.map(a => a.id !== id ? a : podatak)
    res.json(podatak)

})

const nepoznataRuta = (req, res) => {
    res.status(404).send({ error: 'nepostojeca ruta' })
  }
  
  app.use(nepoznataRuta)

const PORT = 3002
app.listen(PORT, () => {
console.log(`Posluzitelj je pokrenut na portu ${PORT}`);
})

const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const router = Router()

router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '..', 'books.json'), 'utf-8', (error, data) => {
    if(error) throw error
    const books = JSON.parse(data)
    res.status(200).json(books)
  })
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  
  fs.readFile(path.join(__dirname, '..', 'books.json'), 'utf-8', (error, data) => {
    if(error) throw error
    const books = JSON.parse(data)
    const result = books.find((e) => e.id == id)
    if(result) return res.status(200).json(result)
      res.status(404).json({success: false, message: 'Ma’lumot topilmadi '})
  })
  
})

router.post('/', (req, res) => {
  const {title, author} = req.body
  if(!title || !author) return res.status(400).json({success: false, message: 'Ma’lumotlarni qo’shishda title yoki author kiritilmagan.'})
    fs.readFile(path.join(__dirname, '..', 'books.json'), 'utf-8', (error, data) => {
    if(error) throw error
    const books = JSON.parse(data)
    
    const check = books.find((e) => e.title == title)
    if(check) return res.status(400).json({success: false, message: `Bu kitob bazada mavjud!`})
      
    const max_id = books.reduce((max, book) => {
      const book_id = Number(book.id)
      return Number.isFinite(book_id) ? Math.max(max, book_id) : max
    }, 0)
    
    const newBook = {id: max_id + 1, title, author}
    books.push(newBook)
    fs.writeFile(path.join(__dirname, '..', 'books.json'), JSON.stringify(books), (err) => {
      if (err) return res.status(500).json({success: false, message: `Server xatosi!`})
        res.status(201).json({success: true, message: `Kitob yaratildi`, book: newBook})  
    })
    
  })
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const {title, author} = req.body
  fs.readFile(path.join(__dirname, '..', 'books.json'), 'utf-8', (error, data) => {
    if(error) throw error
    const books = JSON.parse(data)
    const bookIndex = books.findIndex(book => book.id == id)
    console.log(bookIndex);
    if (bookIndex == -1) {
      return res.status(404).json({ message: 'Ma’lumot topilmadi' })
    }
    
    
    books[bookIndex] = {
      ...books[bookIndex],
      title: title || books[bookIndex].title,
      author: author || books[bookIndex].author
    }
    
    fs.writeFile(path.join(__dirname, '..', 'books.json'), JSON.stringify(books), (err) => {
      if (err) return res.status(500).json({success: false, message: `Server xatosi!`})
        res.status(201).json({book: books[bookIndex]})  
    })
    
  })
  
  
  
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  fs.readFile(path.join(__dirname, '..', 'books.json'), 'utf-8', (error, data) => {
    if(error) throw error
    const books = JSON.parse(data)
    const bookIndex = books.findIndex(book => book.id == id)   
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Ma’lumot topilmadi' })
    }
    
    books.splice(bookIndex, 1)
    fs.writeFile(path.join(__dirname, '..', 'books.json'), JSON.stringify(books), (err) => {
      if (err) return res.status(500).json({success: false, message: `Server xatosi!`})
        res.status(201).json({message: `Kitob o'chirildi`})  
    })   
    
  })
  
})

module.exports = router
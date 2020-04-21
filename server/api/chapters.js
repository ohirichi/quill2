const router = require('express').Router()
const {Chapter} = require('../../db/models')
module.exports = router

//get a chapter by id
router.get('/:id', (req, res, next) => {
    Chapter.findOne({where: {id: req.params.id}, include: [{all: true}]})
      .then(chapter => res.json(chapter))
      .catch(next)
  })
//get all chapters for a story id
//update a chapter by id
router.put('/:id', (req, res, next) => {
    Chapter.findOne({where: {id: req.params.id}})
      .then(chapter => chapter.update(req.body))
      .then(chapter => res.json(chapter))
      .catch(next)
  })
//create a chapter

router.post('/', (req, res, next) => {
    Chapter.create(req.body)
      .then(chapter => Chapter.findOne({where: {id: chapter.id}, include:[{all:true}]}))
      .then(chapter => res.json(chapter))
      .catch(next)
  })
//delete a chapter
router.delete('/:id', (req, res, next) => {
    Chapter.destroy({ where: {id: req.params.id}})
      .then(() => res.sendStatus(204))
      .catch(next)
  })
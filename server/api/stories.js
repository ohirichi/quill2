const router = require('express').Router()
const {Story, Chapter} = require('../../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  Story.findAll({
    where: {public: true},
    include: [{all: true}]
  })
    .then(stories => res.json(stories))
    .catch(next)
})

router.get('/author/:userId', (req,res,next) =>{
  Story.findAll({
    where:{userId:req.params.userId},
    include: [{all: true}]
  })
  .then(stories => res.json(stories))
  .catch(next)
})

router.post('/', (req, res, next) => {
  Story.create(req.body)
    .then(story => Story.findOne({where: {id: story.id}, include:[{all:true}]}))
    .then(story => res.json(story))
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  Story.findOne({where: {id: req.params.id}, include: [{all: true}]})
    .then(story => res.json(story))
    .catch(next)
})

router.get('/:id/chapters', (req, res, next) => {
  Chapter.findAll({where: {storyId: req.params.id}, include: [{all: true}], order:[['createdAt', 'ASC']]})
    .then(chapters => res.json(chapters))
    .catch(next)
})

router.get('/:id/chapters/:chapterNum', (req, res, next) => {
  Chapter.findAll({where: {storyId: req.params.id}, include: [{all: true}], order:[['createdAt', 'ASC']]})
    .then(chapters => res.json(chapters[req.params.chapterNum]))
    .catch(next)
})

router.put('/:id', (req, res, next) => {
  Story.findOne({where: {id: req.params.id}})
    .then(story => story.update(req.body))
    .then(story => res.json(story))
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
  Chapter.destroy({where:{ storyId: req.params.id}})
  .then( ()=> {
    Story.destroy({ where: {id: req.params.id}})
  })
  .then(() => res.sendStatus(204))
  .catch(next)
})
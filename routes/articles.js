const Articles = require('../models/Articles');
const { verifyAdmin } = require('../utils/Verifytoken');
const router = require('express').Router()

// ADD ARTCLES
router.post('/add',verifyAdmin, async (req, res, next) => {

    try {
        const articles = await Articles(req.body)
        const save = await articles.save()
        res.status(200).json(save)
        console.log(res)
    } catch (err) {
        next(err);
        console.log(err);
    }

})

// GET ARTCLES
router.get('/get', async (req, res, next) => {
    try {
        const articles = await Articles.find()
        res.status(200).json(articles)
    } catch (err) {
        console.log(err)
        next(err)
    }
})
// GET ARTCLES BY ID
router.get('/get/:id', async (req, res, next) => {
    try {
        const articles = await Articles.findById(req.params.id)
        res.status(200).json(articles)
    } catch (err) {
        console.log(err)
        next(err)
    }
})

// DELETE ARTICLE
router.delete('/delete/:id',verifyAdmin, async(req, res, next) =>{
    try {
        await Articles.findByIdAndDelete(req.params.id)
        res.status(200).json('article deleted')
    } catch (err) {
        console.log(err)
        next(err)
    }
})

module.exports = router;
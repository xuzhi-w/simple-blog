const express = require('express')
const router = express.Router()
const Article = require('./../models/article')
const slugify = require('slugify')
const multer = require('multer');

// Multer setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/uploads/') // specify the directory where files will be uploaded
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname); // use the original filename
    }
  });


const upload = multer({ storage: storage });


router.get('/new',(req,res)=>{
    res.render('articles/new',{article: new Article()})
})

router.get('/edit/:id', upload.single('image'),async (req,res)=>{
    console.log(req.params.id)
    const article = await Article.findById(req.params.id)
    console.log(article)
    res.render('articles/edit',{article: article})
})

router.get('/:slug',async (req,res)=>{
    const article = await Article.findOne({ slug:req.params.slug})
    if(article == null) res.redirect('/')
    res.render('articles/show',{article:article})
})
router.post('/', upload.single('image'),async (req,res,next)=>{
    req.article = new Article()
    next()
},saveArticleAndRedirect('new'))

router.put('/:id',async (req,res,next)=>{
    req.article = await Article.findById(req.params.id)
    next()
},saveArticleAndRedirect('edit'))

router.delete('/:id', async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path){
    return async (req,res)=>{
        let article = req.article
        article.title = req.body.title,
        article.image = req.body.image,
        article.description = req.body.description,
        article.markdown = req.body.markdown
        try{
            console.log(article)
            article = await article.save();
            res.redirect(`/articles/${article.slug}`)
        }catch(e){
            console.log("hello:" + e)
            res.render(`articles/${path}`,{article:article})
        }
    } 
}

module.exports = router
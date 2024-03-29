const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const {JSDOM} = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    markdown:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    visitedCount:{
        type: String,
        default: 0
    },
    image:{
        type: String,
        default: ''
    },
    sanitizedHtml:{
        type:String,
        requried:true
    }
})
articleSchema.pre('validate',function(next){
    if(this.title){
        this.slug = slugify(this.title,{lower: true,strict: true})
    }
    next()
    if(this.markdown){
        // const html = marked(this.markdown)
        this.sanitizedHtml = dompurify.sanitize(this.markdown) 
    }
})
module.exports = mongoose.model('Article',articleSchema)
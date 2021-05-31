const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const mongoose = require("mongoose")
const profile = require("./db/profile")
const jobs = require("./db/job")
const jobControl = require("./controllers/jobControl")
const profileControl = require("./controllers/profileControl")
const {timeRemaining} = require("./helper/func")   
mongoose.connect("mongodb://localhost/jobcalc", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

var hbs = handlebars.create({

    helpers:{
        checkFreeHours: (hours) => {
            if(hours < 0){
                return `Você não tem horas livres no seu dia. Seu objetivo já foi passado em ${Math.abs(hours)} horas.`
            }if(hours == 0){
                return `Você não tem horas livres no seu dia.`
            }
            else{
                return `Você tem ${hours} horas livres no seu dia.`
            }
        }
        
    },
    defaultLayout:false
})


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")





app.get("/", (req, res) => {
    let jobStatus = {
        progress: 0,
        done: 0
    }   
    let jobsHours = 0 
    profile.findOne({id: 1}).lean().then((Profile) => {
        jobs.find({}).lean().then(Jobs => {

            for(job of Jobs){
                
                const createdAt = +job.createdAt  //DIA DE CRIACAO DO JOB
                const dayMS = 86400000 //1 DIA EM MILISEGUNDOS (MS)
                const totalDaysMS = (job.totalHours / job.dailyHours) * dayMS // TOTAL DE DIAS DO JOB EM MS
                const nowMS = +new Date() //DATA DE AGORA EM MS 
                const dueDay = totalDaysMS + createdAt //O DIA QUE O JOB DEVE SER FINALIZADO EM MS
                const pendingDays = (Math.round((dueDay - nowMS) / dayMS)) //CONVERTE DE MS PARA DIAS 
                jobsHours += job.dailyHours // SOMA AS HORAS POR DIA DE TODOS JOBS               
                job.daysToEnd = pendingDays
                
                if((dueDay - nowMS) <= 0){
                    
                    isDone = true
                    jobStatus.done++
                }else{
                    isDone = false
                    jobStatus.progress++
                }

                job.done = isDone
                
            }
            
            
            const freeHours = Profile.hourDay - jobsHours 
            const totaljobs = Jobs.length
            
            res.render("index", {Jobs, Profile, totaljobs, freeHours, jobStatus})
        })
    })    
})

app.get("/profile", profileControl.showProfile)

app.post("/profile", profileControl.editProfile)

app.get("/job", (req, res) => res.render("Job"))

app.post("/job", jobControl.createJob)

app.get("/job-edit/:id", jobControl.editJob)

app.post("/job-edit/", jobControl.sendEditJob)

app.post("/job/delete/:id", jobControl.deleteJob)

app.get("/tenta", (req, res) => {
    let test = {
        res: []
    }
    profile.find({id: 1}).then((Profile) => {
        jobs.find({}).then((Jobs) => {
            for(job of Jobs){
                test.res.push = timeRemaining(job, Profile)
            }
            res.render("index", {Profile, Jobs})
        })
    })
    console.log(test)
})


app.get("/joob", (req, res) => {
    jobs.find({}).lean().then(Jobs => {
        for(job of Jobs){
            console.log("Job => ", job)
            console.log("")
        }
    })
})

app.listen(8081, console.log("RODANDO...")) 
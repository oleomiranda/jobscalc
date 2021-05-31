const jobs = require("../db/job")
const profile = require("../db/profile")
module.exports = {
    
    createJob: (req, res) => {
                profile.findOne({id: 1}).then((Profile) => { 
                    const {name, totalHours, dailyHours} = req.body
                    const daysToEnd = totalHours / dailyHours
                    const jobBudget = Profile.monthGoal / (Profile.hourDay * Profile.daysWeek * 4)
                    jobs.create({
                        name: name,
                        totalHours: totalHours,
                        dailyHours: dailyHours,
                        daysToEnd: daysToEnd,
                        price: jobBudget
                    }).then(() => { 
                        res.redirect("/")
                    }).catch((err) => {
                        console.log(err)
                        res.redirect("/job")
                    })
            })
    },

    editJob: (req, res) => {
                jobs.findById(req.params.id).lean().then((job) => {
                    profile.findOne({id: 1}).lean().then((Profile) => {
                        const hourPrice = Profile.monthGoal / (Profile.daysWeek * Profile.hourDay * 4)
                        const jobBudget = hourPrice * job.totalHours
                        res.render("job-edit", {job, jobBudget})
                    })
                })
                
    },

    sendEditJob: (req, res) => {
                    jobs.findById(req.body.id).then((Job) => {
                        profile.findOne({id: 1}).then((Profile) => {
                            //console.log(Profile)
                            const {dailyHours, totalHours, name} = req.body
                            const jobBudget = totalHours * (Profile.monthGoal / (Profile.daysWeek * Profile.hourDay * 4))
                            const daysToEnd = Math.round(totalHours / dailyHours)
                             
                            Job.name  = name,
                            Job.dailyHours = dailyHours,
                            Job.totalHours = totalHours,
                            Job.daysToEnd = daysToEnd,
                            Job.price = jobBudget

                            Job.save().then(() => res.redirect("/"))
                        })
                    })
    },

    deleteJob: (req, res) => {
                    jobs.findByIdAndRemove(req.params.id).then(() => {
                        res.redirect("/")
                    }).catch((err) => {
                        res.redirect("/")
                        console.log(err)
                    })
    }
}
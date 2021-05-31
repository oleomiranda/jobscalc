const profile = require("../db/profile")
const jobs = require("../db/job")

module.exports = {
    showProfile: (req, res) => {
                    profile.findOne({id: 1}).lean().then((Profile) => {
                        
                        const hourPrice = Profile.monthGoal / (Profile.daysWeek * Profile.hourDay * 4)
                        res.render("profile", {Profile, hourPrice})
                    })

        },
    editProfile: (req, res) => {
                    profile.findOne({id: 1}).then((Profile) => {
                        const {name, avatar, monthlyGoal, hoursPerDay, daysPerWeek, vacationPerYear } = req.body

                        Profile.name = name,
                        Profile.avatar = avatar,
                        Profile.monthGoal = monthlyGoal,
                        Profile.hourDay = hoursPerDay,
                        Profile.daysWeek = daysPerWeek,
                        Profile.vacation = vacationPerYear

                        jobs.find({}).then((Jobs) => {
                            for(job of Jobs){
                                const jobBudget = job.totalHours * (monthlyGoal / (hoursPerDay * daysPerWeek * 4))
                                job.price = jobBudget
                                job.save()
                            }
                        })

                        Profile.save().then(() => {
                            res.redirect("/profile")
                        }).catch((err) => {
                            res.redirect("/")
                        })

                    })
        }
}
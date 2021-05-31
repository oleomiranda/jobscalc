let jobsHours = 0
module.exports = { 
    timeRemaining: (job, Profile) => {
        let jobStatus = {
            progress: 0,
            done: 0
        }  
        const createdAt = +job.createdAt  //DIA DE CRIACAO DO JOB
        const dayMS = 86400000 //1 DIA EM MILISEGUNDOS (MS)
        const totalDaysMS = (job.totalHours / job.dailyHours) * dayMS // TOTAL DE DIAS DO JOB EM MS
        const nowMS = +new Date() //DATA DE AGORA EM MS 
        const dueDay = totalDaysMS + createdAt //O DIA QUE O JOB DEVE SER FINALIZADO EM MS
        const pendingDays = (Math.round((dueDay - nowMS) / dayMS)) //CONVERTE DE MS PARA DIAS 
        const hourPrice = Profile.monthGoal / (Profile.daysWeek * Profile.hourDay * 4) //O VALOR DA SUA HORA 
        const jobBudget = hourPrice * job.totalHours //SOMA QUANTO VAI CUSTAR O JOB 
        jobsHours += job.dailyHours // SOMA AS HORAS POR DIA DE TODOS JOBS               
        job.daysToEnd = pendingDays
        console.log("Job price => ", job.price)
        
        if((dueDay - nowMS) <= 0){
            isDone = true
            jobStatus.done++
        }else{
            isDone = false
            jobStatus.progress++
                }

        job.daysToEnd = pendingDays,
        job.price = jobBudget,
        job.done = isDone
                
        job.save()
            
}}
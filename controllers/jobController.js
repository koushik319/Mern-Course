import { nanoid } from "nanoid";
import Job from '../models/JobModel.js'
import mongoose from "mongoose";
import {StatusCodes} from 'http-status-codes'
import { NotFoundError } from "../errors/customError.js";
import day from 'dayjs';

// let  jobs = [
    
//    { id: nanoid() , company :'JP Morgan', role:'Font-end'},
//    { id: nanoid() , company: 'Accenture', role : 'Back-end' }
 
//          ];
    
// GET ALL JOBS 

export const getAllJobs = async (req,res)=>{
   
    const {search, jobStatus, jobType, sort} = req.query;
    console.log(search);

    const queryObject ={
        createdBy : req.user.userId,
    }

    if(search){
        queryObject.$or =  [
            {
                role: {$regex: search, $options: 'i'},
                company: {$regex: search, $options: 'i'},
            }
        ];
    }

    if(jobStatus && jobStatus !== 'all'){
        queryObject.jobStatus = jobStatus;
    }

    if(jobType && jobType !== 'all'){
        queryObject.jobType = jobType;
    }


    const sortOptions = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'a-z': 'role',
        'z-a': '-role',

    }

    const sortKey = sortOptions[sort] || sortOptions.newest ;


    // Setup Pagination 

    const page = Number(req.query.page) || 1 ;
    const limit = Number(req.query.limit) || 10 ;
    const skip = (page - 1) * limit ;

    //console.log(req.query);
    const jobs =  await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit);

    const totalJobs = await Job.countDocuments(queryObject);

    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(StatusCodes.OK).json({totalJobs, numOfPages, currentPage:page, jobs}); 
    }

// CREATE JOB

export const createJob = async (req,res)=>{
    //const {company , role} = req.body;
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body );
    res.status(StatusCodes.CREATED).json({job});
    }

// GET SINGLE JOB 

export const getJob = async (req,res)=>{
   
    const job = await Job.findById(req.params.id);

   

    res.status(StatusCodes.OK).json({job});
}

// EDIT / UPDATE JOB 

export const updateJob = async (req,res)=>{

    
    const updatedJob = await Job.findByIdAndUpdate(req.params.id,req.body,{
        new:true
    });
  

    res.status(StatusCodes.OK).json({msg:'Job Modified', job: updateJob});
}

// DELETE JOB 

export const deleteJob = async (req,res)=>{


    const removedJob = await Job.findByIdAndDelete(req.params.id);
  
    res.status(StatusCodes.OK).json({msg:'Job Deleted', job: removedJob});
}

export const showStats= async (req,res)=>{

    let stats = await Job.aggregate([
        {$match :{createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
        {$group :{_id:'$jobStatus',count:{ $sum : 1 }}},
    ]);
    

    stats = stats.reduce((acc,curr)=>{
        const {_id:title,count}= curr
        acc[title] = count
        return acc;
    },{})
    console.log(stats);

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0 , 
    }

    let monthlyApplications = await Job.aggregate([
        {$match :{createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
        {$group:{
            _id:{year:{$year:'$createdAt'},
            month:{$month:'$createdAt'} },

            count:{$sum:1},
        },
    },
    {$sort:{'_id.year':-1, '_id.month':-1}},
    {$limit: 6},
]);

monthlyApplications = monthlyApplications.map((item)=>{
    const {_id:{year,month},count}= item
    
    const date = day().month(month-1).year(year).format('MMM YY')
    
    return {date,count};
}).reverse();


//     let monthlyApplications = [
//         {
//             date: 'May 23',
//             count: 12,
//         },
//         {
//             date: 'June 23',
//             count: 9,
//         },
//         {
//             date: 'July 23',
//             count: 3,
//         },
// ]

    res.status(StatusCodes.OK).json({defaultStats,monthlyApplications});
}
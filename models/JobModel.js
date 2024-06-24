import mongoose from "mongoose";
import { JOB_STATUS , JOB_TYPE } from "../utils/constants.js";
const JobSchema = mongoose.Schema({
    company:'String',
    role:'String',
    jobStatus:{
        type:'String',
        enum:Object.values(JOB_STATUS),
        default:Object.PENDING,
    },
    jobType:{
        type:'String',
        enum:Object.values(JOB_TYPE),
        default:Object.FULLTIME,
    },

    jobLocation :{
        type:'String',
        default:"Hyderabad",
    },

    createdBy :{
        type:mongoose.Types.ObjectId,
        ref:'User',
    }

},
{timestamps: true})


export default mongoose.model('Job',JobSchema);
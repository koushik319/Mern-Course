import {body,param, validationResult} from 'express-validator';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/customError.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import Job from '../models/JobModel.js'
import User from '../models/UserModel.js'

const withValidationErrors = (validateValues)=>{
    return [
        validateValues,
        (req,res,next)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
            const errorMessages= errors.array().map((error)=> error.msg);
            if(errorMessages[0].startsWith('no job')){
                throw new NotFoundError(errorMessages);
            }
               if(errorMessages[0].startsWith('Not Authorized')){
                  throw new UnauthorizedError('Not authorized to access this route')
               }
                throw new BadRequestError(errorMessages);

            }
            next();
        },
    ];
};

export const validateJobInput = withValidationErrors([
    body('company').notEmpty().withMessage('Company is required '),
    body('role').notEmpty().withMessage('Role is required'),
    body('jobLocation').notEmpty().withMessage('job location is required'),
    body('jobStatus').isIn(Object.values(JOB_STATUS)).withMessage('Invalid Status value '),
    body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('Invalid Type Value')

])


export const validateIdParams = withValidationErrors([
    param('id')
    .custom(async (value,{req})=>
    {
        const validId =    mongoose.Types.ObjectId.isValid(value)


        if(!validId) throw new BadRequestError('invalid MongoDB id')

        
        const job = await Job.findById(value);

         if(!job) throw new NotFoundError(`no job with ${value} given`);

         const isAdmin = req.user.users === 'admin'
         const isOwner = req.user.userId === job.createdBy.toString()
         if(!isAdmin && !isOwner) throw new UnauthorizedError('Not authorized to access this route')
    }
)
  
])

export const validateRegisterInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required'),
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('Invalid Email format')
    .custom(async(email)=>{
        const user = await User.findOne({email});
        if(user){
            throw new BadRequestError('email already exists');
        }
    }),
    body('password').notEmpty().withMessage('password is required').isLength({min: 8}).withMessage('Password must be atleast 8 characters length'),
    body('location').notEmpty().withMessage('Location is required'),
    body('lastName').notEmpty().withMessage('lastname is required')
])


export const validateLoginInput = withValidationErrors([
  
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('Invalid Email format'),
    body('password').notEmpty().withMessage('password is required'),
  
])


export const validateUpdateUserInput = withValidationErrors([

    body('name').notEmpty().withMessage('name is required'),
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('Invalid Email format')
    .custom(async(email,{ req })=>{
        const user = await User.findOne({email});
        if(user && user._id.toString() !== req.user.userId){
            throw new BadRequestError('email already exists');
        }
    }),
    body('location').notEmpty().withMessage('Location is required'),
    body('lastName').notEmpty().withMessage('lastname is required')

])
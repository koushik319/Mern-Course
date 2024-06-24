import { UnauthenticatedError, UnauthorizedError, BadRequestError } from "../errors/customError.js"
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req,res,next)=>{
    const { token } = req.cookies
    if(!token) throw new UnauthenticatedError('Authentication Invalid');
 
    try {
        const {userId, users} = verifyJWT(token)
        const testUser = userId === '6660047371ec686360e384bc';
        req.user = {userId, users,testUser };
        next();

    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid');
 
    }

   
}

export const authorizePermissions = (...users)=>{
    
    return(req,res,next)=>{
        console.log(users);
        if(!users.includes(req.user.users)){
            throw new UnauthorizedError('Unauthorized to access this role')
        }
        next();
    }
  
};

export const checkForTestUser = (req,res,next)=>{
    if(req.user.testUser) throw new BadRequestError('Demo User. Read Only!');
    next();
}
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { redirect } from "react-router-dom";

export const action = async ({params})=>{
        try {
            await customFetch.delete(`/jobs/${params.id}`)
            toast.success("Job Deleted Successfully");
        } catch (error) {
            toast.error(error?.response?.data?.msg);
        }
        return redirect('/dashboardLayout/all-jobs')
}

const DeleteJob =()=>{
    return(
        <div>
            <h1>DeleteJob</h1>
        </div>
    )
}

export default DeleteJob;
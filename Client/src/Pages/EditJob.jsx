import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData, useParams } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';


export const loader= async ({params})=>{
    console.log(params);
 
    try {
        const {data} = await customFetch.get(`/jobs/${params.id}`)
        return data
    } catch (error) {
        toast.error(error?.response?.data?.msg)
        return redirect('/dashboardLayout/all-jobs');
    }
}

export const action= async ({request,params})=>{
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
        await customFetch.patch(`/jobs/${params.id}`,data);
        toast.success("Job Edited Successfully");
        return redirect('/dashboardLayout/all-jobs')

    } catch (error) {
        toast.error(error?.response?.data?.msg)
        return error
    }
   
}

const EditJob=()=>{
    // const params = useParams();
    // console.log(params);
    const {job} = useLoaderData();
    // const navigation = useNavigation();
    // const isSubmitting = navigation.state === 'Submitting'
    // //console.log(job);
    return(
        <Wrapper>
            <Form method='post' className='form'>
                <h4 className='form-title'> Edit Job</h4>
                <div className="form-center">
                    <FormRow type="text" name="role" defaultValue={job.role} />
                    <FormRow type="text" name="company" defaultValue={job.company}/>
                    <FormRow type="text" name="jobLocation"labelText='jobLocation' defaultValue={job.jobLocation}/>
                    <FormRowSelect name='jobStatus' labelText='job status' defaultValue={job.jobStatus} list={Object.values(JOB_STATUS)}/>
                    <FormRowSelect name='jobType' labelText='job type' defaultValue={job.jobType} list={Object.values(JOB_TYPE)}/>
               {/* <button type='submit' className='btn btn-block form-btn' disabled={isSubmitting}>

                {isSubmitting?'Submitting...':'Submit'}
    </button> */}

                    <SubmitBtn formBtn/>

                </div>
            </Form>
        </Wrapper>
    )
}

export default EditJob;
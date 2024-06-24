import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {HomeLayout,Login,DashboardLayout,Register,Error,Landing,AddJob,Stats,Profile,AllJobs,Admin,EditJob} from './Pages';
import {action as registerAction} from './Pages/Register.jsx';
import {action as loginAction} from './Pages/Login.jsx';
import {loader as dashboardLoader} from './Pages/DashboardLayout.jsx';
import {action as addJobAction} from './Pages/AddJob.jsx';
import {loader as allJobsLoader} from './Pages/AllJobs.jsx'
import {loader as editJobLoader} from './Pages/EditJob.jsx'
import {action as editJobAction} from './Pages/EditJob.jsx'
import {action as deleteJobAction} from './Pages/DeleteJob.jsx'
import {loader as adminLoader} from './Pages/Admin.jsx'
import {action as profileAction} from './Pages/Profile.jsx'
import {loader as statsLoader} from './Pages/Stats.jsx'
export const checkDefaultTheme = () => {
  const isDarkTheme =
    localStorage.getItem('darkTheme') === 'true'
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};

checkDefaultTheme();


 const router= createBrowserRouter([
  {
    path:'/',
    element: <HomeLayout/>,
    errorElement:<Error/>,
    children:[
      {
        index: true,
        element:<Landing/>
      },
      {
        path:'login',
        element:<Login/>,
        action: loginAction,
      },
      {
        path:'register',
        element:<Register/>,
        action: registerAction,
      },
      {
        path:'dashboardLayout',
        element:<DashboardLayout/>,
        loader:dashboardLoader,
        children:[
          {
            index: AddJob,
            element: <AddJob/>,
            action: addJobAction,
          },
          {
            path: 'stats',
            element: <Stats/>,
            loader : statsLoader,
          },
          {
            path: 'profile',
            element: <Profile/>,
            action: profileAction,
          },
          {
            path: 'all-jobs',
            element: <AllJobs/>,
            loader: allJobsLoader,
          },
          {
            path: 'admin',
            element: <Admin/>,
            loader : adminLoader , 
          },
          {
            path:'edit-job/:id',
            element: <EditJob/>,
            loader: editJobLoader,
            action: editJobAction,
          },
          {
            path:'delete-job/:id',
            action:deleteJobAction,
          },
        ]
      },
    ]
  },
  {
    path:'/error',
    element:<Error/>,
  }
]);

const App= ()=>{
    return(
      <div> 
      
       <RouterProvider router={router}/>
      </div>
     
    )
}

export default App;
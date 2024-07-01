import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
import ErrorElement from "./components/ErrorElement.jsx";

export const checkDefaultTheme = () => {
  const isDarkTheme =
    localStorage.getItem('darkTheme') === 'true'
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};

checkDefaultTheme();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

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
            loader : statsLoader(queryClient),
            errorElement : <ErrorElement/>,
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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
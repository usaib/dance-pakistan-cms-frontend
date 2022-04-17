import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import Documentary from "./pages/Documentary";
import Podcast from "./pages/Podcast";

const routes = [
	{
		path: "/",
		element: <Login />
	},
	{
		path: "app/dashboard",
		element: <DashboardLayout />,
		children: [
			{ path: "documentries", element: <Documentary /> },
			{ path: "podcasts", element: <Podcast /> }
		]
	}
];

export default routes;

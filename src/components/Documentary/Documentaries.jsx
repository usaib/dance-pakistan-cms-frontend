import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Box, Container, makeStyles, Chip } from "@material-ui/core";
import Table from "../table/Table";
import { getDocumentry, remove } from "../../services/documentry";

import AuthContext from "../../context/AuthContext";
import moment from "moment";
import DocumentaryForm from "./DocumentaryForm";
import Toolbar from "./DocumentaryToolbar";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.default,
		minHeight: "100%",
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2)
	}
}));
const headers = [
	{
		label: "ID",
		value: "id",
		type: "numeric",
		filterKey: "id",
		filterType: "text"
	},
	{ label: "Title", value: "title", filterKey: "title", filterType: "select" },
	{ label: "Description", value: "description" },
	{ label: "Video Id", value: "videoId" },
	{ label: "Image Url", value: "imageUrl" }
];
let vendorHeaders = headers.filter((e) => {
	return (
		e.value != "vendor" && e.value != "brand" && e.value != "shipmentStatus"
	);
});

const daysLeft = (vendor, orderDate) => {
	let tot = localStorage.getItem(`${vendor}` + "tot");
	let arrivalDate = moment(orderDate).add(tot, "days");
	let daysLeft = arrivalDate.diff(new Date(), "days");

	if (daysLeft >= 0) {
		return [daysLeft, 1];
	} else {
		return [daysLeft, 0];
	}
};

const checkStatusIsDelayed = (status) => {
	if (status == "Delayed") {
		return true;
	} else {
		return false;
	}
};
const checkStatusToShowDaysLeft = (status) => {
	if (status == "Delayed" || status == "Pending") {
		return true;
	} else {
		return false;
	}
};
function Documentaries() {
	const classes = useStyles();
	const authContext = useContext(AuthContext);
	const [documentaryForm, setDocumentaryForm] = useState();
	const [isDocumentaryFormVisible, setDocumentaryFormVisible] = useState(false);
	const [orderId, setOrderId] = useState("");

	const fetchDocumentry = async (params) => {
		const resp = await getDocumentry(params);
		const Documentry = resp.data.data.data.rows;
		let selectOptions = [];
		Documentry.forEach((obj) => {
			selectOptions.push(obj.id.toString());
		});
		const transfromedData = Documentry.map((data) => {
			let obj = {
				...data,
				balanced: data.quantity - data.consumed
			};
			return obj;
		});

		return {
			data: transfromedData,
			options: selectOptions,
			total: resp.data.data.data.count,
			count: resp.data.data.data.count
		};
	};

	const fetchDocumentariesCount = async (params) => {};

	const getHeaders = (role) => {
		if (role == "vendor") {
			return vendorHeaders;
		} else {
			return headers;
		}
	};
	const getOmsOptions = (role) => {
		return ["Dispense In", "Dispense Out"];
	};
	const getOmsOptionsColours = (role) => {
		return [{ key: "Dispense Out", value: "pending", color: "#0381d1" }];
	};

	const tableProps = {
		headers: getHeaders(authContext.role),
		getData: fetchDocumentry,

		dateFilters: true,
		omsOptions: getOmsOptions(authContext.role),
		omsOptionsWithColours: getOmsOptionsColours(authContext.role),
		getDocumentariesCount: fetchDocumentariesCount,
		onDetails: (details) => {
			setDocumentaryForm(true);
		},
		onEdit: (documentaryObj) => {
			setDocumentaryForm(documentaryObj);
			setDocumentaryFormVisible(true);
		},
		onDelete: remove
	};

	return (
		<div>
			<Helmet>
				<title>Dance Pakistan CMS | Dashboard</title>
			</Helmet>
			{isDocumentaryFormVisible ? (
				<DocumentaryForm
					orderId={orderId}
					Documentary={documentaryForm}
					documentaryHandler={setDocumentaryForm}
					documentaryFormHandler={setDocumentaryFormVisible}
				/>
			) : (
				<Box className={classes.root}>
					<Container maxWidth={false}>
						<Toolbar documentaryFormHandler={setDocumentaryFormVisible} />
						<Table {...tableProps} />
					</Container>
				</Box>
			)}
		</div>
	);
}

export default Documentaries;

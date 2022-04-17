import { useState } from "react";
import { Helmet } from "react-helmet";
import { Box, Container, makeStyles } from "@material-ui/core";
import Table from "../table/Table";
import { remove } from "../../services/podcast";
import Toolbar from "./PodcastToolbar";
import PodcastForm from "./PodcastForm";
import { getDispenseInRecords, getInventory } from "../../services/inventory";
import { getPodcast } from "../../services/podcast";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.default,
		minHeight: "100%",
		paddingBottom: theme.spacing(3),
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
function Podcasts() {
	const classes = useStyles();
	const [podcastForm, setPodcastForm] = useState();
	const [isPodcastFormVisible, setPodcastFormVisible] = useState(false);

	const fetchPodcasts = async (params) => {
		const token = localStorage.getItem("token", 0);
		params.token = token;

		const resp = await getPodcast(params);

		const podcasts = resp.data.data.data.rows;
		const data = podcasts.map((obj) => {
			let flat = {
				...obj,
				...obj.inventory
			};
			return flat;
		});

		return {
			total: resp.data.data.data.count,
			data: data,
			count: resp.data.data.data.count
		};
	};
	const getNames = async (params) => {
		const resp = await getInventory(params);
		const inventory = resp.data.data.data.rows;
		const transfromedData = inventory.map((data) => {
			return data.name;
		});

		return {
			data: transfromedData
		};
	};
	const tableProps = {
		headers,
		getData: fetchPodcasts,
		getNames,
		onEdit: (podcastObj) => {
			setPodcastForm(podcastObj);
			setPodcastFormVisible(true);
		},
		onDelete: remove,
		dateFilters: false,
		omsOptions: []
	};

	return (
		<div>
			<Helmet>
				<title>Dance Pakistan CMS | Podcasts</title>
			</Helmet>
			{isPodcastFormVisible ? (
				<PodcastForm
					podcast={podcastForm}
					podcastHandler={setPodcastForm}
					podcastFormHandler={setPodcastFormVisible}
				/>
			) : (
				<Box className={classes.root}>
					<Container maxWidth={false}>
						<Toolbar podcastFormHandler={setPodcastFormVisible} />
						<Table {...tableProps} />
					</Container>
				</Box>
			)}
		</div>
	);
}

export default Podcasts;

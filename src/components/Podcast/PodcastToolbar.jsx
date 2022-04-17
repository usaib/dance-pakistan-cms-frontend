import clsx from "clsx";
import { Box, Button, makeStyles } from "@material-ui/core";
import WriteIcon from "@material-ui/icons/RateReview";

const useStyles = makeStyles((theme) => ({
	root: {
		marginBottom: theme.spacing(1)
	}
}));

const Toolbar = ({ className, podcastFormHandler, ...rest }) => {
	const classes = useStyles();
	return (
		<div className={clsx(classes.root, className)} {...rest}>
			<Box
				style={{
					display: "flex",
					justifyContent: "flex-end"
				}}
			>
				<Button
					color="primary"
					variant="contained"
					startIcon={<WriteIcon />}
					size="medium"
					onClick={() => {
						podcastFormHandler(true);
					}}
				>
					Add Podcasts
				</Button>
			</Box>
		</div>
	);
};

export default Toolbar;

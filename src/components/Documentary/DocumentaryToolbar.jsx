import clsx from "clsx";
import { Box, Button, makeStyles } from "@material-ui/core";
import TvIcon from "@material-ui/icons/LiveTvSharp";

const useStyles = makeStyles((theme) => ({
	root: {
		marginBottom: theme.spacing(1)
	}
}));

const Toolbar = ({ className, documentaryFormHandler, ...rest }) => {
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
					startIcon={<TvIcon />}
					size="medium"
					onClick={() => {
						documentaryFormHandler(true);
					}}
				>
					Add New Documentary
				</Button>
			</Box>
		</div>
	);
};

export default Toolbar;

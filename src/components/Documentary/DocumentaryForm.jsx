import { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import * as _ from "lodash";
import {
	Box,
	Grid,
	Container,
	makeStyles,
	Paper,
	IconButton
} from "@material-ui/core";
import { MdArrowBack as BackIcon } from "react-icons/md";
import { createDocumentary } from "../../services/documentry";
import { updateDocumentary } from "../../services/documentry";

import { TextField, SingleSelect, Button, Toast } from "../core";

const useStyles = makeStyles((theme) => ({
	formWrapper: {
		margin: theme.spacing(3),
		padding: theme.spacing(3)
	},
	icon: {
		fontSize: 25,
		color: theme.palette.primary.main,
		cursor: "pointer",
		float: "right"
	}
}));

const DocumentaryForm = ({
	Documentary,
	documentaryHandler,
	documentaryFormHandler
}) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState({
		state: "close",
		message: "",
		type: ""
	});

	const initialValues = Documentary || {
		title: "",
		description: "",
		videoId: "",
		imageUrl: ""
	};

	const validationSchema = Yup.object().shape({
		title: Yup.string().max(150).required("title is required"),
		description: Yup.string()

			.max(255)
			.required("description is required"),
		videoId: Yup.number().required("video id is required"),
		imageUrl: Yup.string().required("imageUrl is required")
	});

	const onSubmit = async (values, { resetForm }) => {
		setLoading(true);

		let resp;
		if (Documentary) {
			resp = await updateDocumentary({
				...values
			});
		} else {
			resp = await createDocumentary({
				...values,
				token: localStorage.getItem("token", 0)
			});
		}
		if (resp.data.success) {
			setToast({
				state: "open",
				message: resp.data.message,
				type: "success"
			});
			if (Documentary) {
				setTimeout(() => {
					resetForm();
					documentaryFormHandler(false);
				}, 500);
			} else {
				resetForm();
			}
		} else {
			setToast({
				state: "open",
				message: resp.data.message,
				type: "error"
			});
		}

		setLoading(false);
	};

	return (
		<Grid container>
			<Grid item xs={12}>
				<Container maxWidth="md">
					<Toast {...toast} setState={setToast} />
					<IconButton
						className={classes.icon}
						onClick={() => {
							documentaryFormHandler(false);
							documentaryHandler(null);
						}}
					>
						<BackIcon />
					</IconButton>
					<Paper>
						<div className={classes.formWrapper}>
							<Formik
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={onSubmit}
							>
								{(props) => (
									<Form>
										<Grid container spacing={2}>
											<Grid item xs={12}>
												<TextField name="title" label="Title" required />
											</Grid>
											<Grid item xs={12}>
												<TextField
													name="description"
													label="Description"
													required
												/>
											</Grid>

											{
												<Grid item xs={6}>
													<TextField
														name="videoId"
														label="Video Id"
														min="0"
														required
													/>
												</Grid>
											}
											<Grid item xs={6}>
												<TextField name="imageUrl" label="Image URL" required />
											</Grid>

											<Grid item xs={12}>
												<Box py={2}>
													<Button
														type="submit"
														loading={loading}
														loadingPosition="start"
													>
														{Documentary
															? "Update Documentary"
															: "Create Documentary"}
													</Button>
												</Box>
											</Grid>
										</Grid>
									</Form>
								)}
							</Formik>
						</div>
					</Paper>
				</Container>
			</Grid>
		</Grid>
	);
};

export default DocumentaryForm;

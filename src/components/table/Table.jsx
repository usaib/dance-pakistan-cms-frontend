/* eslint-disable react/no-array-index-key */
import { useState, useEffect, useRef } from "react";
import { Dialog } from "../core";
import { TextDialog } from "../core";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { makeStyles } from "@material-ui/core/styles";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";

import {
	Typography,
	Paper,
	Box,
	TableContainer,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	IconButton,
	Grid,
	Checkbox,
	FormControlLabel,
	Chip,
	CircularProgress
} from "@material-ui/core";
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from "react-icons/md";
import detailIcon from "./detailIcon.png";
import moment from "moment";
import Loader from "../core/Loader";
import TableHeaderCell from "./TableHeaderCell";
import Paginator from "./Paginator";
import TextField from "@material-ui/core/TextField";
import Toast from "../core/Toast";
import { dateTimeConverter } from "../../utils/dateTimeConverter";

const useStyles = makeStyles(() => ({
	table: {
		minWidth: 650
	},
	icon: {
		maxHeight: "28px"
	},
	tableCell: {
		padding: "6px 6px 6px 6px"
	},
	button: {
		margin: 10,
		borderRadius: 100
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1
	},
	loaderRow: {
		height: 109
	},
	loaderPosition: {
		position: "absolute",
		right: "48%",
		top: "19%",
		zIndex: 1
	},
	loaderPositionEmpty: {
		position: "absolute",
		right: "48%",
		top: "49%",
		zIndex: 1
	},
	bodyOverlay: {
		opacity: 0.5
	},
	typo: {
		marginBottom: -13,
		marginLeft: 10
	},
	typoPickups: {
		display: "inline"
	},
	date: {
		overflow: "none",
		minWidth: 220,
		maxWidth: 220,
		marginLeft: 10
	},
	amountField: {
		marginLeft: 10,
		width: 150
	}
}));

const TableWrapper = ({
	headers,
	getData,
	getOptionsData,
	dateFilters,
	onEdit,
	onDelete,
	omsOptions,
	omsOptionsWithColours,
	getOrdersCount,
	onDetails,
	getNames
}) => {
	const today = new Date();
	let componentRef = useRef();
	const { sd, ed } = dateTimeConverter(today, today, true, true);
	const classes = useStyles();
	const [total, setTotal] = useState(0);
	const [idsForPreviews, setIdsForPreviews] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingCsv, setLoadingCsv] = useState(false);
	const [data, setData] = useState([]);
	const [amount, setAmount] = useState(0);
	const [options, setOptions] = useState([]);
	const [startDate, setStartdate] = useState(sd);
	const [endDate, setEndDate] = useState(ed);
	const [askQuantity, setAskQuantity] = useState(false);
	const [showConfirmDialogToDelete, setShowConfirmDialogToDelete] =
		useState(false);
	const [selectedRow, setSelectedRow] = useState();
	const [pending, setPending] = useState(0);
	const [delayed, setDelayed] = useState(0);
	const [ready, setReady] = useState(0);
	const [fulfilled, setFulfilled] = useState(0);
	const [paid, setPaid] = useState(0);
	const [received, setReceived] = useState(0);
	const [cancel, setCancel] = useState(0);
	const [inbound, setInbound] = useState(0);
	const [returned, setReturned] = useState(0);
	const [returnedReceived, setReturnedReceived] = useState(0);
	const [dispatched, setDispatched] = useState(0);
	const [isSending, setIsSending] = useState(false);
	const [csvData, setCsvData] = useState({
		data: [],
		headers: headers,
		filename: "Orders.csv"
	});

	const [showConfirmDialog, setShowConfirmDialog] = useState("");
	const [filters, setFilters] = useState({});
	const [lineItemIds, setLineItemIds] = useState([]);
	const [initialFilter, setInitialFilter] = useState([]);
	const [omsStatus, setOmsStatus] = useState("");
	const [count, setCount] = useState("0");
	const [preview, setPreview] = useState("");
	const isAllSelected = dateFilters
		? options.length > 0 && lineItemIds.length === options.length
		: false;
	const [paginator, setPaginator] = useState({
		limit: 10,
		offset: 0
	});
	const [toast, setToast] = useState({
		state: "close",
		message: "",
		type: ""
	});
	const handleChange = (event) => {
		const value = event.target.value;
		if (value === "all") {
			setLineItemIds(lineItemIds.length === options.length ? [] : options);
			return;
		}
		const list = [...lineItemIds];
		const index = list.indexOf(value);
		index === -1 ? list.push(value) : list.splice(index, 1);
		setLineItemIds(list);
	};
	useEffect(() => {
		async function fetchOrdersCount() {
			try {
				if (paginator.offset == 0) {
					const totalRecords = await getOrdersCount({
						limit: 0,
						offset: 0,
						gte: startDate,
						lte: endDate,
						getAggregations: false,
						withCount: true,
						filters: { ...filters }
					});

					setTotal(totalRecords.data.data.count);
				}
			} catch (e) {
				setTotal(0);
			}
		}
		fetchOrdersCount();
	}, [filters, startDate, endDate]);
	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			try {
				const result = await getData({
					...paginator,
					gte: startDate,
					lte: endDate,
					getAggregations: false,
					filters: { ...filters }
				});
				setData(result.data);
				setOptions(result.options);
				setTotal(result.count);
				if (!dateFilters) {
					setTotal(result.count);
				}
			} catch (error) {
				setData([]);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [paginator, filters, getData, startDate, endDate, isSending]);

	return (
		<Paper elevation={3}>
			<Toast {...toast} setState={setToast} />
			<Grid container justify="space-between" alignItems="center">
				<Grid item>
					<Grid
						spacing={2}
						container
						justify="space-between"
						alignItems="center"
					>
						<Grid item>
							<Typography className={classes.typo} variant="h5">
								Total Records: {paginator.offset + 1} to{" "}
								{paginator.offset + paginator.limit < total
									? paginator.offset + paginator.limit
									: total}{" "}
								of {""}
								{total}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Paginator
						totalRecords={total}
						paginator={paginator}
						paginatorHandler={setPaginator}
					/>
				</Grid>
			</Grid>

			<form noValidate>
				<TextField
					id="startDate"
					label="Start Date"
					type="datetime-local"
					defaultValue={sd}
					className={classes.date}
					onChange={(e) => setStartdate(e.target.value)}
					InputLabelProps={{
						shrink: true
					}}
				/>
				<TextField
					id="endDate"
					label="End Date"
					type="datetime-local"
					defaultValue={ed}
					className={classes.date}
					onChange={(e) => setEndDate(e.target.value)}
					InputLabelProps={{
						shrink: true
					}}
				/>
			</form>
			<TextDialog
				title="Confirmation Dialog"
				message="Are you sure you want to delete?"
				state={showConfirmDialogToDelete}
				stateHandler={setShowConfirmDialogToDelete}
				submitHandler={async (newValue) => {
					await onDelete(selectedRow);
					setFilters({});
				}}
				showField={false}
			/>
			<TableContainer>
				<PerfectScrollbar>
					<Table className={classes.table} ref={(el) => (componentRef = el)}>
						<TableHead className={classes.tableHeader}>
							<TableRow>
								{dateFilters ? (
									<TableCell>
										<FormControlLabel
											control={
												<Checkbox
													checked={isAllSelected}
													onChange={handleChange}
													value="all"
													inputProps={{ "aria-label": "primary checkbox" }}
												/>
											}
										/>
									</TableCell>
								) : (
									""
								)}
								{headers.map((header) => {
									return (
										<TableHeaderCell
											key={header.value}
											filter={filters}
											filterHandler={setFilters}
											className={classes.tableCell}
											filterType={header.filterType}
											getOptionsData={getNames}
											initialFilter={initialFilter}
											omsOptions={omsOptions}
										>
											{header}
										</TableHeaderCell>
									);
								})}
								<TableCell className={classes.tableCell}>
									{<Typography>Action</Typography>}
								</TableCell>
							</TableRow>
						</TableHead>
						{loading && (
							<div
								className={
									data.length
										? classes.loaderPosition
										: classes.loaderPositionEmpty
								}
							>
								<Loader height={50} />
							</div>
						)}
						<TableBody className={loading ? classes.bodyOverlay : ""}>
							{loading && !data.length && (
								<TableRow>
									<TableCell
										colSpan={headers.length + 1}
										className={classes.loaderRow}
									/>
								</TableRow>
							)}

							{data &&
								data.map((row, index) => (
									<>
										<TableRow key={index}>
											{dateFilters ? (
												<TableCell className={classes.tableCell}>
													<Checkbox
														checked={lineItemIds.includes(row.id.toString())}
														value={row.id}
														onChange={handleChange}
														inputProps={{ "aria-label": "primary checkbox" }}
													/>
												</TableCell>
											) : (
												""
											)}
											{headers.map((header, headerIndex) => {
												// Transform Values
												if (header.type === "date") {
													if (row[header.value]) {
														row[header.value] = moment(
															row[header.value]
														).format("DD MMM, YYYY h:mm:ss A");
													}
												}
												if (header.value === "discount") {
													if (isNaN(row[header.value])) {
														row[header.value] = 0;
													}
												}
												if (header.value === "discountPercentage") {
													if (isNaN(row[header.value])) {
														row[header.value] = 0;
													}
												}

												if (header.value === "omsStatus") {
													if (typeof row[header.value] == "undefined") {
														row[header.value] = "Pending";
													}
													if (row[header.value].props.label == "Delayed") {
													}
												}
												return (
													<TableCell
														className={classes.tableCell}
														key={headerIndex}
													>
														{row[header.value]}
													</TableCell>
												);
											})}
											{
												<TableCell className={classes.tableCell}>
													<Box display="flex" flexDirection="row">
														<IconButton
															color="primary"
															variant="contained"
															size="medium"
															onClick={() => onEdit(data[index])}
														>
															<EditIcon />
														</IconButton>
														<IconButton
															color="primary"
															variant="contained"
															size="medium"
															onClick={() => {
																setShowConfirmDialogToDelete(true);
																setSelectedRow(data[index]);
															}}
														>
															<DeleteIcon />
														</IconButton>
													</Box>
												</TableCell>
											}
										</TableRow>
										{!loading &&
											(!!data.length || (
												<TableRow>
													<TableCell
														className={classes.tableCell}
														colSpan={headers.length + 1}
														align="center"
													>
														<Typography variant="h6">No Data Found</Typography>
													</TableCell>
												</TableRow>
											))}
									</>
								))}
						</TableBody>
					</Table>
				</PerfectScrollbar>
			</TableContainer>
			{data.length ? (
				<Paginator
					totalRecords={total}
					paginator={paginator}
					paginatorHandler={setPaginator}
				/>
			) : (
				""
			)}
		</Paper>
	);
};

export default TableWrapper;

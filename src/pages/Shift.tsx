import React, { FunctionComponent, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { getErrorMessage } from "../helper/error/index";
import { deleteShiftById, getShifts } from "../helper/api/shift";
import DataTable from "react-data-table-component";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline"
import { useHistory } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";
import { Button, CardActions } from "@material-ui/core";
import moment from "moment";
import { Col, Row } from "reactstrap";
import { createPublish, getPublish } from "../helper/api/publish";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: 'white',
    color: theme.color.turquoise
  },
  publishBtn: {
    backgroundColor: theme.color.turqouise,
    color: "white",
    marginLeft:"auto",
  },
  addBtn: {
    backgroundColor: "white",
    color: theme.color.turqouise,
    marginLeft:"auto",
    marginRight:"0.5em",
    border:theme.color.turqouise
  },
  leftArrowBtn:{
    backgroundColor: "white",
    color: theme.color.gray,
    marginRight:"auto",
  },
  rightArrowBtn:{
    backgroundColor:"white",
    color:theme.color.gray,
    marginRight:"20%"
  },
  dateText:{
    color:theme.color.turqouise
  },
  dateTextWhite:{
    color:"white",
    marginLeft:"auto"
  }
}));

interface Results {
  id?: string;
  name?:string;
  startTime?:string;
  endTime?:string;
  createdAt?:string;
  updateAt?:string;
  date?:string;
}

interface ActionButtonProps {
  id: string;
  onDelete: () => void;
  isPublish:boolean;
}
const ActionButton: FunctionComponent<ActionButtonProps> = ({
  id,
  onDelete,
  isPublish
}) => {
  return (
    <div>
      <IconButton
        size="small"
        aria-label="delete"
        component={RouterLink}
        to={`/shift/${id}/edit`}
        disabled={isPublish}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="delete" onClick={() => onDelete()} disabled={isPublish}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const Shift = () => {
  let day = new Date()
  const classes = useStyles();
  const history = useHistory();

  //getdata shifts
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  
  //getdata publish
  const [isLoadingPublish, setIsLoadingPublish] = useState(false)
  const [updateData, setUpdateData] = useState(false)
  const [publish, setPublish] = useState([])

  //crud
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  // for date
  let d =day.getDay()
  let start = day.getDate() - d+(d==0?-6:1)
  let end = start+6
  let monday = new Date(day.setDate(start))
  let sunday = new Date(day.setDate(end))

  const [startDate,setStartDate] = useState(moment(monday).format('YYYY-MM-DD'))
  const [endDate,setEndDate]=useState(moment(sunday).format('YYYY-MM-DD'))
  // for publish
  const [publishText,setPublishText] = useState("")
  

  const onDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const onCloseDeleteDialog = () => {
    setSelectedId(null);
    setShowDeleteConfirm(false);
  }; 

  const leftArrowClick=()=>{
    let monday = new Date(startDate)
    monday.setDate(monday.getDate()-7)
    let prevmonday = moment(monday).format("YYYY-MM-DD")
    setStartDate(prevmonday)

    let sunday = new Date(endDate)
    sunday.setDate(sunday.getDate()-7)
    let prevsunday = moment(sunday).format("YYYY-MM-DD")
    setEndDate(prevsunday)
  }
  const rightArrowClick=()=>{
    let monday = new Date(startDate)
    monday.setDate(monday.getDate()+7)
    let nextmonday = moment(monday).format("YYYY-MM-DD")
    setStartDate(nextmonday)

    let sunday = new Date(endDate)
    sunday.setDate(sunday.getDate()+7)
    let nextsunday = moment(sunday).format("YYYY-MM-DD")
    setEndDate(nextsunday)

  }

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setErrMsg("");
        const { results } = await getShifts(startDate, endDate);
        // console.log(results)
        setRows(results);
      } catch (error) {
        const message = getErrorMessage(error);
        setErrMsg(message);
      } finally {
        setIsLoading(false);
      }
    };

    const getDataPublish = async () => {
      try {
        setIsLoadingPublish(true);
        const { results } = await getPublish(startDate, endDate);
        console.log(results)
        if(results.length!==0){
          setPublishText(moment(results[0].createdAt).format("DD MMM YYYY, hh:mm a"))
        }
        setPublish(results)
        // setUpdateData(true);
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingPublish(false);
      }
    };
    if(updateData===true){
      setUpdateData(false)
    }

    getData();
    getDataPublish();
  }, [startDate,endDate,updateData]);

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
    },
    {
      name: "Start Time",
      selector: "startTime",
      sortable: true,
    },
    {
      name: "End Time",
      selector: "endTime",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <ActionButton id={row.id} onDelete={() => onDeleteClick(row.id)} isPublish={isPublish}/>
      ),
    },
  ];

  const deleteDataById = async () => {
    try {
      setDeleteLoading(true);
      setErrMsg("");

      if (selectedId === null) {
        throw new Error("ID is null");
      }

      console.log(deleteDataById);

      await deleteShiftById(selectedId, startDate, endDate);

      const tempRows = [...rows];
      const idx = tempRows.findIndex((v: any) => v.id === selectedId);
      tempRows.splice(idx, 1);
      setRows(tempRows);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setDeleteLoading(false);
      onCloseDeleteDialog();
    }
  };

  let anyData = false
  if(rows.length===0){
    anyData = true
  }
  let isPublish = false
  if(publish.length!==0){
    isPublish =true
  }

  const addPublish=async()=>{
    if(!isPublish){
      try{
        setIsLoadingPublish(true)
        setErrMsg("")
        const { results } = await createPublish(startDate, endDate);
        console.log(results)
        setUpdateData(true)
      }catch(error){
        const message = getErrorMessage(error);
        setErrMsg(message);
      }finally{
        setIsLoadingPublish(false)
      }
    }
  }
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardContent>
            {errMsg.length > 0 ? (
              <Alert severity="error">{errMsg}</Alert>
            ) : (
              <></>
            )}
            <CardContent>
              <Button
                onClick={()=>leftArrowClick()}
                className={classes.leftArrowBtn}
                variant="contained"
                // component={RouterLink}
                // to="/shift"
                // disabled={submitLoading}
              >
                {`<`}
              </Button>
              {"  "}
              <span className={isPublish?classes.dateText:""}>
                <b>
                {
                  moment(startDate).format("DD MMMM")+" - "+moment(endDate).format("DD MMMM")
                }
                </b>
              </span>
              {"  "}
              <Button
                onClick={()=>rightArrowClick()}
                className={classes.rightArrowBtn}
                variant="contained"
              >
                {`>`}
              </Button>
              {
                isPublish? <span className={classes.dateText}><CheckCircleOutlineIcon fontSize="small"/> Week publish {publishText} </span>:<span className={classes.dateTextWhite}>Week publish</span>
              }
            {/* </CardContent>
            <CardContent> */}
              <Button
                  className={classes.addBtn}
                  variant="contained"
                  component={RouterLink}
                  to="/shift/add"
                  disabled={isPublish||isLoading}
                >
                  Add Shifts
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.publishBtn}
                disabled ={anyData || isPublish ||isLoadingPublish}
                onClick={()=>addPublish()}
              >
                Publish
              </Button>
            </CardContent>
            {/* <Button className="" onClick={()=>addshifts()}>Add Shifts</Button> */}
            {/* <Button className="" onClick={(e)=>publish(e)}>Publish</Button> */}
            <DataTable
              title="Shifts"
              columns={columns}
              data={rows}
              pagination
              progressPending={isLoading}
            />
          </CardContent>
        </Card>
      </Grid>
      <Fab
        size="medium"
        aria-label="add"
        className={classes.fab}
        onClick={() => history.push("/shift/add")}
        disabled={isPublish}
      >
        <AddIcon />
      </Fab>
      <ConfirmDialog
        title="Delete Confirmation"
        description={`Do you want to delete this data ?`}
        onClose={onCloseDeleteDialog}
        open={showDeleteConfirm}
        onYes={deleteDataById}
        loading={deleteLoading}
      />
    </Grid>
  );
};

export default Shift;

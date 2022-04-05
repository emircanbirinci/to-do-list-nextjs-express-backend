import { React, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "./components/footer";
import Header from "./components/header";

function Home({ priorityList }) {
  const [jobName, setJobName] = useState("");
  const [priority, setPriority] = useState(0);
  const [editPriority, setEditPriority] = useState(0);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [row, setRow] = useState();
  const [sortColumn, setSortColumn] = useState("priority");
  const [sortType, setSortType] = useState("desc");
  const [jobSearch, setJobSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState([]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleIDS = () => {
    let tempData = JSON.parse(localStorage.getItem("data"));
    tempData = tempData ? tempData : [];
    tempData.forEach((item, i) => {
      item["id"] = i;
    });
    localStorage.setItem("data", JSON.stringify(tempData));

    setData(tempData);
  };

  const populateSelectItems = () => {
    let temp = [];
    Object.keys(priorityList).forEach((item) => {
      temp.push(
        <MenuItem value={item} key={item}>
          {priorityList[item]}
        </MenuItem>
      );
    });
    return temp;
  };

  useEffect(() => {
    handleIDS();
    const localData = JSON.parse(localStorage.getItem("data"));

    setData(localData ? localData : []);
  }, []);
  let dataTemp = [];

  const handleSort = (type) => {
    setSortType(
      type == sortColumn ? (sortType == "asc" ? "desc" : "asc") : "desc"
    );
    setSortColumn(type);
  };

  const handleClickOpen = (i, type) => {
    setRow(i);
    setType(type);
    type == "edit" ? setEditPriority(data[i].priority) : null;

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if (jobName.length == 0 || priority == 0) {
      alert("All Zones Must Be Filled");
    } else {
      dataTemp = [...data];
      dataTemp.push({ jobName, priority });

      localStorage.setItem("data", JSON.stringify(dataTemp));
      handleIDS();
      setJobName("");
      setPriority(0);
      alert("created succesfull");
    }
  };

  const handleDelete = (i) => {
    dataTemp = [...data];
    dataTemp = dataTemp.filter((x) => x.id != i);
    setData(dataTemp);
    localStorage.setItem("data", JSON.stringify(dataTemp));
    handleIDS();
    handleClose();
  };

  const handleEdit = (i) => {
    if (editPriority == 0) {
      alert("Priority must be filled");
    } else {
      dataTemp = [...data];
      dataTemp[i].priority = editPriority;
      setData(dataTemp);
      localStorage.setItem("data", JSON.stringify(dataTemp));
      handleClose();
    }
  };

  let filteredData = filterPriority.length == 0 ? data : [];
  let tempFiltered = data;

  filterPriority.forEach((item) => {
    filteredData = [
      ...filteredData,
      ...tempFiltered.filter((x) => x.priority == item),
    ];
  });

  filteredData = filteredData.filter((x) =>
    x.jobName.toLowerCase().includes(jobSearch.toLowerCase())
  );

  filteredData = filteredData.sort((a, b) =>
    a[sortColumn] > b[sortColumn]
      ? sortType === "asc"
        ? 1
        : -1
      : b[sortColumn] > a[sortColumn]
      ? sortType === "asc"
        ? -1
        : 1
      : 0
  );

  const populateCells = () => {
    let temp = [];
    filteredData.forEach((item, i) => {
      let priorityString = priorityList[item.priority];
      temp.push(
        <div
          className={i % 2 == 0 || i == 0 ? "list-cell-0" : "list-cell-1"}
          key={i}
        >
          <div style={{ width: "60%", marginLeft: 8 }}>{item.jobName}</div>
          <div
            style={{
              width: "20%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                background:
                  item.priority == 3
                    ? "red"
                    : item.priority == 2
                    ? "orange"
                    : "#1976d2",
                color: "white",
                padding: "3px 9px",
                borderRadius: 5,
                display: "flex",
                width: "35%",
                justifyContent: "center",
              }}
            >
              {priorityString}
            </div>
          </div>
          <div
            style={{
              width: "20%",
              display: "flex",
              justifyContent: "flex-start",
              padding: "8px 8px",
            }}
          >
            <IconButton
              aria-label="delete"
              size="medium"
              onClick={() => handleClickOpen(item.id, "edit")}
              style={{ background: "#dedede", borderRadius: "5px" }}
            >
              <ModeEditOutlineOutlinedIcon fontSize="medium" />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="medium"
              onClick={() => handleClickOpen(item.id, "delete")}
              style={{
                background: "#dedede",
                borderRadius: "5px",
                marginLeft: 10,
              }}
            >
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </div>
        </div>
      );
    });
    return temp;
  };

  const populateModal = () => {
    let temp = [];
    if (type == "delete") {
      temp.push(
        <div key={"delete"}>
          <DialogTitle
            id="responsive-dialog-title"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <ReportOutlinedIcon sx={{ color: "red", fontSize: 60 }} />
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "30",
              }}
            >
              Are you sure you want to delete it?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 25% 30px 25%",
            }}
          >
            <Button
              autoFocus
              variant="contained"
              onClick={handleClose}
              style={{ width: "45%", background: "gray" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(row)}
              variant="contained"
              autoFocus
              color="error"
              style={{ width: "45%" }}
            >
              Approve
            </Button>
          </DialogActions>
        </div>
      );
    } else if (type == "edit") {
      temp.push(
        <div key="edit">
          <DialogTitle
            id="responsive-dialog-title"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h3>Job Edit</h3>
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ padding: "0 16px" }}>
              <FormHelperText>Job Name</FormHelperText>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Enter Job Name"
                value={data[row]["jobName"]}
                disabled
                style={{ width: "100%" }}
              />{" "}
              <FormHelperText style={{ marginTop: 20 }}>
                Job Priority
              </FormHelperText>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                style={{ width: "100%" }}
              >
                <MenuItem value={0}>Choose</MenuItem>
                {populateSelectItems()}
              </Select>
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 25% 30px 25%",
            }}
          >
            <Button
              autoFocus
              variant="contained"
              onClick={handleClose}
              style={{ width: "45%", background: "gray" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleEdit(row)}
              variant="contained"
              autoFocus
              color="error"
              style={{ width: "45%" }}
            >
              Save
            </Button>
          </DialogActions>
        </div>
      );
    }

    return temp;
  };

  return (
    <>
      <div className="main-container">
        <Header />
        <div className="create-main-container">
          <div className="create-header">
            <h3>Create New Job</h3>
          </div>
          <div className="create-container">
            <div className="create-text-area">
              <FormHelperText>Job Name</FormHelperText>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Enter Job Name"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
              />{" "}
            </div>
            <div className="create-select">
              <FormHelperText>Job Priority</FormHelperText>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value={0}>Choose</MenuItem>
                {populateSelectItems()}
              </Select>
            </div>
            <div className="create-button">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                style={{
                  height: 56,
                  marginTop: 23,
                  width: "100%",
                  maxWidth: 200,
                }}
                onClick={() => handleSubmit()}
              >
                Create
              </Button>
            </div>
          </div>
        </div>

        <div className="list-container">
          <div className="list-header">
            <h3>Job List</h3>
            <p>({"3"}/3)</p>
          </div>

          <div className="list-filter-container" style={{ marginTop: 16 }}>
            <TextField
              id="filled-start-adornment"
              sx={{ m: 1, width: "25ch" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="filled"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              style={{ width: "65%", background: "white" }}
            />
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              multiple
              style={{ width: "30%", background: "white" }}
            >
              {populateSelectItems()}
            </Select>
          </div>
          <div className="list-header-container">
            <Button
              variant="text"
              style={{
                height: 56,
                borderRadius: 0,
                width: "60%",
                backgroundColor: "#d2d8ef",
                color: "gray",
                marginTop: 1,
              }}
              onClick={() => handleSort("jobName")}
            >
              Name
            </Button>
            <Button
              variant="text"
              style={{
                height: 56,
                backgroundColor: "#d2d8ef",
                width: "20%",
                borderRadius: 0,
                color: "gray",
                marginTop: 1,
              }}
              onClick={() => handleSort("priority")}
            >
              Priority
            </Button>
            <Button
              variant="text"
              style={{
                height: 56,
                backgroundColor: "#d2d8ef",
                width: "20%",
                borderRadius: 0,
                color: "gray",
                marginTop: 1,
              }}
              onClick={() => null}
            >
              Action
            </Button>
          </div>
          <div className="list-cell-area">
            {populateCells()}
            <Dialog
              fullScreen={fullScreen}
              open={open}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              {populateModal()}
            </Dialog>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export async function getServerSideProps(req) {
  let data = await fetch(`http://${process.env.SERVER_IP}/api/priority`);

  let props = await data.json();
  return {
    props,
  };
}
export default Home;

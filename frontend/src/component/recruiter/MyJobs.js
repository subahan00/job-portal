import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  MenuItem,
  Checkbox,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { makeStyles } from "@material-ui/core/styles";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    minHeight: "93vh",
    width: "100%",
  },
  button: {
    width: "100%",
    height: "100%",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    },
  },
  jobTileOuter: {
    padding: "25px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
    },
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(5px)",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
    },
  },
  searchBar: {
    width: "500px",
    marginBottom: "20px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "30px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "scale(1.02)",
      },
    },
  },
  filterButton: {
    backgroundColor: "#3f51b5",
    color: "white",
    borderRadius: "50%",
    padding: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "rotate(90deg)",
      backgroundColor: "#303f9f",
    },
  },
  modalPaper: {
    padding: "40px",
    outline: "none",
    borderRadius: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    minWidth: "50%",
  },
  applyButton: {
    padding: "12px 40px",
    borderRadius: "30px",
    background: "linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)",
    color: "white",
    boxShadow: "0 4px 10px rgba(74, 0, 224, 0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 6px 15px rgba(74, 0, 224, 0.4)",
    },
  },
  chip: {
    margin: "0 4px 4px 0",
    background: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",
    color: "white",
    fontWeight: "500",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  pageTitle: {
    color: "white",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    marginBottom: "20px",
    fontWeight: "600",
  },
  sliderRoot: {
    color: "#8e2de2",
  },
  actionButton: {
    transition: "transform 0.3s ease",
    borderRadius: "8px",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  viewApplicationsBtn: {
    background: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
    color: "white",
  },
  updateBtn: {
    background: "linear-gradient(135deg, #FF8008 0%, #FFC837 100%)",
    color: "white",
  },
  deleteBtn: {
    background: "linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)",
    color: "white",
  },
  sortContainer: {
    border: "1px solid #D1D1D1", 
    borderRadius: "10px",
    padding: "8px",
    marginLeft: "5px",
    marginRight: "5px",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
  },
}));

const JobTile = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const { job, getData } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [jobDetails, setJobDetails] = useState(job);

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleClick = (location) => {
    history.push(location);
  };

  const handleClose = () => setOpen(false);
  const handleCloseUpdate = () => setOpenUpdate(false);

  const handleDelete = () => {
    axios
      .delete(`${apiList.jobs}/${job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
        handleClose();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const handleJobUpdate = () => {
    axios
      .put(`${apiList.jobs}/${job._id}`, jobDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
        handleCloseUpdate();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const postedOn = new Date(job.dateOfPosting);

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5" style={{ fontWeight: "600", color: "#1e3c72" }}>
              {job.title}
            </Typography>
          </Grid>
          <Grid item>
            <Rating 
              value={job.rating !== -1 ? job.rating : null} 
              readOnly 
              style={{ color: "#FFC837" }}
            />
          </Grid>
          <Grid item><b>Role:</b> {job.jobType}</Grid>
          <Grid item><b>Salary:</b> ₹{job.salary} per month</Grid>
          <Grid item>
            <b>Duration:</b> {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
          </Grid>
          <Grid item><b>Posted:</b> {postedOn.toLocaleDateString()}</Grid>
          <Grid item><b>Applicants:</b> {job.maxApplicants}</Grid>
          <Grid item>
            <b>Open Positions:</b> {job.maxPositions - job.acceptedCandidates}
          </Grid>
          <Grid item>
            {job.skillsets.map((skill) => (
              <Chip label={skill} className={classes.chip} />
            ))}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={3} spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              className={`${classes.statusBlock} ${classes.viewApplicationsBtn} ${classes.actionButton}`}
              onClick={() => handleClick(`/job/applications/${job._id}`)}
            >
              View Applications
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              className={`${classes.statusBlock} ${classes.updateBtn} ${classes.actionButton}`}
              onClick={() => setOpenUpdate(true)}
            >
              Update Details
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              className={`${classes.statusBlock} ${classes.deleteBtn} ${classes.actionButton}`}
              onClick={() => setOpen(true)}
            >
              Delete Job
            </Button>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Delete Modal */}
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper className={classes.modalPaper}>
          <Typography variant="h4" style={{ marginBottom: "20px", textAlign: "center", color: "#1e3c72" }}>
            Are you sure?
          </Typography>
          <Grid container justify="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                className={classes.deleteBtn}
                style={{ padding: "10px 50px" }}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      
      {/* Update Modal */}
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        className={classes.popupDialog}
      >
        <Paper className={classes.modalPaper}>
          <Typography variant="h4" style={{ marginBottom: "20px", textAlign: "center", color: "#1e3c72" }}>
            Update Details
          </Typography>
          <Grid
            container
            direction="column"
            spacing={3}
          >
            <Grid item>
              <TextField
                label="Application Deadline"
                type="datetime-local"
                value={jobDetails.deadline.substr(0, 16)}
                onChange={(event) => handleInput("deadline", event.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Maximum Number Of Applicants"
                type="number"
                variant="outlined"
                value={jobDetails.maxApplicants}
                onChange={(event) => handleInput("maxApplicants", event.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Positions Available"
                type="number"
                variant="outlined"
                value={jobDetails.maxPositions}
                onChange={(event) => handleInput("maxPositions", event.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={5} style={{ marginTop: "20px" }}>
            <Grid item>
              <Button
                variant="contained"
                className={classes.updateBtn}
                style={{ padding: "10px 50px" }}
                onClick={handleJobUpdate}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={handleCloseUpdate}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Paper>
  );
};

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  
  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper className={classes.modalPaper}>
        <Grid container direction="column" alignItems="center" spacing={3}>
          {/* Job Type Selection */}
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              <Typography variant="subtitle1" style={{ fontWeight: "600" }}>Job Type</Typography>
            </Grid>
            <Grid container item xs={9} justify="space-around">
              {["fullTime", "partTime", "wfh"].map((type, index) => (
                <Grid item key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={type}
                        checked={searchOptions.jobType[type]}
                        onChange={(event) => {
                          setSearchOptions({
                            ...searchOptions,
                            jobType: {
                              ...searchOptions.jobType,
                              [event.target.name]: event.target.checked,
                            },
                          });
                        }}
                        style={{ color: "#4a00e0" }}
                      />
                    }
                    label={type === "fullTime" ? "Full Time" : type === "partTime" ? "Part Time" : "Work From Home"}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Salary Slider */}
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              <Typography variant="subtitle1" style={{ fontWeight: "600" }}>Salary</Typography>
            </Grid>
            <Grid item xs={9}>
              <Slider
                classes={{ root: classes.sliderRoot }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `₹${value * 1000}`}
                marks={[
                  { value: 0, label: "₹0" },
                  { value: 100, label: "₹100,000" },
                ]}
                value={searchOptions.salary}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    salary: value,
                  })
                }
              />
            </Grid>
          </Grid>

          {/* Duration Selection */}
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              <Typography variant="subtitle1" style={{ fontWeight: "600" }}>Duration</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Duration"
                variant="outlined"
                fullWidth
                value={searchOptions.duration}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    duration: event.target.value,
                  })
                }
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                  <MenuItem key={item} value={item.toString()}>
                    {item === 0 ? "All" : `${item} month${item > 1 ? "s" : ""}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Sort Options */}
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              <Typography variant="subtitle1" style={{ fontWeight: "600" }}>Sort By</Typography>
            </Grid>
            <Grid item container direction="row" xs={9} spacing={1}>
              {["salary", "duration", "rating"].map((sortType, index) => (
                <Grid item container xs={4} key={index} className={classes.sortContainer}>
                  <Grid item>
                    <Checkbox
                      name={sortType}
                      checked={searchOptions.sort[sortType].status}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            [sortType]: {
                              ...searchOptions.sort[sortType],
                              status: event.target.checked,
                            },
                          },
                        })
                      }
                      id={sortType}
                      style={{ color: "#4a00e0" }}
                    />
                  </Grid>
                  <Grid item>
                    <label htmlFor={sortType}>
                      <Typography style={{ textTransform: "capitalize" }}>{sortType}</Typography>
                    </label>
                  </Grid>
                  <Grid item>
                    <IconButton
                      disabled={!searchOptions.sort[sortType].status}
                      onClick={() => {
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            [sortType]: {
                              ...searchOptions.sort[sortType],
                              desc: !searchOptions.sort[sortType].desc,
                            },
                          },
                        });
                      }}
                    >
                      {searchOptions.sort[sortType].desc ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Apply Button */}
          <Grid item style={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              className={classes.applyButton}
              onClick={() => getData()}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const MyJobs = () => {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const setPopup = useContext(SetPopupContext);
  
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [`myjobs=1`];
    
    if (searchOptions.query !== "") {
      searchParams.push(`q=${searchOptions.query}`);
    }
    
    Object.keys(searchOptions.jobType).forEach(type => {
      if (searchOptions.jobType[type]) {
        const formattedType = type === "fullTime" ? "Full%20Time" : 
                             type === "partTime" ? "Part%20Time" : "Work%20From%20Home";
        searchParams.push(`jobType=${formattedType}`);
      }
    });
    
    if (searchOptions.salary[0] !== 0) {
      searchParams.push(`salaryMin=${searchOptions.salary[0] * 1000}`);
    }
    
    if (searchOptions.salary[1] !== 100) {
      searchParams.push(`salaryMax=${searchOptions.salary[1] * 1000}`);
    }
    
    if (searchOptions.duration !== "0") {
      searchParams.push(`duration=${searchOptions.duration}`);
    }

    // Add sorting parameters
    let asc = [], desc = [];
    Object.keys(searchOptions.sort).forEach((key) => {
      const item = searchOptions.sort[key];
      if (item.status) {
        (item.desc ? desc : asc).push(`${item.desc ? 'desc' : 'asc'}=${key}`);
      }
    });
    
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setJobs(response.data);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching jobs",
        });
      });
  };

  return (
    <div className={classes.body}>
      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ padding: "30px" }}
      >
        {/* Header and Search */}
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h2" className={classes.pageTitle}>
              My Jobs
            </Typography>
          </Grid>
          <Grid item style={{ marginBottom: "20px" }}>
            <TextField
              className={classes.searchBar}
              label="Search Jobs"
              value={searchOptions.query}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  query: event.target.value,
                })
              }
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getData();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => getData()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <IconButton 
              className={classes.filterButton} 
              onClick={() => setFilterOpen(true)}
            >
              <FilterListIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* Job Listings */}
        <Grid
          container
          direction="column"
          alignItems="stretch"
          justify="center"
        >
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobTile key={job._id} job={job} getData={getData} />
            ))
          ) : (
            <Paper className={classes.jobTileOuter}>
              <Typography variant="h5" style={{ textAlign: "center" }}>
                No jobs found
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Filter Popup */}
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </div>
  );
};

export default MyJobs;
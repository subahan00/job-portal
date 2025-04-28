import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
  Grow,
  Zoom,
  Fade,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";
document.body.style.overflowX = "hidden";

const useStyles = makeStyles((theme) => ({
  body: {
    overflowX: "hidden",
    minHeight: "93vh",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    padding: "30px",
    color: "#fff",
    width: "100%",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 250px",
    width: "60%",
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "15px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    backdropFilter: "blur(4px)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.5)",
    },
  },
  popupDialog: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchField: {
    padding: "0px",
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "15px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "50px",
    },
  },
  filterButton: {
    color: "#fff",
    background: "rgba(255, 255, 255, 0.2)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
  },
  applyButton: {
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
    "&:hover": {
      transform: "scale(1.03)",
    },
  },
  title: {
    color: "#fff",
    textShadow: "2px 2px 4px rgba(58, 51, 51, 0.3)",
    marginBottom: theme.spacing(3),
  },
  chip: {
    margin: "4px",
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    color: "white",
  },
  modalContent: {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    outline: "none",
    color: "black",
    maxWidth: "600px",
    width: "90%",
  },
  slider: {
    color: "#21CBF3",
  },
}));

const JobTile = ({ job }) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        { sop },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
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

  const deadline = new Date(job.deadline).toLocaleDateString();

  return (
    <Grow in={true}>
      <Paper className={classes.jobTileOuter} elevation={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Typography variant="h5" style={{ color: "#1e3c72" }}>
              {job.title}
            </Typography>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
            <Typography>Role: {job.jobType}</Typography>
            <Typography>Salary: ₹{job.salary} per month</Typography>
            <Typography>
              Duration: {job.duration !== 0 ? `${job.duration} month` : "Flexible"}
            </Typography>
            <Typography>Posted By: {job.recruiter.name}</Typography>
            <Typography>Application Deadline: {deadline}</Typography>
            <div style={{ marginTop: "10px" }}>
              {job.skillsets.map((skill, index) => (
                <Chip key={index} label={skill} className={classes.chip} />
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={3} style={{ display: "flex", alignItems: "center" }}>
            <Zoom in={true}>
              <Button
                variant="contained"
                className={classes.applyButton}
                onClick={() => setOpen(true)}
                disabled={userType() === "recruiter"}
                fullWidth
                size="large"
              >
                Apply
              </Button>
            </Zoom>
          </Grid>
        </Grid>

        <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
          <Fade in={open}>
            <div className={classes.modalContent}>
              <Typography variant="h6" gutterBottom>
                Write SOP (up to 250 words)
              </Typography>
              <TextField
                multiline
                rows={8}
                fullWidth
                variant="outlined"
                value={sop}
                onChange={(e) => {
                  if (e.target.value.split(/\s+/).filter(Boolean).length <= 250) {
                    setSop(e.target.value);
                  }
                }}
                style={{ marginBottom: "30px", background: "rgba(255, 255, 255, 0.9)" }}
              />
              <Button
                variant="contained"
                className={classes.applyButton}
                onClick={handleApply}
                size="large"
              >
                Submit
              </Button>
            </div>
          </Fade>
        </Modal>
      </Paper>
    </Grow>
  );
};

const FilterPopup = ({ open, handleClose, searchOptions, setSearchOptions, getData }) => {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Fade in={open}>
        <div className={classes.modalContent}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Typography variant="h6">Job Type</Typography>
              <FormGroup row>
                {["fullTime", "partTime", "wfh"].map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        name={type}
                        checked={searchOptions.jobType[type]}
                        onChange={(e) =>
                          setSearchOptions({
                            ...searchOptions,
                            jobType: {
                              ...searchOptions.jobType,
                              [e.target.name]: e.target.checked,
                            },
                          })
                        }
                        color="primary"
                      />
                    }
                    label={type === "wfh" ? "Work From Home" : type.replace(/([A-Z])/g, " $1").trim()}
                  />
                ))}
              </FormGroup>
            </Grid>

            <Grid item>
              <Typography gutterBottom>Salary Range (×1000)</Typography>
              <Slider
                className={classes.slider}
                value={searchOptions.salary}
                onChange={(e, value) => setSearchOptions({ ...searchOptions, salary: value })}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value * 1000}
              />
            </Grid>

            <Grid item>
              <Typography gutterBottom>Duration (months)</Typography>
              <TextField
                select
                fullWidth
                variant="outlined"
                value={searchOptions.duration}
                onChange={(e) => setSearchOptions({ ...searchOptions, duration: e.target.value })}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <MenuItem key={num} value={num.toString()}>
                    {num === 0 ? "All" : num}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item>
              <Typography gutterBottom>Sort By</Typography>
              <Grid container spacing={2}>
                {["salary", "duration", "rating"].map((field) => (
                  <Grid item xs={12} sm={4} key={field}>
                    <Paper style={{ padding: "10px", background: "rgba(255, 255, 255, 0.1)" }}>
                      <Grid container alignItems="center" justify="space-between">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={searchOptions.sort[field].status}
                              onChange={(e) =>
                                setSearchOptions({
                                  ...searchOptions,
                                  sort: {
                                    ...searchOptions.sort,
                                    [field]: {
                                      ...searchOptions.sort[field],
                                      status: e.target.checked,
                                    },
                                  },
                                })
                              }
                              color="primary"
                            />
                          }
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                        />
                        <IconButton
                          disabled={!searchOptions.sort[field].status}
                          onClick={() =>
                            setSearchOptions({
                              ...searchOptions,
                              sort: {
                                ...searchOptions.sort,
                                [field]: {
                                  ...searchOptions.sort[field],
                                  desc: !searchOptions.sort[field].desc,
                                },
                              },
                            })
                          }
                          color="inherit"
                        >
                          {searchOptions.sort[field].desc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                        </IconButton>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                variant="contained"
                className={classes.applyButton}
                onClick={() => {
                  getData();
                  handleClose();
                }}
                size="large"
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </div>
      </Fade>
    </Modal>
  );
};

const Home = () => {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: { fullTime: false, partTime: false, wfh: false },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: { status: false, desc: false },
      duration: { status: false, desc: false },
      rating: { status: false, desc: false },
    },
  });

  const setPopup = useContext(SetPopupContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const { query, jobType, salary, duration, sort } = searchOptions;
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    Object.entries(jobType).forEach(([key, value]) => {
      if (value) params.append("jobType", key === "wfh" ? "Work From Home" : key.replace(/([A-Z])/g, " $1").trim());
    });
    if (salary[0] !== 0) params.append("salaryMin", salary[0] * 1000);
    if (salary[1] !== 100) params.append("salaryMax", salary[1] * 1000);
    if (duration !== "0") params.append("duration", duration);

    Object.entries(sort).forEach(([key, { status, desc }]) => {
      if (status) params.append(desc ? "desc" : "asc", key);
    });

    axios
      .get(`${apiList.jobs}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setJobs(
          response.data.filter((obj) => new Date(obj.deadline) > new Date())
        );
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
      <Grid container direction="column" alignItems="center" spacing={4}>
        <Grid item style={{ width: "100%", textAlign: "center" }}>
          <Typography variant="h2" className={classes.title}>
            Find Your Dream Job
          </Typography>
        </Grid>

        <Grid item container justify="center" alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Jobs"
              value={searchOptions.query}
              onChange={(e) => setSearchOptions({ ...searchOptions, query: e.target.value })}
              onKeyPress={(e) => e.key === "Enter" && getData()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={getData} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                className: classes.searchField,
              }}
            />
          </Grid>
          <Grid item>
            <IconButton
              className={classes.filterButton}
              onClick={() => setFilterOpen(true)}
            >
              <FilterListIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>

        <Grid item container direction="column" spacing={2} style={{ width: "100%" }}>
          {jobs.length > 0 ? (
            jobs.map((job) => <JobTile key={job._id} job={job} />)
          ) : (
            <Typography variant="h5" style={{ textAlign: "center", color: "#fff" }}>
              No jobs found. Try adjusting your search criteria.
            </Typography>
          )}
        </Grid>
      </Grid>

      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={getData}
      />
    </div>
  );
};

export default Home;
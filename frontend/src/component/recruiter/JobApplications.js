import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  FormControlLabel,
  Checkbox,
  Avatar,
  Zoom,
  Fade,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { SetPopupContext } from "../../App";
import apiList, { server } from "../../lib/apiList";

// Enhanced color palette
const coolColors = {
  primary: "#4776E6",
  secondary: "#8E54E9",
  accent: "#FF6B6B",
  dark: "#1e3c72",
  light: "#f8f9fa",
  success: "#38ef7d",
  warning: "#FFD166",
  danger: "#F25F5C",
  info: "#00F5FF",
  neutral: "#525252",
};

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
    background: `linear-gradient(120deg, #1e3c72 0%, #2a5298 100%)`,
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
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
    },
  },
  jobTileOuter: {
    padding: "25px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(71, 118, 230, 0.15)",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    background: coolColors.light,
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 15px 30px rgba(71, 118, 230, 0.25)",
    },
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(5px)",
  },
  avatar: {
    width: theme.spacing(17),
    height: theme.spacing(17),
    border: `4px solid ${coolColors.primary}`,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  filterButton: {
    backgroundColor: coolColors.primary,
    color: coolColors.light,
    borderRadius: "50%",
    padding: "12px",
    boxShadow: "0 4px 10px rgba(71, 118, 230, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: coolColors.dark,
      transform: "rotate(180deg)",
    },
  },
  chip: {
    margin: "4px",
    background: `linear-gradient(45deg, ${coolColors.primary} 30%, ${coolColors.secondary} 90%)`,
    color: coolColors.light,
    fontWeight: "500",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  modalPaper: {
    padding: "40px",
    outline: "none",
    minWidth: "50%",
    borderRadius: "15px",
    backgroundColor: coolColors.light,
    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
  },
  applyButton: {
    padding: "12px 50px",
    borderRadius: "30px",
    background: `linear-gradient(45deg, ${coolColors.primary} 30%, ${coolColors.secondary} 90%)`,
    color: coolColors.light,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    },
  },
  pageTitle: {
    color: coolColors.light,
    fontWeight: "700",
    marginBottom: "30px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
  },
  applicationCount: {
    backgroundColor: coolColors.secondary,
    color: coolColors.light,
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    marginLeft: "15px",
  },
  checkboxLabel: {
    color: coolColors.dark,
    fontWeight: "500",
  },
  filterContainer: {
    border: `1px solid ${coolColors.secondary}`,
    borderRadius: "8px",
    padding: "8px",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: `0 4px 8px rgba(71, 118, 230, 0.2)`,
    },
  },
  downloadButton: {
    backgroundColor: coolColors.dark,
    color: coolColors.light,
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: coolColors.primary,
    },
  },
  noApplications: {
    color: coolColors.light,
    textAlign: "center",
    marginTop: "50px",
    fontWeight: "500",
  },
}));

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  
  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      className={classes.popupDialog}
      closeAfterTransition
    >
      <Fade in={open}>
        <Paper className={classes.modalPaper}>
          <Typography variant="h4" gutterBottom style={{ color: coolColors.primary, fontWeight: "bold", textAlign: "center" }}>
            Filter Applications
          </Typography>
          
          <Grid container direction="column" alignItems="center" spacing={4}>
            <Grid container item alignItems="center">
              <Grid item xs={3}>
                <Typography variant="h6" className={classes.checkboxLabel}>
                  Application Status
                </Typography>
              </Grid>
              <Grid container item xs={9} justify="space-around">
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rejected"
                        checked={searchOptions.status.rejected}
                        onChange={(event) => {
                          setSearchOptions({
                            ...searchOptions,
                            status: {
                              ...searchOptions.status,
                              [event.target.name]: event.target.checked,
                            },
                          });
                        }}
                        style={{ color: coolColors.danger }}
                      />
                    }
                    label="Rejected"
                    className={classes.checkboxLabel}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="applied"
                        checked={searchOptions.status.applied}
                        onChange={(event) => {
                          setSearchOptions({
                            ...searchOptions,
                            status: {
                              ...searchOptions.status,
                              [event.target.name]: event.target.checked,
                            },
                          });
                        }}
                        style={{ color: coolColors.info }}
                      />
                    }
                    label="Applied"
                    className={classes.checkboxLabel}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="shortlisted"
                        checked={searchOptions.status.shortlisted}
                        onChange={(event) => {
                          setSearchOptions({
                            ...searchOptions,
                            status: {
                              ...searchOptions.status,
                              [event.target.name]: event.target.checked,
                            },
                          });
                        }}
                        style={{ color: coolColors.warning }}
                      />
                    }
                    label="Shortlisted"
                    className={classes.checkboxLabel}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid container item alignItems="center">
              <Grid item xs={3}>
                <Typography variant="h6" className={classes.checkboxLabel}>
                  Sort By
                </Typography>
              </Grid>
              <Grid item container direction="row" xs={9} spacing={2}>
                <Grid
                  item
                  container
                  xs={4}
                  justify="space-around"
                  alignItems="center"
                  className={classes.filterContainer}
                >
                  <Grid item>
                    <Checkbox
                      name="name"
                      checked={searchOptions.sort["jobApplicant.name"].status}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            "jobApplicant.name": {
                              ...searchOptions.sort["jobApplicant.name"],
                              status: event.target.checked,
                            },
                          },
                        })
                      }
                      id="name"
                      style={{ color: coolColors.primary }}
                    />
                  </Grid>
                  <Grid item>
                    <label htmlFor="name">
                      <Typography className={classes.checkboxLabel}>Name</Typography>
                    </label>
                  </Grid>
                  <Grid item>
                    <IconButton
                      disabled={!searchOptions.sort["jobApplicant.name"].status}
                      onClick={() => {
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            "jobApplicant.name": {
                              ...searchOptions.sort["jobApplicant.name"],
                              desc: !searchOptions.sort["jobApplicant.name"].desc,
                            },
                          },
                        });
                      }}
                      style={{ 
                        color: searchOptions.sort["jobApplicant.name"].status ? coolColors.primary : coolColors.neutral
                      }}
                    >
                      {searchOptions.sort["jobApplicant.name"].desc ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
                
                <Grid
                  item
                  container
                  xs={4}
                  justify="space-around"
                  alignItems="center"
                  className={classes.filterContainer}
                >
                  <Grid item>
                    <Checkbox
                      name="dateOfApplication"
                      checked={searchOptions.sort.dateOfApplication.status}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            dateOfApplication: {
                              ...searchOptions.sort.dateOfApplication,
                              status: event.target.checked,
                            },
                          },
                        })
                      }
                      id="dateOfApplication"
                      style={{ color: coolColors.primary }}
                    />
                  </Grid>
                  <Grid item>
                    <label htmlFor="dateOfApplication">
                      <Typography className={classes.checkboxLabel}>Date</Typography>
                    </label>
                  </Grid>
                  <Grid item>
                    <IconButton
                      disabled={!searchOptions.sort.dateOfApplication.status}
                      onClick={() => {
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            dateOfApplication: {
                              ...searchOptions.sort.dateOfApplication,
                              desc: !searchOptions.sort.dateOfApplication.desc,
                            },
                          },
                        });
                      }}
                      style={{ 
                        color: searchOptions.sort.dateOfApplication.status ? coolColors.primary : coolColors.neutral
                      }}
                    >
                      {searchOptions.sort.dateOfApplication.desc ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
                
                <Grid
                  item
                  container
                  xs={4}
                  justify="space-around"
                  alignItems="center"
                  className={classes.filterContainer}
                >
                  <Grid item>
                    <Checkbox
                      name="rating"
                      checked={searchOptions.sort["jobApplicant.rating"].status}
                      onChange={(event) =>
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            "jobApplicant.rating": {
                              ...searchOptions.sort["jobApplicant.rating"],
                              status: event.target.checked,
                            },
                          },
                        })
                      }
                      id="rating"
                      style={{ color: coolColors.primary }}
                    />
                  </Grid>
                  <Grid item>
                    <label htmlFor="rating">
                      <Typography className={classes.checkboxLabel}>Rating</Typography>
                    </label>
                  </Grid>
                  <Grid item>
                    <IconButton
                      disabled={!searchOptions.sort["jobApplicant.rating"].status}
                      onClick={() => {
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            "jobApplicant.rating": {
                              ...searchOptions.sort["jobApplicant.rating"],
                              desc: !searchOptions.sort["jobApplicant.rating"].desc,
                            },
                          },
                        });
                      }}
                      style={{ 
                        color: searchOptions.sort["jobApplicant.rating"].status ? coolColors.primary : coolColors.neutral
                      }}
                    >
                      {searchOptions.sort["jobApplicant.rating"].desc ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
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
      </Fade>
    </Modal>
  );
};

// Enhanced color mappings
const statusColors = {
  applied: coolColors.info,
  shortlisted: coolColors.warning,
  accepted: coolColors.success,
  rejected: coolColors.danger,
  deleted: coolColors.neutral,
  cancelled: coolColors.accent,
  finished: coolColors.secondary,
};

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);

  const appliedOn = new Date(application.dateOfApplication);

  const handleClose = () => {
    setOpen(false);
  };

  const getResume = () => {
    if (application.jobApplicant.resume && application.jobApplicant.resume !== "") {
      const address = `${server}${application.jobApplicant.resume}`;
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          console.log(error);
          setPopup({
            open: true,
            severity: "error",
            message: "Error downloading resume",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume found",
      });
    }
  };

  const updateStatus = (status) => {
    const address = `${apiList.applications}/${application._id}`;
    const statusData = {
      status: status,
      dateOfJoining: new Date().toISOString(),
    };
    axios
      .put(address, statusData, {
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
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  const buttonSet = {
    applied: (
      <>
        <Grid item xs>
          <Button
            className={classes.statusBlock}
            style={{
              background: statusColors["shortlisted"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("shortlisted")}
          >
            Shortlist
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            className={classes.statusBlock}
            style={{
              background: statusColors["rejected"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("rejected")}
          >
            Reject
          </Button>
        </Grid>
      </>
    ),
    shortlisted: (
      <>
        <Grid item xs>
          <Button
            className={classes.statusBlock}
            style={{
              background: statusColors["accepted"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("accepted")}
          >
            Accept
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            className={classes.statusBlock}
            style={{
              background: statusColors["rejected"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("rejected")}
          >
            Reject
          </Button>
        </Grid>
      </>
    ),
    rejected: (
      <>
        <Grid item xs>
          <Paper
            className={classes.statusBlock}
            style={{
              background: statusColors["rejected"],
              color: "#ffffff",
            }}
          >
            Rejected
          </Paper>
        </Grid>
      </>
    ),
    accepted: (
      <>
        <Grid item xs>
          <Paper
            className={classes.statusBlock}
            style={{
              background: statusColors["accepted"],
              color: "#ffffff",
            }}
          >
            Accepted
          </Paper>
        </Grid>
      </>
    ),
    cancelled: (
      <>
        <Grid item xs>
          <Paper
            className={classes.statusBlock}
            style={{
              background: statusColors["cancelled"],
              color: "#ffffff",
            }}
          >
            Cancelled
          </Paper>
        </Grid>
      </>
    ),
    finished: (
      <>
        <Grid item xs>
          <Paper
            className={classes.statusBlock}
            style={{
              background: statusColors["finished"],
              color: "#ffffff",
            }}
          >
            Finished
          </Paper>
        </Grid>
      </>
    ),
  };

  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Paper className={classes.jobTileOuter} elevation={3}>
        <Grid container>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              src={`${server}${application.jobApplicant.profile}`}
              className={classes.avatar}
            />
          </Grid>
          <Grid container item xs={7} spacing={1} direction="column">
            <Grid item>
              <Typography variant="h5" style={{ color: coolColors.dark, fontWeight: "600" }}>
                {application.jobApplicant.name}
              </Typography>
            </Grid>
            <Grid item>
              <Rating
                value={
                  application.jobApplicant.rating !== -1
                    ? application.jobApplicant.rating
                    : null
                }
                readOnly
                size="small"
                style={{ color: coolColors.warning }}
              />
            </Grid>
            <Grid item style={{ color: coolColors.neutral }}>
              <strong>Applied:</strong> {appliedOn.toLocaleDateString()}
            </Grid>
            <Grid item style={{ color: coolColors.neutral }}>
              <strong>Education:</strong>{" "}
              {application.jobApplicant.education
                .map((edu) => {
                  return `${edu.institutionName} (${edu.startYear}-${
                    edu.endYear ? edu.endYear : "Ongoing"
                  })`;
                })
                .join(", ")}
            </Grid>
            <Grid item style={{ color: coolColors.neutral }}>
              <strong>SOP:</strong> {application.sop !== "" ? application.sop : "Not Submitted"}
            </Grid>
            <Grid item>
              {application.jobApplicant.skills.map((skill) => (
                <Chip 
                  label={skill} 
                  className={classes.chip} 
                  key={skill}
                />
              ))}
            </Grid>
          </Grid>
          <Grid item container direction="column" xs={3} spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                className={`${classes.statusBlock} ${classes.downloadButton}`}
                onClick={() => getResume()}
              >
                Download Resume
              </Button>
            </Grid>
            <Grid item container xs>
              {buttonSet[application.status]}
            </Grid>
          </Grid>
        </Grid>
        <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
          <Fade in={open}>
            <Paper
              style={{
                padding: "20px",
                outline: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minWidth: "30%",
                alignItems: "center",
                borderRadius: "15px",
              }}
            >
              <Button
                variant="contained"
                style={{ 
                  padding: "10px 50px",
                  background: `linear-gradient(45deg, ${coolColors.primary} 30%, ${coolColors.secondary} 90%)`,
                  color: coolColors.light,
                  borderRadius: "30px",
                }}
              >
                Submit
              </Button>
            </Paper>
          </Fade>
        </Modal>
      </Paper>
    </Zoom>
  );
};

const JobApplications = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchOptions, setSearchOptions] = useState({
    status: {
      all: false,
      applied: false,
      shortlisted: false,
    },
    sort: {
      "jobApplicant.name": {
        status: false,
        desc: false,
      },
      dateOfApplication: {
        status: true,
        desc: true,
      },
      "jobApplicant.rating": {
        status: false,
        desc: false,
      },
    },
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    let searchParams = [];

    if (searchOptions.status.rejected) {
      searchParams.push(`status=rejected`);
    }
    if (searchOptions.status.applied) {
      searchParams.push(`status=applied`);
    }
    if (searchOptions.status.shortlisted) {
      searchParams.push(`status=shortlisted`);
    }

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          searchParams.push(`desc=${obj}`);
        } else {
          searchParams.push(`asc=${obj}`);
        }
      }
    });
    
    const queryString = searchParams.join("&");
    let address = `${apiList.applicants}?jobId=${jobId}`;
    if (queryString !== "") {
      address = `${address}&${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setApplications(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setApplications([]);
        setLoading(false);
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching applications",
        });
      });
  };

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ 
          padding: "30px", 
          minHeight: "93vh",
          background: `linear-gradient(120deg, #1e3c72 0%, #2a5298 100%)`,
        }}
      >
        <Grid item style={{ marginBottom: "20px" }}>
          <Typography variant="h2" className={classes.pageTitle}>
            Applications
            {applications.length > 0 && (
              <span className={classes.applicationCount}>
                {applications.length}
              </span>
            )}
          </Typography>
        </Grid>
        <Grid item style={{ marginBottom: "30px" }}>
          <IconButton 
            onClick={() => setFilterOpen(true)}
            className={classes.filterButton}
          >
            <FilterListIcon />
          </IconButton>
        </Grid>
        <Grid
          container
          item
          xs
          direction="column"
          style={{ width: "100%" }}
          alignItems="stretch"
          justify="center"
        >
          {loading ? (
            <Typography variant="h5" className={classes.noApplications}>
              Loading applications...
            </Typography>
          ) : applications.length > 0 ? (
            applications.map((obj) => (
              <Grid item key={obj._id}>
                <ApplicationTile application={obj} getData={getData} />
              </Grid>
            ))
          ) : (
            <Typography variant="h5" className={classes.noApplications}>
              No Applications Found
            </Typography>
          )}
        </Grid>
      </Grid>
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
    </>
  );
};

export default JobApplications;
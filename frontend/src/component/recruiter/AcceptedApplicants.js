import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Typography,
  Modal,
  Avatar,
  CircularProgress,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import {
  FilterList as FilterListIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  GetApp as DownloadIcon,
  Star as StarIcon,
  WorkOff as EndJobIcon,
} from "@material-ui/icons";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import { Fade, Zoom, Grow } from "@material-ui/core";

import { SetPopupContext } from "../../App";
import apiList, { server } from "../../lib/apiList";

// Custom hook for fetching data
const useFetchApplications = (searchOptions, setPopup) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let searchParams = [`status=accepted`];

      Object.entries(searchOptions.sort).forEach(([key, value]) => {
        if (value.status) {
          searchParams.push(`${value.desc ? 'desc' : 'asc'}=${key}`);
        }
      });

      const queryString = searchParams.join("&");
      const address = queryString 
        ? `${apiList.applicants}?${queryString}`
        : apiList.applicants;

      const response = await axios.get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setApplications(response.data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch applications");
      setPopup({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to fetch applications",
      });
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [searchOptions, setPopup]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { applications, loading, error, refetch: fetchData };
};

// Custom hook for resume download
const useResumeDownload = (setPopup) => {
  return useCallback(async (resumePath) => {
    if (!resumePath) {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume found",
      });
      return;
    }

    try {
      const address = `${server}${resumePath}`;
      const response = await axios.get(address, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    } catch (error) {
      console.error("Download error:", error);
      setPopup({
        open: true,
        severity: "error",
        message: "Failed to download resume",
      });
    }
  }, [setPopup]);
};

// Enhanced styles using makeStyles
const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
    padding: theme.spacing(4),
    background: "linear-gradient(120deg, #2E3B55 0%, #163670 100%)",
    minHeight: "95vh",
    width: "100%",
    margin: "0",
    overflow: "hidden",
   },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
    margin: theme.spacing(1, 0),
  },
  jobTileOuter: {
    padding: theme.spacing(4),
    margin: theme.spacing(2, 0),
    boxSizing: "border-box",
    width: "100%",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(5px)",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    "&:hover": {
      transform: "translateY(-8px) scale(1.01)",
      boxShadow: "0 15px 40px rgba(31, 38, 135, 0.3)",
      borderColor: "#2E3B55",
    },
  },
  popupDialog: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
  },
  popupPaper: {
    padding: theme.spacing(4),
    borderRadius: 16,
    outline: "none",
    background: "linear-gradient(145deg, #f5f7fa, #e4e7eb)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    minWidth: "300px",
    textAlign: "center",
    animation: "$popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
  },
  "@keyframes popIn": {
    "0%": {
      opacity: 0,
      transform: "scale(0.9)",
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: theme.spacing(0, "auto"),
    border: "4px solid #fff",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  skillChip: {
    margin: theme.spacing(0.5),
    background: "linear-gradient(135deg, #3949ab 0%, #1e3c72 100%)",
    color: "#fff",
    fontWeight: 500,
    boxShadow: "0 2px 5px rgba(57, 73, 171, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(57, 73, 171, 0.5)",
    },
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
    flexDirection: "column",
  },
  loadingText: {
    color: "#fff",
    marginTop: theme.spacing(2),
    animation: "$pulse 1.5s infinite",
  },
  "@keyframes pulse": {
    "0%": { opacity: 0.6 },
    "50%": { opacity: 1 },
    "100%": { opacity: 0.6 },
  },
  actionButton: {
    margin: theme.spacing(1, 0),
    width: "100%",
    borderRadius: 30,
    padding: "10px 20px",
    fontWeight: 600,
    textTransform: "none",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    },
  },
  downloadButton: {
    background: "linear-gradient(45deg, #00acc1 0%, #26c6da 100%)",
    color: "#fff",
    "&:hover": {
      background: "linear-gradient(45deg, #26c6da 0%, #4dd0e1 100%)",
    },
  },
  endJobButton: {
    background: "linear-gradient(45deg, #f44336 0%, #ff5252 100%)",
    color: "#fff",
    "&:hover": {
      background: "linear-gradient(45deg, #ff5252 0%, #ff8a80 100%)",
    },
  },
  rateButton: {
    background: "linear-gradient(45deg, #ff9800 0%, #ffb74d 100%)",
    color: "#fff",
    "&:hover": {
      background: "linear-gradient(45deg, #ffb74d 0%, #ffd54f 100%)",
    },
  },
  filterButton: {
    backgroundColor: "#3949ab",
    color: "#fff",
    borderRadius: "50%",
    padding: theme.spacing(1.5),
    boxShadow: "0 4px 10px rgba(57, 73, 171, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "rotate(180deg)",
      backgroundColor: "#1e3c72",
      boxShadow: "0 6px 15px rgba(57, 73, 171, 0.5)",
    },
  },
  sortOption: {
    border: `1px solid rgba(255, 255, 255, 0.2)`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5),
    margin: theme.spacing(1, 0),
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(5px)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.2)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    },
  },
  sectionTitle: {
    marginBottom: theme.spacing(3),
    fontWeight: 700,
    color: "#ffffff",
    position: "relative",
    display: "inline-block",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: -10,
      left: 0,
      width: "40%",
      height: 4,
      backgroundColor: "#ff9800",
      borderRadius: 2,
    },
  },
  applicantInfo: {
    paddingLeft: theme.spacing(2),
  },
  applicantName: {
    fontWeight: 700,
    color: "#1e3c72",
    marginBottom: theme.spacing(1),
  },
  infoLabel: {
    fontWeight: 600,
    color: "#546e7a",
  },
  infoValue: {
    color: "#37474f",
  },
  paper: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    padding: theme.spacing(4),
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
  modalTitle: {
    color: "#1e3c72",
    fontWeight: 700,
    marginBottom: theme.spacing(3),
  },
  modalButton: {
    borderRadius: 30,
    padding: "10px 25px",
    margin: theme.spacing(1),
    fontWeight: 600,
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    },
  },
  rating: {
    margin: theme.spacing(3, 0),
    "& .MuiRating-iconFilled": {
      color: "#ff9800",
    },
  },
  noEmployeesText: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    padding: theme.spacing(4),
    animation: "$fadeIn 1s ease-in",
  },
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}));

// FilterPopup Component (Enhanced)
const FilterPopup = ({ open, handleClose, searchOptions, setSearchOptions, onApply }) => {
  const classes = useStyles();

  const sortOptions = [
    { key: "jobApplicant.name", label: "Name" },
    { key: "job.title", label: "Job Title" },
    { key: "dateOfJoining", label: "Date of Joining" },
    { key: "jobApplicant.rating", label: "Rating" },
  ];

  const toggleSortOption = (key) => {
    setSearchOptions(prev => ({
      ...prev,
      sort: {
        ...prev.sort,
        [key]: {
          ...prev.sort[key],
          status: !prev.sort[key].status,
        },
      },
    }));
  };

  const toggleSortDirection = (key) => {
    setSearchOptions(prev => ({
      ...prev,
      sort: {
        ...prev.sort,
        [key]: {
          ...prev.sort[key],
          desc: !prev.sort[key].desc,
        },
      },
    }));
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Fade in={open}>
        <Paper className={classes.paper} elevation={3} style={{ minWidth: "50%" }}>
          <Typography variant="h5" className={classes.modalTitle}>Filter and Sort Options</Typography>
          
          <Grid container spacing={3} direction="column">
            <Grid item>
              <Typography variant="subtitle1" style={{ color: "#546e7a", fontWeight: 600 }}>Sort By:</Typography>
              <Grid container spacing={2}>
                {sortOptions.map((option) => (
                  <Grid item xs={12} sm={6} key={option.key}>
                    <Grow in={true} timeout={(sortOptions.indexOf(option) + 1) * 200}>
                      <Paper className={classes.sortOption}>
                        <Grid container alignItems="center" justify="space-between">
                          <Grid item>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={searchOptions.sort[option.key].status}
                                  onChange={() => toggleSortOption(option.key)}
                                  color="primary"
                                />
                              }
                              label={option.label}
                            />
                          </Grid>
                          <Grid item>
                            <Tooltip title="Toggle sort direction">
                              <IconButton
                                disabled={!searchOptions.sort[option.key].status}
                                onClick={() => toggleSortDirection(option.key)}
                                size="small"
                              >
                                {searchOptions.sort[option.key].desc ? (
                                  <ArrowDownwardIcon fontSize="small" />
                                ) : (
                                  <ArrowUpwardIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item container justify="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.modalButton}
                onClick={() => {
                  onApply();
                  handleClose();
                }}
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

// ApplicationTile Component (Enhanced)
const ApplicationTile = ({ application, getData, index }) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [endJobModalOpen, setEndJobModalOpen] = useState(false);
  const [rating, setRating] = useState(application.jobApplicant.rating);
  const downloadResume = useResumeDownload(setPopup);

  const appliedOn = new Date(application.dateOfApplication);
  const formattedDate = appliedOn.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updateRating = async () => {
    try {
      await axios.put(
        apiList.rating,
        { rating: rating, applicantId: application.jobApplicant.userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      setPopup({
        open: true,
        severity: "success",
        message: "Rating updated successfully",
      });
      getData();
      setRatingModalOpen(false);
    } catch (err) {
      console.error("Rating error:", err);
      setPopup({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to update rating",
      });
    }
  };

  const endJob = async () => {
    try {
      await axios.put(
        `${apiList.applications}/${application._id}`,
        { status: "finished", dateOfJoining: new Date().toISOString() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      setPopup({
        open: true,
        severity: "success",
        message: "Job ended successfully",
      });
      getData();
      setEndJobModalOpen(false);
    } catch (err) {
      console.error("End job error:", err);
      setPopup({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to end job",
      });
    }
  };

  const hasRating = application.jobApplicant.rating !== -1;

  return (
    <Grow in={true} timeout={(index + 1) * 300}>
      <Paper className={classes.jobTileOuter} elevation={3}>
        <Grid container spacing={3} alignItems="center">
          {/* Applicant Avatar */}
          <Grid item xs={12} sm={2}>
            <Avatar
              src={`${server}${application.jobApplicant.profile}`}
              className={classes.avatar}
              alt={application.jobApplicant.name}
            />
          </Grid>

          {/* Applicant Information */}
          <Grid item xs={12} sm={7} className={classes.applicantInfo}>
            <Typography variant="h5" className={classes.applicantName}>
              {application.jobApplicant.name}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Rating
                  value={hasRating ? application.jobApplicant.rating : null}
                  readOnly
                  precision={0.5}
                  className={classes.rating}
                  emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.5 }} />}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography>
                  <span className={classes.infoLabel}>Job Title:</span>{" "}
                  <span className={classes.infoValue}>{application.job.title}</span>
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography>
                  <span className={classes.infoLabel}>Role:</span>{" "}
                  <span className={classes.infoValue}>{application.job.jobType}</span>
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography>
                  <span className={classes.infoLabel}>Applied On:</span>{" "}
                  <span className={classes.infoValue}>{formattedDate}</span>
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography>
                  <span className={classes.infoLabel}>SOP:</span>{" "}
                  <span className={classes.infoValue}>{application.sop || "Not Submitted"}</span>
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography gutterBottom className={classes.infoLabel}>Skills:</Typography>
                <div>
                  {application.jobApplicant.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      className={classes.skillChip}
                    />
                  ))}
                </div>
              </Grid>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              className={`${classes.actionButton} ${classes.downloadButton}`}
              startIcon={<DownloadIcon />}
              onClick={() => downloadResume(application.jobApplicant.resume)}
              fullWidth
            >
              Download Resume
            </Button>
            
            <Button
              variant="contained"
              className={`${classes.actionButton} ${classes.endJobButton}`}
              startIcon={<EndJobIcon />}
              onClick={() => setEndJobModalOpen(true)}
              fullWidth
            >
              End Job
            </Button>
            
            <Button
              variant="contained"
              className={`${classes.actionButton} ${classes.rateButton}`}
              startIcon={<StarIcon />}
              onClick={() => setRatingModalOpen(true)}
              fullWidth
            >
              Rate Applicant
            </Button>
          </Grid>
        </Grid>

        {/* Rating Modal */}
        <Modal open={ratingModalOpen} onClose={() => setRatingModalOpen(false)} className={classes.popupDialog}>
          <Paper className={classes.popupPaper}>
            <Typography variant="h6" className={classes.modalTitle}>Rate Applicant</Typography>
            <Rating
              name="applicant-rating"
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              precision={0.5}
              size="large"
              className={classes.rating}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={updateRating}
              className={classes.modalButton}
              fullWidth
            >
              Submit Rating
            </Button>
          </Paper>
        </Modal>

        {/* End Job Confirmation Modal */}
        <Modal open={endJobModalOpen} onClose={() => setEndJobModalOpen(false)} className={classes.popupDialog}>
          <Paper className={classes.popupPaper}>
            <Typography variant="h6" className={classes.modalTitle}>Confirm Job Termination</Typography>
            <Typography paragraph style={{ color: "#546e7a" }}>
              Are you sure you want to end this employment?
            </Typography>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={endJob}
                  className={classes.modalButton}
                >
                  Confirm
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setEndJobModalOpen(false)}
                  className={classes.modalButton}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Modal>
      </Paper>
    </Grow>
  );
};

// Main Component (Enhanced)
const AcceptedApplicants = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    sort: {
      "jobApplicant.name": { status: false, desc: false },
      "job.title": { status: false, desc: false },
      "dateOfJoining": { status: true, desc: true },
      "jobApplicant.rating": { status: false, desc: false },
    },
  });

  const { applications, loading, error, refetch } = useFetchApplications(searchOptions, setPopup);

  const handleApplyFilters = useCallback(() => {
    refetch();
  }, [refetch]);

  const memoizedApplications = useMemo(() => applications, [applications]);

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress size={60} style={{ color: "#fff" }} />
        <Typography variant="h6" className={classes.loadingText}>
          Loading employees...
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.body}>
      <Grid container direction="column" spacing={3}>
        <Grid item container justify="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" className={classes.sectionTitle}>
              Current Employees
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Filter and sort options">
              <IconButton 
                onClick={() => setFilterOpen(true)}
                className={classes.filterButton}
              >
                <FilterListIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid item>
          {error ? (
            <Typography color="error" align="center" style={{ color: "#ff5252", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "10px" }}>
              {error}
            </Typography>
          ) : memoizedApplications.length > 0 ? (
            memoizedApplications.map((application, index) => (
              <ApplicationTile 
                key={application._id} 
                application={application} 
                getData={refetch}
                index={index}
              />
            ))
          ) : (
            <Typography variant="h5" className={classes.noEmployeesText}>
              No current employees found
            </Typography>
          )}
        </Grid>
      </Grid>

      <FilterPopup
        open={filterOpen}
        handleClose={() => setFilterOpen(false)}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default AcceptedApplicants;
import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
  Modal,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";

const useStyles = {
  body: {
   
    height: "inherit",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    minHeight: "100vh",
    padding: "30px",
    width: "100%",
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
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  jobTileOuter: {
    padding: "25px",
    margin: "20px 0",
    width: "100%",
    borderRadius: "15px",
    background: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    transition: "all 0.4s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.5)",
    },
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    marginBottom: "30px",
    fontWeight: "bold",
    background: "linear-gradient(to right, #00d2ff, #3a7bd5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "$gradient 3s ease infinite",
  },
  "@keyframes gradient": {
    "0%": {
      backgroundPosition: "0% 50%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
    },
  },
  chip: {
    marginRight: "8px",
    marginBottom: "8px",
    background: "linear-gradient(45deg, #3a7bd5, #00d2ff)",
    color: "white",
    fontWeight: "bold",
  },
  rateButton: {
    background: "linear-gradient(45deg, #00d2ff 30%, #3a7bd5 90%)",
    color: "white",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 6px 12px rgba(0, 210, 255, 0.4)",
    },
  },
};

const ApplicationTile = ({ application }) => {
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = async () => {
    try {
      const response = await axios.get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRating(response.data.rating);
    } catch (err) {
      setPopup({
        open: true,
        severity: "error",
        message: "Error fetching rating",
      });
    }
  };

  const changeRating = async () => {
    try {
      await axios.put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPopup({
        open: true,
        severity: "success",
        message: "Rating updated successfully",
      });
      fetchRating();
      setOpen(false);
    } catch (err) {
      setPopup({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Error updating rating",
      });
      setOpen(false);
    }
  };

  const colorSet = {
    applied: "#3a7bd5",
    shortlisted: "#FFA500",
    accepted: "#4CAF50",
    rejected: "#FF5252",
    deleted: "#9E9E9E",
    cancelled: "#FF6B6B",
    finished: "#2196F3",
  };

  return (
    <Paper style={useStyles.jobTileOuter} elevation={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Typography variant="h5" style={{ fontWeight: "bold", color: "#1e3c72" }}>
            {application.job.title}
          </Typography>
          <Typography style={{ color: "#555", margin: "5px 0" }}>
            Posted By: {application.recruiter.name}
          </Typography>
          <Typography style={{ color: "#555" }}>
            Role: {application.job.jobType} | Salary: ₹{application.job.salary}/month | 
            Duration: {application.job.duration || "Flexible"} months
          </Typography>
          
          <div style={{ margin: "10px 0" }}>
            {application.job.skillsets.map((skill, index) => (
              <Chip key={index} label={skill} style={useStyles.chip} />
            ))}
          </div>
          
          <Typography style={{ color: "#666" }}>
            Applied On: {appliedOn.toLocaleDateString()}
            {(application.status === "accepted" || application.status === "finished") && 
              ` | Joined On: ${joinedOn.toLocaleDateString()}`}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={3} style={{ display: "flex", flexDirection: "column" }}>
          <Paper style={{
            ...useStyles.statusBlock,
            background: colorSet[application.status],
            color: "white",
            padding: "10px",
            marginBottom: "10px",
          }}>
            {application.status}
          </Paper>
          
          {(application.status === "accepted" || application.status === "finished") && (
            <Button
              variant="contained"
              style={useStyles.rateButton}
              onClick={() => {
                fetchRating();
                setOpen(true);
              }}
            >
              Rate Job
            </Button>
          )}
        </Grid>
      </Grid>

      <Modal open={open} onClose={() => setOpen(false)} style={useStyles.popupDialog}>
        <Paper style={{
          padding: "30px",
          borderRadius: "15px",
          outline: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "300px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}>
          <Typography variant="h6" style={{ marginBottom: "20px", color: "#1e3c72" }}>
            Rate This Job
          </Typography>
          <Rating
            name="job-rating"
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
            style={{ marginBottom: "30px" }}
          />
          <Button
            variant="contained"
            style={useStyles.rateButton}
            onClick={changeRating}
          >
            Submit Rating
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Applications = () => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(apiList.applications, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setApplications(response.data);
      } catch (err) {
        setPopup({
          open: true,
          severity: "error",
          message: "Failed to load applications",
        });
      }
    };
    getData();
  }, [setPopup]);

  return (
    <div style={useStyles.body}>
      <Grid container direction="column" alignItems="center">
        <Typography variant="h3" style={useStyles.title}>
          Your Applications
        </Typography>
        
        <Grid container spacing={3} style={{ width: "100%", maxWidth: "1200px" }}>
          {applications.length > 0 ? (
            applications.map((obj, index) => (
              <Grid item xs={12} key={index}>
                <ApplicationTile application={obj} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h5" style={{ 
                textAlign: "center", 
                color: "white",
                padding: "40px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "15px",
                backdropFilter: "blur(5px)",
              }}>
                No Applications Found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Applications;
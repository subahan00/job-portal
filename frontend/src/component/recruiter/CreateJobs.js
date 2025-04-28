import { useContext, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
  makeStyles,
  Grow,
  Slide,
  Zoom,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  root: {
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    minHeight: "100vh",
    padding: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",               // force viewport width
    overflowX: "hidden",          // hide horizontal overflow
    margin: 0,
         // ensure no unexpected size addition
  }
  ,
  paper: {
    padding: theme.spacing(6),
    maxWidth: 800,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
  },
  heading: {
    fontWeight: 800,
    color: "#ffffff",
    marginBottom: theme.spacing(4),
    letterSpacing: "1.2px",
    textAlign: "center",
    position: "relative",
    textShadow: "0 3px 6px rgba(0,0,0,0.3)",
    '&::after': {
      content: '""',
      position: "absolute",
      bottom: -theme.spacing(2),
      left: "50%",
      transform: "translateX(-50%)",
      width: "100px",
      height: "4px",
      background: "linear-gradient(90deg, #1CB5E0 0%, #000851 100%)",
      borderRadius: 2,
    },
  },
  formControl: {
    marginBottom: theme.spacing(4),
    "& .MuiOutlinedInput-root": {
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: 10,
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.2)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255, 255, 255, 0.4)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1CB5E0",
        boxShadow: "0 0 0 2px rgba(28, 181, 224, 0.3)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      "&.Mui-focused": {
        color: "#1CB5E0",
      },
    },
    "& .MuiInputBase-input": {
      color: "#fff",
    },
    "& .MuiSelect-icon": {
      color: "rgba(255, 255, 255, 0.6)",
    },
  },
  submitButton: {
    marginTop: theme.spacing(4),
    padding: "14px 40px",
    fontWeight: 700,
    fontSize: "16px",
    borderRadius: "30px",
    background: "linear-gradient(to right, #1CB5E0, #000851)",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(28, 181, 224, 0.3)",
    '&:hover': {
      background: "linear-gradient(to right, #000851, #1CB5E0)",
      transform: "translateY(-2px)",
    },
  },
  chipInput: {
    "& .MuiChip-root": {
      background: "linear-gradient(to right, #1CB5E0, #000851)",
      color: "#fff",
    },
    "& .MuiChip-deleteIcon": {
      color: "#fff",
      '&:hover': {
        color: "#ff8a65",
      },
    },
  },
  helperText: {
    color: "rgba(255,255,255,0.6) !important",
  },
  gridItem: {
    '&:hover': {
      transform: "translateY(-2px)",
    },
    transition: "0.3s ease",
  },
}));

const initialJobState = {
  title: "",
  maxApplicants: 100,
  maxPositions: 30,
  deadline: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 16),
  skillsets: [],
  jobType: "Full Time",
  duration: 0,
  salary: 0,
};

const CreateJobs = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [jobDetails, setJobDetails] = useState(initialJobState);

  const handleInput = (key, value) => {
    const parsed = ["maxApplicants", "maxPositions", "duration", "salary"].includes(key)
      ? parseInt(value, 10)
      : value;
    setJobDetails((prev) => ({ ...prev, [key]: parsed }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(apiList.jobs, jobDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPopup({ open: true, severity: "success", message: response.data.message });
      setJobDetails(initialJobState);
    } catch (err) {
      setPopup({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Something went wrong",
      });
      console.error(err);
    }
  };

  return (
    <div className={classes.root}>
      <Grow in timeout={500}>
        <Paper className={classes.paper} elevation={0}>
          <Slide in direction="down" timeout={300}>
            <Typography variant="h4" className={classes.heading}>
              Create a New Job
            </Typography>
          </Slide>

          <Grid container direction="column">
            <Grow in timeout={500}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                autoComplete="off"
                value={jobDetails.title}
                onChange={(e) => handleInput("title", e.target.value)}
                className={classes.formControl}
              />
            </Grow>

            <Grow in timeout={500} style={{ transitionDelay: "100ms" }}>
              <Grid container spacing={3} className={classes.formControl}>
                <Grid item xs={12} sm={8} className={classes.gridItem}>
                  <ChipInput
                    label="Skills"
                    variant="outlined"
                    fullWidth
                    helperText="Press enter to add skills"
                    FormHelperTextProps={{ className: classes.helperText }}
                    value={jobDetails.skillsets}
                    onAdd={(chip) => handleInput("skillsets", [...jobDetails.skillsets, chip])}
                    onDelete={(_, index) => {
                      const updated = jobDetails.skillsets.filter((_, i) => i !== index);
                      handleInput("skillsets", updated);
                    }}
                    className={classes.chipInput}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={classes.gridItem}>
                  <TextField
                    select
                    label="Job Type"
                    variant="outlined"
                    fullWidth
                    value={jobDetails.jobType}
                    onChange={(e) => handleInput("jobType", e.target.value)}
                  >
                    {["Full Time", "Part Time", "Work From Home"].map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grow>

            <Grow in timeout={500} style={{ transitionDelay: "200ms" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} className={classes.gridItem}>
                  <TextField
                    select
                    label="Duration"
                    variant="outlined"
                    fullWidth
                    value={jobDetails.duration}
                    onChange={(e) => handleInput("duration", e.target.value)}
                    className={classes.formControl}
                  >
                    <MenuItem value={0}>Flexible</MenuItem>
                    {[1, 2, 3, 4, 5, 6].map((month) => (
                      <MenuItem key={month} value={month}>
                        {`${month} Month${month > 1 ? "s" : ""}`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.gridItem}>
                  <TextField
                    label="Salary"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={jobDetails.salary}
                    onChange={(e) => handleInput("salary", e.target.value)}
                    inputProps={{ min: 0 }}
                    className={classes.formControl}
                  />
                </Grid>
              </Grid>
            </Grow>

            <Grow in timeout={500} style={{ transitionDelay: "300ms" }}>
              <TextField
                label="Application Deadline"
                type="datetime-local"
                variant="outlined"
                fullWidth
                value={jobDetails.deadline}
                onChange={(e) => handleInput("deadline", e.target.value)}
                InputLabelProps={{ shrink: true }}
                className={classes.formControl}
              />
            </Grow>

            <Grow in timeout={500} style={{ transitionDelay: "400ms" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} className={classes.gridItem}>
                  <TextField
                    label="Maximum Applicants"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={jobDetails.maxApplicants}
                    onChange={(e) => handleInput("maxApplicants", e.target.value)}
                    inputProps={{ min: 1 }}
                    className={classes.formControl}
                  />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.gridItem}>
                  <TextField
                    label="Positions Available"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={jobDetails.maxPositions}
                    onChange={(e) => handleInput("maxPositions", e.target.value)}
                    inputProps={{ min: 1 }}
                    className={classes.formControl}
                  />
                </Grid>
              </Grid>
            </Grow>

            <Zoom in timeout={500} style={{ transitionDelay: "500ms" }}>
              <Button
                variant="contained"
                className={classes.submitButton}
                onClick={handleUpdate}
              >
                Create Job
              </Button>
            </Zoom>
          </Grid>
        </Paper>
      </Grow>
    </div>
  );
};

export default CreateJobs;

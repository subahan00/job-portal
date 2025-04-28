import { useContext, useEffect, useState } from "react";
import { Button, Grid, Typography, Paper, TextField, makeStyles } from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import FileUploadInput from "../lib/FileUploadInput";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";

const useStyles = makeStyles(() => ({
  body: { height: "inherit" },
  inputBox: { marginBottom: 16 },
  popupDialog: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    minHeight: "100vh",
    padding: 30,
  },
  paper: {
    background: "white",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  updateBtn: {
    marginTop: 30,
    padding: "10px 40px",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "white",
    fontWeight: "bold",
    borderRadius: 8,
  },
}));

const MultifieldInput = ({ education, setEducation }) => {
  const classes = useStyles();
  return (
    <>
      {education.map((edu, i) => (
        <Grid container spacing={2} key={i}>
          <Grid item xs={6}>
            <TextField
              label={`Institution #${i + 1}`}
              value={edu.institutionName}
              onChange={(e) => {
                const updated = [...education];
                updated[i].institutionName = e.target.value;
                setEducation(updated);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Start Year"
              type="number"
              value={edu.startYear}
              onChange={(e) => {
                const updated = [...education];
                updated[i].startYear = e.target.value;
                setEducation(updated);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="End Year"
              type="number"
              value={edu.endYear}
              onChange={(e) => {
                const updated = [...education];
                updated[i].endYear = e.target.value;
                setEducation(updated);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
      ))}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setEducation([...education, { institutionName: "", startYear: "", endYear: "" }])}
        style={{ marginTop: 20 }}
      >
        Add Institution
      </Button>
    </>
  );
};

const Profile = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [profileDetails, setProfileDetails] = useState({ name: "", education: [], skills: [], resume: "", profile: "" });
  const [education, setEducation] = useState([{ institutionName: "", startYear: "", endYear: "" }]);

  const handleInput = (key, value) => setProfileDetails({ ...profileDetails, [key]: value });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = () => {
    axios.get(apiList.user, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(({ data }) => {
        setProfileDetails(data);
        setEducation(data.education.length ? data.education : [{ institutionName: "", startYear: "", endYear: "" }]);
      })
      .catch((err) => {
        setPopup({ open: true, severity: "error", message: "Failed to load profile" });
        console.error(err.response?.data);
      });
  };

  const handleUpdate = () => {
    const updated = {
      ...profileDetails,
      education: education.filter((e) => e.institutionName.trim() !== ""),
    };
    axios.put(apiList.user, updated, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(({ data }) => {
        setPopup({ open: true, severity: "success", message: data.message });
        fetchProfile();
      })
      .catch((err) => {
        setPopup({ open: true, severity: "error", message: err.response.data.message });
      });
  };

  return (
    <Grid container className={classes.popupDialog} justifyContent="center">
      <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>Profile</Typography>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <TextField
              label="Name"
              value={profileDetails.name}
              onChange={(e) => handleInput("name", e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item>
            <MultifieldInput education={education} setEducation={setEducation} />
          </Grid>
          <Grid item>
            <ChipInput
              label="Skills"
              variant="outlined"
              value={profileDetails.skills}
              onAdd={(chip) => handleInput("skills", [...profileDetails.skills, chip])}
              onDelete={(chip, index) => {
                const updatedSkills = profileDetails.skills.filter((_, i) => i !== index);
                handleInput("skills", updatedSkills);
              }}
              fullWidth
            />
          </Grid>
          <Grid item>
            <FileUploadInput
              label="Resume (.pdf)"
              icon={<DescriptionIcon />}
              uploadTo={apiList.uploadResume}
              handleInput={handleInput}
              identifier="resume"
            />
          </Grid>
         
        </Grid>
        <Button className={classes.updateBtn} onClick={handleUpdate}>
          Update Details
        </Button>
      </Paper>
    </Grid>
  );
};

export default Profile;

import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "93vh",
    padding: "30px",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    backgroundAttachment: "fixed",
  },
  title: {
    color: "white",
    fontWeight: "600",
    marginBottom: "30px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    animation: "$fadeIn 0.8s ease-in-out",
  },
  profileCard: {
    padding: "40px 30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    background: "white",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
    },
    animation: "$slideUp 0.6s ease-out",
  },
  inputField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 5px 15px rgba(30, 60, 114, 0.2)",
      },
      "&.Mui-focused": {
        borderColor: "#4a00e0",
        boxShadow: "0 5px 20px rgba(74, 0, 224, 0.25)",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1e3c72",
    },
    "& .MuiInputLabel-outlined": {
      color: "#1e3c72",
    },
  },
  bioField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 5px 15px rgba(30, 60, 114, 0.2)",
      },
      "&.Mui-focused": {
        borderColor: "#4a00e0",
        boxShadow: "0 5px 20px rgba(74, 0, 224, 0.25)",
      },
    },
  },
  phoneInput: {
    width: "100%",
    maxWidth: "400px",
    "& .form-control": {
      width: "100% !important",
      borderRadius: "10px !important",
      borderColor: "#1e3c72 !important",
      height: "56px !important",
      fontSize: "16px !important",
      transition: "transform 0.3s ease, box-shadow 0.3s ease !important",
      "&:hover, &:focus": {
        transform: "translateY(-3px)",
        boxShadow: "0 5px 15px rgba(30, 60, 114, 0.2) !important",
        borderColor: "#4a00e0 !important",
      },
    },
  },
  updateButton: {
    marginTop: "40px",
    padding: "12px 50px",
    borderRadius: "30px",
    background: "linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)",
    boxShadow: "0 4px 15px rgba(74, 0, 224, 0.4)",
    color: "white",
    fontWeight: "600",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #3a00c0 0%, #7e1dd2 100%)",
      transform: "translateY(-3px) scale(1.05)",
      boxShadow: "0 8px 25px rgba(74, 0, 224, 0.5)",
    },
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  "@keyframes slideUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(30px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const Profile = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });
  const [phone, setPhone] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProfileDetails(response.data);
        setPhone(response.data.contactNumber.replace("+", ""));
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching profile",
        });
      });
  };

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    const updatedDetails = {
      ...profileDetails,
      contactNumber: phone ? `+${phone}` : "",
    };

    axios
      .put(apiList.user, updatedDetails, {
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
          message: err.response?.data?.message || "Error updating profile",
        });
      });
  };

  const isWordCountValid = (text) => {
    return text.split(" ").filter(word => word !== "").length <= 250;
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.container}
    >
      <Typography variant="h2" className={classes.title}>
        My Profile
      </Typography>
      
      <Paper className={classes.profileCard} elevation={10}>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <TextField
              label="Name"
              value={profileDetails.name}
              onChange={(e) => handleInput("name", e.target.value)}
              variant="outlined"
              fullWidth
              className={classes.inputField}
            />
          </Grid>
          
          <Grid item>
            <TextField
              label="Bio (up to 250 words)"
              multiline
              rows={6}
              variant="outlined"
              fullWidth
              value={profileDetails.bio}
              onChange={(e) => {
                if (isWordCountValid(e.target.value)) {
                  handleInput("bio", e.target.value);
                }
              }}
              className={classes.bioField}
              helperText={`${profileDetails.bio.split(" ").filter(word => word !== "").length}/250 words`}
            />
          </Grid>
          
          <Grid item>
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={setPhone}
              inputClass={classes.phoneInputField}
              containerClass={classes.phoneInput}
              buttonStyle={{ 
                backgroundColor: "#f5f5f5", 
                borderColor: "#1e3c72" 
              }}
            />
          </Grid>
        </Grid>
        
        <Button
          variant="contained"
          className={classes.updateButton}
          onClick={handleUpdate}
        >
          Update Profile
        </Button>
      </Paper>
    </Grid>
  );
};

export default Profile;
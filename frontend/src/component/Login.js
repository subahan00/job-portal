import { useContext, useState } from "react";
import { 
  Grid, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Fade,
  Zoom 
} from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "84.7vh",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(3),
    width: "100%",
  },
  paper: {
    padding: "40px",
    borderRadius: "15px",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    maxWidth: "450px",
    width: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.5)",
    },
  },
  title: {
    color: "#1e3c72",
    fontWeight: "bold",
    marginBottom: theme.spacing(4),
    textAlign: "center",
  },
  inputField: {
    width: "100%",
    marginBottom: theme.spacing(3),
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.8)",
    },
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: "0 5px 8px 2px rgba(33, 203, 243, .4)",
    },
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [loggedin, setLoggedin] = useState(isAuth());
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: { error: false, message: "" },
    password: { error: false, message: "" },
  });

  const handleInput = (key, value) => {
    setLoginDetails(prev => ({ ...prev, [key]: value }));
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler(prev => ({ ...prev, [key]: { error: status, message } }));
  };

  const handleLogin = async () => {
    const verified = !Object.values(inputErrorHandler).some(field => field.error);
    if (!verified) {
      setPopup({ open: true, severity: "error", message: "Incorrect Input" });
      return;
    }

    try {
      const response = await axios.post(apiList.login, loginDetails);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("type", response.data.type);
      setLoggedin(isAuth());
      setPopup({
        open: true,
        severity: "success",
        message: "Logged in successfully",
      });
    } catch (err) {
      setPopup({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Login failed",
      });
    }
  };

  if (loggedin) return <Redirect to="/" />;

  return (
    <div className={classes.root}>
      <Zoom in={true}>
        <Paper elevation={3} className={classes.paper}>
          <Fade in={true} timeout={500}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Typography variant="h3" className={classes.title}>
                  Welcome Back
                </Typography>
              </Grid>
              
              <Grid item>
                <EmailInput
                  label="Email"
                  value={loginDetails.email}
                  onChange={(e) => handleInput("email", e.target.value)}
                  inputErrorHandler={inputErrorHandler}
                  handleInputError={handleInputError}
                  className={classes.inputField}
                />
              </Grid>
              
              <Grid item>
                <PasswordInput
                  label="Password"
                  value={loginDetails.password}
                  onChange={(e) => handleInput("password", e.target.value)}
                  className={classes.inputField}
                />
              </Grid>
              
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleLogin}
                  className={classes.submitButton}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Fade>
        </Paper>
      </Zoom>
    </div>
  );
};

export default Login;
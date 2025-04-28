import { AppBar, Toolbar, Typography, Button, makeStyles, Avatar } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles(() => ({
  appBar: {
    background: "rgba(10, 43, 103, 0.8)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
    
  },
  title: {
    flexGrow: 1,
    fontWeight: "bold",
    fontSize: "2rem",
    letterSpacing: "1.5px",
    background: "linear-gradient(45deg, #00eaff 0%, #0084ff 50%, #a162e8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 8px rgba(0, 234, 255, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      textShadow: "0 0 15px rgba(0, 234, 255, 0.5)",
      transform: "scale(1.01)",
    },
  },
  button: {
    color: "#00eaff",
    marginLeft: "15px",
    fontWeight: "600",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(0, 234, 255, 0.1)",
      transform: "scale(1.1)",
      boxShadow: "0 0 15px rgba(0, 234, 255, 0.2)",
    },
  },
  avatar: {
    width: "42px",
    height: "42px",
    marginLeft: "15px",
    cursor: "pointer",
    border: "2px solid rgba(0, 234, 255, 0.5)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: "0 0 15px rgba(0, 234, 255, 0.4)",
      borderColor: "#00eaff",
    },
  },
  "@keyframes slideDown": {
    "0%": { transform: "translateY(-100%)", opacity: 0 },
    "100%": { transform: "translateY(0)", opacity: 1 },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const history = useHistory();

  // Get profile picture filename from localStorage or use default
  const profilePicFilename = localStorage.getItem("profilePic") || "default.png";
  const profilePicPath = `/profile/${profilePicFilename}`;

  const handleClick = (location) => {
    history.push(location);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          JobVerse
        </Typography>
        {isAuth() ? (
          userType() === "recruiter" ? (
            <>
              <Button className={classes.button} onClick={() => handleClick("/home")}>Home</Button>
              <Button className={classes.button} onClick={() => handleClick("/addjob")}>Add Jobs</Button>
              <Button className={classes.button} onClick={() => handleClick("/myjobs")}>My Jobs</Button>
              <Button className={classes.button} onClick={() => handleClick("/employees")}>Employees</Button>
              <Avatar 
                src={profilePicPath} 
                className={classes.avatar} 
                onClick={() => handleClick("/profile")}
              />
              <Button className={classes.button} onClick={() => handleClick("/logout")}>Logout</Button>
            </>
          ) : (
            <>
              <Button className={classes.button} onClick={() => handleClick("/home")}>Home</Button>
              <Button className={classes.button} onClick={() => handleClick("/applications")}>Applications</Button>
              <Avatar 
                src={profilePicPath} 
                className={classes.avatar} 
                onClick={() => handleClick("/profile")}
              />
              <Button className={classes.button} onClick={() => handleClick("/logout")}>Logout</Button>
            </>
          )
        ) : (
          <>
            <Button className={classes.button} onClick={() => handleClick("/login")}>Login</Button>
            <Button className={classes.button} onClick={() => handleClick("/signup")}>Signup</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
import { 
  Grid, 
  Typography, 
  Button, 
  Fade, 
  Zoom, 
  Slide, 
  Grow,
  Card,
  CardContent,
  Icon
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    overflow: "hidden",
    minHeight: "73vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)", // Updated
    width: "100%",
  },
  
  container: {
    padding: theme.spacing(8),
    height: "100%",
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4),
    },
  },
  title: {
    fontWeight: 800,
    background: "linear-gradient(45deg, #1e3c72, #2a5298)", // Updated
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 20px rgba(30, 60, 114, 0.5)", // Soft glow matching the new color
    marginBottom: theme.spacing(4),
    textAlign: "center",
  },
  
  subtitle: {
    color: "#ffffff",
    marginBottom: theme.spacing(6),
    maxWidth: "700px",
    textAlign: "center",
    opacity: 0.9,
  },
  button: {
    color: "#ffffff",
    background: "linear-gradient(45deg, #1e3c72, #2a5298)", // Updated
    padding: "12px 36px",
    fontSize: "1.1rem",
    fontWeight: 600,
    borderRadius: "50px",
    boxShadow: "0 4px 15px rgba(30, 60, 114, 0.4)", // Matching shadow
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 7px 20px rgba(30, 60, 114, 0.6)", // Hover effect matching
    },
  },

  featureCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: theme.spacing(4),
    margin: theme.spacing(2),
    maxWidth: "300px",
    textAlign: "center",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    "&:hover": {
      transform: "translateY(-10px)",
      background: "rgba(255, 255, 255, 0.15)",
      boxShadow: "0 10px 30px rgba(255, 127, 179, 0.2)",
    },
  },
  errorIcon: {
    fontSize: "6rem",
    color: "#FF6347", // Updated error icon color
    marginBottom: theme.spacing(4),
    animation: "$shake 0.5s ease-in-out",
  },
  featureIcon: {
  fontSize: "3rem",
  marginBottom: theme.spacing(2),
  background: "linear-gradient(45deg, #1e3c72, #2a5298)", // Updated
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
},

  "@keyframes shake": {
    "0%, 100%": { transform: "translateX(0)" },
    "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
    "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
  },
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-15px)" },
    "100%": { transform: "translateY(0px)" },
  },
  floating: {
    animation: "$float 3s ease-in-out infinite",
  },
}));

const Welcome = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const features = [
    {
      title: "Smart Matching",
      description: "AI-powered job matching tailored to your skills",
      icon: "auto_awesome",
    },
    {
      title: "Instant Apply",
      description: "One-click application to thousands of jobs",
      icon: "bolt",
    },
    {
      title: "Career Growth",
      description: "Personalized career path recommendations",
      icon: "trending_up",
    },
  ];

  return (
    <div className={classes.root}>
      <Grid
        container
        className={classes.container}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Fade in={true} timeout={1000}>
          <Grid item>
            <Typography variant="h2" className={classes.title}>
              Welcome to JobVerse
            </Typography>
          </Grid>
        </Fade>

        <Slide in={true} direction="up" timeout={800}>
          <Grid item>
            <Typography variant="h5" className={classes.subtitle}>
              Your gateway to the universe of career opportunities. 
              Discover, apply, and grow with our cutting-edge platform.
            </Typography>
          </Grid>
        </Slide>

        <Zoom in={true} timeout={1000} style={{ transitionDelay: '500ms' }}>
          <Grid item>
            <Button 
              className={classes.button}
              onClick={() => history.push(isAuth() ? "/home" : "/signup")}
            >
              {isAuth() ? "Go to Dashboard" : "Get Started"}
            </Button>
          </Grid>
        </Zoom>

        <Grid container item justify="center" style={{ marginTop: "60px" }}>
          {features.map((feature, index) => (
            <Grow 
              in={true} 
              timeout={1000} 
              style={{ transitionDelay: `${300 * index}ms` }}
              key={feature.title}
            >
              <Grid item xs={12} sm={4}>
                <Card className={classes.featureCard}>
                  <CardContent>
                    <Icon 
                      className={`${classes.featureIcon} ${classes.floating}`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {feature.icon}
                    </Icon>
                    <Typography variant="h5" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grow>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export const ErrorPage = (props) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <Grid
        container
        className={classes.container}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Zoom in={true} timeout={500}>
          <Typography variant="h1" className={classes.errorIcon}>
            404
          </Typography>
        </Zoom>

        <Fade in={true} timeout={800}>
          <Typography variant="h2" className={classes.title} style={{ marginBottom: "20px" }}>
            Oops! Lost in Space
          </Typography>
        </Fade>

        <Slide in={true} direction="up" timeout={1000}>
          <Typography variant="h5" className={classes.subtitle}>
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to the JobVerse!
          </Typography>
        </Slide>

        <Zoom in={true} timeout={1200}>
          <Button 
            className={classes.button}
            onClick={() => history.push("/")}
            style={{ marginTop: "40px" }}
          >
            Return Home
          </Button>
        </Zoom>
      </Grid>
    </div>
  );
};

export default Welcome;

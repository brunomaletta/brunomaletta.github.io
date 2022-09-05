import { Avatar  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProfilePhoto from '../assets/profile.jpg';

const useStyles = makeStyles((theme) => ({
    large: {
      transform: "translate3d(0,-50%,0)",
      marginLeft: "auto",
      marginRight: "auto",
      position: "absolute",
      left: 0,
      right: 0,
      textAlign: "center",
      width: theme.spacing(26),
      height: theme.spacing(26),
    },
}));

function AvatarComponent() {
    const classes = useStyles();

    return (
        <Avatar src={ProfilePhoto} alt="Profile Photo" className={classes.large}/>
    );
}

export default AvatarComponent;

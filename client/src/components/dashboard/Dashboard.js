import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';

class Dashboard extends React.Component {

  componentDidMount(){
    this.props.getCurrentProfile();
  }

  render() {

    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if(profile === null || loading){
      dashboardContent = (
        <div>
          <p class="lead text-muted">
            Welcome { user.name }
          </p>
          <p>You have not yet set up a profile. Please add some info.</p>
          <Link to="/create-profile" className="btn btn-lg btn-info">Create Profile</Link>
        </div>
      )
    }else {
        dashboardContent = <h4>Display Profile</h4>
    }

    return(
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
                {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    )

  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(withRouter(Dashboard));

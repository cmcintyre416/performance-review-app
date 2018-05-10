import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route, Link
} from 'react-router-dom';

import Home from './components/Home';
import PerformanceReviews from './components/PerformanceReviews';
import AdminDashboard from './components/AdminDashboard';
import * as firebase from 'firebase';

//For this application I hope to add authentication. I currently do not have the performance review section sorted by name of required reviewers. Once authentication is added there will be an account strictly for the administrator. If the administrator is signed in, they will be able to access the dashboard. If you are signed in as an employee then your name would filter the required reviews and personalize your review page. Once the review is submitted my plan is to generat another section on the dashboard that shows completed reviews by name. This is currently planned to be an internal application a company would use. For demonstration purposes it is difficult to add authentication. If i created this as a more dynamic application, the user could create a company that they could then invite their employees to join. If the user had joined the company, only the unique company performance reviews would be pushed to that person.

class App extends React.Component {
  constructor(){
    super();

    this.state ={
      currentReviews: [],
      submittedReviews: [],
    }
  }


  componentDidMount() {
    firebase.database().ref().on('value', (res) => {
    });

    firebase.database().ref('reviews').on('value', (review) => {
      const reviewArray = [];
      const userDataForReview = review.val();

      for (let reviewKey in userDataForReview) {
        userDataForReview[reviewKey].key = reviewKey;
        reviewArray.push(userDataForReview[reviewKey])
      }

      this.setState({
        currentReviews: reviewArray
      })
    });
  }


  getNewReviewInput(review){
    console.log(review);
  }


    render() {
      return (
        <Router>
        <div>
          <header className="main__header">
              <nav className="main__nav">
                <ul className="main__navList">
                <li className="main__navListItem">
                  <Link className="main__navLink" to={`/`}>Home</Link>
                </li>
                <li className="main__navListItem">
                  <Link className="main__navLink" to={`/reviews`}>Reviews</Link>
                </li>
                <li className="main__navListItem">
                  <Link className="main__navLink" to={`/dashboard`}>Dashboard</Link>
                </li>
                <li className="admin__navLink">
                  <button>Sign In</button>
                </li>
              </ul>
            </nav>     
          </header>
          <Route
            path="/"
            exact
            render={(props) => {
              return (
                <Home
                  {...props}
                />);
            }
            }
          />
          <Route
            path="/reviews"
            exact
            render={(props) => {
              return (
                <PerformanceReviews
                  {...props}
                  handleReviewSubmit={this.handleReviewSubmit}
                  currentReviews={this.state.currentReviews}
                  getNewReviewInput={this.getNewReviewInput}
                />);
            }
            }
          />
          <Route
            path="/dashboard"
            exact
            render={(props) => {
              return (
                <AdminDashboard
                  {...props}
                  getCurrentReviewsToDisplay={this.getCurrentReviewsToDisplay}
                />);
            }
            }
          />
        </div>

      </Router>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

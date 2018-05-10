import React from 'react';
import {
    BrowserRouter as Router,
    Route, Link
} from 'react-router-dom';
import ManageEmployees from './adminComponents/ManageEmployees';
import ManageReviews from './adminComponents/ManageReviews';
import DashboardHome from './adminComponents/DashboardHome';
import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBW1lAunHcaTq22qlI9BPZ37aqCQYGpIIw",
    authDomain: "performance-review-app.firebaseapp.com",
    databaseURL: "https://performance-review-app.firebaseio.com",
    projectId: "performance-review-app",
    storageBucket: "",
    messagingSenderId: "997925156501"
};
firebase.initializeApp(config);

// All the information stems from this admin page. The state for each user will have to live here. Then it can be passed up to the app component when a user signs in.

class AdminDashboard extends React.Component {
    constructor() {
        super();

        this.state = {
            savedEmployees: [],
            savedReviews: [],
            selectedReviewIndex: '',
            selectedEmployeeActive: false,
            selectedReviewActive: false,
            currentReviewSelection: [],
            currentEmployeeSelection: [],
            editingEmployee: false,
            editingEmployeeKey: '',
            editingReview: false,
            editingReviewKey: '',
        }
        this.getNewEmployeePayload = this.getNewEmployeePayload.bind(this);
        this.getNewReviewPayload = this.getNewReviewPayload.bind(this);
        this.handleRequiredEmployeeSubmit = this.handleRequiredEmployeeSubmit.bind(this);
        this.handleSelectionReview = this.handleSelectionReview.bind(this);
        this.viewReview = this.viewReview.bind(this);
        this.handleSelectionEmployee = this.handleSelectionEmployee.bind(this);
        this.viewEmployee = this.viewEmployee.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.removeReview = this.removeReview.bind(this);
        this.removeEmployee = this.removeEmployee.bind(this);
        this.renderEmployeeView = this.renderEmployeeView.bind(this);
        this.saveUpdatedEmployee = this.saveUpdatedEmployee.bind(this);
        this.saveUpdatedReview = this.saveUpdatedReview.bind(this);
        this.displayRequiredEmployeesOnClick = this.displayRequiredEmployeesOnClick.bind(this);
    }

    componentDidMount() {
        
        firebase.database().ref('employees').on('value', (employee) => {
            const employeeArray = [];
            const userDataForEmployee = employee.val();

            for (let employeeKey in userDataForEmployee) {
                userDataForEmployee[employeeKey].key = employeeKey;
                employeeArray.push(userDataForEmployee[employeeKey])
            } 

            this.setState({
                savedEmployees: employeeArray
            })
        });

        firebase.database().ref('reviews').on('value', (review) => {
            const reviewArray = [];
            const userDataForReview = review.val();

            for (let reviewKey in userDataForReview) {
                userDataForReview[reviewKey].key = reviewKey;
                reviewArray.push(userDataForReview[reviewKey])
            } 

            this.setState({
                savedReviews: reviewArray
            })
        });

    }

    getNewEmployeePayload(employeePayload) {
        const dbEmployee = firebase.database().ref('employees');
        dbEmployee.push(employeePayload);
        
    }

    handleSelectionEmployee(employeeId) {
        const employeeIdToSelect = employeeId;

        const employeeSelected = this.state.savedEmployees.find(function (selected) { return selected.key === employeeIdToSelect; });

        this.setState({
            selectedEmployeeActive: true,
            currentEmployeeSelection: employeeSelected
        });

        if(this.state.editingEmployeeKey != this.state.currentEmployeeSelection.key){
            this.setState({
                editingEmployee: false,
            });
        }

    }

    saveUpdatedEmployee(e) {
        e.preventDefault();

        const currentEditingKey = this.state.currentEmployeeSelection.key;

        this.setState({
            editingEmployeeKey: currentEditingKey
        });

        const dbRef = firebase.database().ref(`employees/${currentEditingKey}`);
        dbRef.update({
            name: document.getElementById('editingName').value,
            jobTitle: document.getElementById('editingJobTitle').value,
            email: document.getElementById('editingEmail').value
        });

        this.setState({
            editingEmployee: false
        });
    }

    renderEmployeeView(){
        const employeeKey = this.state.currentEmployeeSelection.key;

        const displaySelectedEmployee = this.state.savedEmployees.find(function (selected) { return selected.key === employeeKey; });

        let editingTemp = (
            <div>
                <h3 className="viewEmployee__title">{displaySelectedEmployee.name}</h3>
                <p><span className="viewEmployee__subBold">Job Title:</span>  {displaySelectedEmployee.jobTitle}</p>
                <p><span className="viewEmployee__subBold">Email:</span> {displaySelectedEmployee.email}</p>
            </div>
        )
        if(this.state.editingEmployee) {
            editingTemp = (
                <form onSubmit={this.saveUpdatedEmployee}>
                    <div>
                        <input 
                            type="text" 
                            defaultValue={displaySelectedEmployee.name}
                            name="name"
                            id="editingName"
                        />
                    </div>
                    <div>
                        <input 
                            type="text" 
                            defaultValue={displaySelectedEmployee.jobTitle}
                            name="jobTitle" 
                            id="editingJobTitle"
                        />
                    </div>
                    <div>
                        <input 
                            type="text" 
                            defaultValue={displaySelectedEmployee.email} 
                            name="email"
                            id="editingEmail"
                        />
                    </div>
                    <input type="submit" value="Update Changes"/>
                </form>
            )
        }
        return (
        <div>
            {editingTemp}
            <button
                onClick={this.removeEmployee}
            >
                Remove Employee
                    </button>
            <button
                onClick={() => this.setState({ editingEmployee: true })}
            >
                Edit Employee Information
                    </button>
        </div>
        )
    }

    viewEmployee() {
        if (this.state.selectedEmployeeActive === false) {
            return (
                <div className="review__default">
                    <p>Please Select A Employee</p>
                </div>
            )
        } else {
            return (
                <div className="review__viewBox">
                    {this.renderEmployeeView()}
                </div>
            )
        }
    }

    getNewReviewPayload(reviewPayload) {
        const dbReview = firebase.database().ref('reviews');
        dbReview.push(reviewPayload);
    }


    handleSelectionReview(reviewId) {
        const reviewIdToSelect = reviewId;

        const reviewSelected = this.state.savedReviews.find(function (selected) { return selected.key  === reviewIdToSelect; });

        this.setState({
            selectedReviewActive: true,
            currentReviewSelection: reviewSelected
        });

        if (this.state.editingReviewKey != this.state.currentReviewSelection.key) {
            this.setState({
                editingReview: false,
            });
        }

        this.clearForm();
    }

    saveUpdatedReview(e) {
        e.preventDefault();

        const currentEditingKey = this.state.currentReviewSelection.key;

        this.setState({
            editingReviewKey: currentEditingKey
        });

        const dbRef = firebase.database().ref(`reviews/${currentEditingKey}`);
        dbRef.update({
            name: document.getElementById('editingName').value,
            notes: document.getElementById('editingNotes').value,
        });

        this.setState({
            editingReview: false
        });
    }

    renderReviewView(){
        const reviewKey = this.state.currentReviewSelection.key;

        const displaySelectedReview = this.state.savedReviews.find(function (selected) { return selected.key === reviewKey; });

        let editingTemp = (
            <div>
                <h3>{displaySelectedReview.name}</h3>
                <p>{displaySelectedReview.notes}</p>
            </div>
        )
        if (this.state.editingReview) {
            editingTemp = (
                <form onSubmit={this.saveUpdatedReview}>
                    <div>
                        <input
                            type="text"
                            defaultValue={displaySelectedReview.name}
                            name="name"
                            id="editingName"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            defaultValue={displaySelectedReview.notes}
                            name="notes"
                            id="editingNotes"
                        />
                    </div>
                    <input type="submit" value="Update Changes" />
                </form>
            )
        }
        return (
            <div>
                {editingTemp}
                <button
                    onClick={() => this.setState({ editingReview: true })}
                >
                    Edit Review Information
                    </button>
            </div>
        )
    }

    viewReview() {
        if (this.state.selectedReviewActive === false) {
            return (
                <div className="review__default">
                    <p>Please Select A Review</p>
                </div>
            )
        } else {
            return (
                <div className="review__viewBox">
                   {this.renderReviewView()}
                    <form id='review__employeeSelectionForm' 
                        onSubmit={this.handleRequiredEmployeeSubmit}
                    >
                    <h4>Require Review</h4>
                        <div className="review__employeeSelectionOverflow">
                        {this.state.savedEmployees.map((employee, i) => {
                            return (
                                <div key={`employee-${i}`}>
                                    <label htmlFor="employeeSelection">{employee.name}</label>
                                    <input
                                        id="employeeSelection"
                                        name='employeeSelection' type="checkbox" value={employee.name} />
                                </div>
                            )
                        })}
                        </div>
                        <button
                            type="submit">
                            Require Review For Selected Employees
                        </button>
                    </form>
                    <button
                        onClick={this.removeReview}
                    >Remove Review</button>
                </div>
            )
        }
    }

    removeReview(){
        const reviewIdToRemove = this.state.currentReviewSelection.key;
        const dbRef = firebase.database().ref(`reviews/${reviewIdToRemove}`);
        dbRef.remove();

        this.setState({
            selectedReviewActive: false,
        })
    }

    removeEmployee(){
        const employeeIdToRemove = this.state.currentEmployeeSelection.key;
        const dbRef = firebase.database().ref(`employees/${employeeIdToRemove}`);
        dbRef.remove();

        this.setState({
            selectedEmployeeActive: false,
        })
    }

    handleRequiredEmployeeSubmit(e) {
        e.preventDefault();

        const employeeSelection = document.getElementsByName('employeeSelection');
        const sendCurrentSubmittedKey = this.state.currentReviewSelection.key;

        let arrayOfRequired = [];

        for (let i = 0; i < employeeSelection.length; i++) {
            if (employeeSelection[i].checked === true) {
                arrayOfRequired.push(employeeSelection[i].value);
            }
        }

        const dbRef = firebase.database().ref(`reviews/${sendCurrentSubmittedKey}/requiredReviewers`);

        dbRef.push(arrayOfRequired);
        
        this.clearForm();

    }

    displayRequiredEmployeesOnClick(employeeId) {

    }

    clearForm() {
        if (this.state.selectedReviewActive === true) {
            document.getElementById('employeeSelectionForm').reset();
        }
    }
    

    render() {
        return (
            <div className="wrapper">
                <Router>
                    <div>
                        <nav className="admin__nav">
                            <ul className="admin__navList">
                                <li>
                                    <Link 
                                    className="admin__navLink"
                                    to={`/dashboard`}>Dashboard</Link>
                                </li>
                                <li>
                                    <Link 
                                    className="admin__navLink"
                                    to={`/ManageReviews`}>Add Review</Link>
                                </li>
                                <li>
                                    <Link 
                                    className="admin__navLink"
                                    to={`/ManageEmployees`}>Add Employee</Link>
                                </li>
                            </ul>
                        </nav>
                        <Route
                            path="/dashboard"
                            exact
                            render={(props) => {
                                return (
                                    <DashboardHome
                                        {...props}
                                        savedEmployees = {this.state.savedEmployees}
                                        viewEmployee={this.viewEmployee}
                                        handleSelectionEmployee={this.handleSelectionEmployee}
                                        savedReviews = {this.state.savedReviews}
                                        viewReview = {this.viewReview}
                                        handleSelectionReview={this.handleSelectionReview}
                                    />);
                            }
                            }
                        />
                        <Route
                            path="/ManageEmployees"
                            exact
                            render={(props) => {
                                return (
                                    <ManageEmployees
                                        {...props}
                                        getNewEmployeePayload = {this.getNewEmployeePayload}
                                    />);
                            }
                            }
                        />
                        <Route
                            path="/ManageReviews"
                            exact
                            render={(props) => {
                                return (
                                    <ManageReviews
                                        {...props}
                                        getNewReviewPayload = {this.getNewReviewPayload}
                                    />);
                            }
                            }
                            />
                    </div>
                </Router>
            </div>
        )
    }
}

export default AdminDashboard;
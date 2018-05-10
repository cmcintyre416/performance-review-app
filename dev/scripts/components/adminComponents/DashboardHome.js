import React from 'react';

function searchingFor(search) {
    return function (x) {
        return x.name.toLowerCase().includes(search.toLowerCase()) || !search;
    }
}

export default class DashboardHome extends React.Component {
    constructor(){
        super();
        
        this.state = {
            employeeSearch: '',
            reviewSearch: ''
        }
        
        this.searchHandlerEmployee = this.searchHandlerEmployee.bind(this);
        this.searchHandlerReview = this.searchHandlerReview.bind(this);
        
    }

    searchHandlerReview(e) {
        this.setState({
            reviewSearch: e.target.value
        })
    }
    searchHandlerEmployee(e) {
        this.setState({
            employeeSearch: e.target.value
        })
    }

    render() {
        return (
            <div className="dashboard__wrapper">
                <div>
                    <h1>Dashboard Home</h1>
                </div>
                <div className="review__wrapper">
                    <h2>Employees</h2>
                    <div className="review__innerWrapper">
                        <div className="review__selectionBox">
                            <div className="review__searchBar"><input id="searchBar" type="text" placeholder="Find Someone" value={this.state.employeeSearch} onChange={this.searchHandlerEmployee}/>
                            </div>
                            <div className="review__selectionOverflowContainer">
                                {this.props.savedEmployees.filter(searchingFor(this.state.employeeSearch)).map((employee, i) => {
                                    return (
                                        <div
                                            className="review__option"
                                            key={`employee-${i}`}
                                            onClick={() => this.props.handleSelectionEmployee(employee.key)}
                                        >
                                            <h3>{employee.name}</h3>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {this.props.viewEmployee()}
                    </div>
                </div>
                <div className="review__wrapper">
                    <h2>Reviews</h2>
                    <div className="review__innerWrapper">
                        <div className="review__selectionBox">
                            <div className="review__searchBar"><input id="searchBar" type="text" placeholder="Find Someone" value={this.state.reviewSearch} onChange={this.searchHandlerReview}/>
                            </div>
                            <div className="review__selectionOverflowContainer">
                                {this.props.savedReviews.filter(searchingFor(this.state.reviewSearch)).map((review, i) => {
                                    return (
                                        <div
                                            className="review__option" 
                                            key={`review-${i}`}
                                            review={review}
                                            onClick={() => this.props.handleSelectionReview(review.key)}
                                        >
                                            <h3>Review for: {review.name}</h3>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {this.props.viewReview()}
                    </div>
                </div> 
            </div>
        )
    }
}
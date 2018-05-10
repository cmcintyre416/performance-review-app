import React from 'react';

export default class PerformanceReviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            review: {
                name:'',
                review: '',
            },
            submitted: false
        }
        this.updateForm = this.updateForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getCurrentReviewsToDisplay = this.getCurrentReviewsToDisplay.bind(this);
    }

    updateForm(key, value) {
        const { review } = this.state;
        const reviewInput = review;
        reviewInput[key] = value;

        this.setState({
            review: reviewInput,
            submitted: false
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const newReview = this.state.review;
        this.props.getNewReviewInput(newReview);
        const sendReviewInput = newReview.review;
        console.log(this);
    }

    getCurrentReviewsToDisplay() {
        return (
            <div classnName="performanceReviews__wrapper">
                {this.props.currentReviews.map((review, i) => {
                    return (
                        <div
                            key={`review-${i}`}
                            className="performanceReviews__review"
                        >
                            <p className="performanceReview__name">
                                {review.name}
                            </p>
                            <p>
                                {review.notes}
                            </p>
                            <form action=""             id="performanceReviewForm">
                                <label 
                                id="reviewName"
                                htmlFor="name">Please Enter Review for {review.name}</label>
                                <textarea
                                    rows="10"
                                    type="text"
                                    onChange={(e) => this.updateForm('review', e.target.value)}
                                />
                                <button
                                    onClick={this.handleSubmit.bind(this)}
                                    type="submit">
                                    Create New Review
                                </button>
                            </form>
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        return (
            <div>
                <div>
                    <h1>Performance Reviews</h1>
                </div>
                <div>
                    {this.getCurrentReviewsToDisplay()}
                </div>
            </div>
        )
    }
}
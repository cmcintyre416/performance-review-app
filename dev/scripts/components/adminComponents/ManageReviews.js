import React from 'react';

class ManageReviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            review: {
                name: '',
                notes: ''
            },
            submitted: false
        }
        this.renderReviewName = this.renderReviewName.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        this.props.getNewReviewPayload(newReview);

        const sendReviewName = newReview.name;

        this.setState({
            submitted: true
        })

        document.getElementById("createReviewForm").reset();
    }

    renderReviewName() {
        if (this.state.submitted === true) {
            return (
                <div>
                    <p>You just made a new review for {this.state.review.name} available to the staff.</p>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <div>
                    <h1>Manage Active Reviews</h1>
                </div>
                <form action="" id="createReviewForm">
                    <label htmlFor="name">Review For:</label>
                    <input
                        type="text"
                        onChange={(e) => this.updateForm('name', e.target.value)}
                    />
                    <label htmlFor="notes">Notes or instructions:</label>
                    <input
                        type="text"
                        onChange={(e) => this.updateForm('notes', e.target.value)}
                    />
                    <button
                        onClick={this.handleSubmit.bind(this)}
                        type="submit">
                        Create New Review
                        </button>
                </form>
                <div>
                    {this.renderReviewName()}
                </div>
            </div>
        )
    }
}

export default ManageReviews;
import React from 'react';

class ManageEmployees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: {
                name: '',
                jobTitle: '',
                email: ''
            },
            submitted: false
        }
        this.renderName = this.renderName.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }    
    
    updateForm(key, value) {
        const { employee } = this.state;
        const employeeInput = employee;
        employeeInput[key] = value;

        this.setState({
            employee: employeeInput,
            submitted: false
        })

    }

    handleSubmit(e) {
        e.preventDefault();
        const newEmployeeInput = this.state.employee;
        this.props.getNewEmployeePayload(newEmployeeInput);

        const sendName = newEmployeeInput.name;
        
        this.setState({
            submitted: true
        });

        document.getElementById("createEmployeeForm").reset();
    }
    

    renderName() {
        if(this.state.submitted === true) {
            return (
                <div>
                    <p>You just added {this.state.employee.name} to the database.</p>
                </div>
            )  
        }
    }
    

    render() {
        return (
            <div>
                <div>
                    <h1>Add Employee</h1>
                    <form action="" id="createEmployeeForm">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            onChange={(e) => this.updateForm('name', e.target.value)}
                        />
                        <label htmlFor="jobTitle">Job Title</label>
                        <input
                            type="text"
                            onChange={(e) => this.updateForm('jobTitle', e.target.value)}
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            onChange={(e) => this.updateForm('email', e.target.value)}
                        />
                        <button
                            onClick={this.handleSubmit.bind(this)}
                            type="submit">
                            Create New Employee
                        </button>
                    </form>
                    <div>
                        {this.renderName()}
                    </div>
                </div>
            </div>
        )
    }
}

export default ManageEmployees;
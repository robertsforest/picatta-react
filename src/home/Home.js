import React, { Component } from 'react';
import './Home.css';
import axios from 'axios';

class Home extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    
    render() {
        return (
            <div className="home-container">
                <div className="container">
                    <div>
                        <BootstrapUpload currentUser={this.props.currentUser}/>
                    </div>
                </div>
            </div>
        )
    }

    
}

class BootstrapUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        }
        console.log(props);
    }

    onChangeHandler= event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }

    onClickHandler = () => {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        data.append('email',this.props.currentUser.email)
        axios.post("http://localhost:8080/upload", data, { 
           // receive two    parameter endpoint url ,form data
       })
       .then(res => { // then print response status
        console.log(res.statusText)
     })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group files">
                            <label>Upload Your File </label>
                            <input type="file" className="form-control" multiple="" onChange={this.onChangeHandler}/>
                        </div>
                        <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Home;
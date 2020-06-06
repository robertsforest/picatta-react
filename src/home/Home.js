import React, { Component } from 'react';
import './Home.css';
import axios from 'axios';
import LoadingIndicator from '../common/LoadingIndicator';

class Home extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            imageList: [],
            isLoading: false,
        }
        this.imageList = []
        
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
            selectedFile: null,
            isLoading: false,
            imageList: []
        }
        this.imageList = []
        this.listHandler = this.listHandler.bind(this)
    }

    listHandler() {
        this.setState({ isLoading: true });
        console.log("about to make apiCall listImages");
        axios.get('http://localhost:8080/listImages', {
            params: {
                email: this.props.currentUser.email
            }
        })
            .then(response => {
                this.imageList = response.data; 
                this.setState({ imageList: response.data, isLoading: false });
                console.log("completed apiCall listImages");
            })
            .catch(err => { console.log('Something bad has happened:', err) })
    }

    componentDidMount(){
        this.listHandler();
        console.log("completed list handler within componentWillMount");
        console.log(this.state)
    }

    onChangeHandler= event => {
        this.setState({
            selectedFile: event.target.files[0],
            isLoading: true
        })
        this.listHandler()
    }

    onClickHandler = () => {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        data.append('email',this.props.currentUser.email)

        this.setState({
            isLoading: true
        }, () => {axios.post("http://localhost:8080/upload", data, { 
           // receive two    parameter endpoint url ,form data
       })
       .then(res => { // then print response status
        console.log(res.statusText);
        this.listHandler();
        console.log("completed list handler within onClickHandler");
        })
    })       
        
    }


    render() {
        const { data, isLoading } = this.state;

        return (
            
            <div className="container">
                <div className="row">
                    <div>
                        {isLoading ? <LoadingIndicator /> : <ImageList currentUser={this.props.currentUser} imageList={this.imageList} listHandler={this.listHandler}/>}
                    </div>
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

class ImageList extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <div className="container">
                <div className="container-fluid">
                    <div className="row">
                        {this.props.imageList.map((image, index) => (
                        <Image key={index} image={image} currentUser={this.props.currentUser}/>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.listHandler = this.listHandler.bind(this)
    }

    clickDelete = () => {
        const payload = new FormData()
        payload.append('fileName',this.props.image.fileName)
        console.log("payload is " + payload);
        this.setState({
            isLoading: true
        }, () => {axios.delete("http://localhost:8080/deleteFile", {data: payload})
       .then(res => { // then print response status
        console.log(res.statusText);
        this.listHandler();
        console.log("completed list handler within clickDelete");
        })
    })       
        
    }

    listHandler() {
        this.setState({ isLoading: true });
        console.log("about to make apiCall listImages in Image class");
        axios.get('http://localhost:8080/listImages', {
            params: {
                email: this.props.currentUser.email
            }
        })
            .then(response => {
                this.imageList = response.data; 
                this.setState({ imageList: response.data, isLoading: false });
                console.log("completed apiCall listImages in Image");
            })
            .catch(err => { console.log('Something bad has happened:', err) })
    }



    render() {
        return (
            <div className="col-md-4 col-sm-4 col-xs-4">
                <a href={"https://picatta-images.s3.us-east-2.amazonaws.com/" + this.props.image.fileName}>
                <img src={"https://picatta-images.s3.us-east-2.amazonaws.com/" + this.props.image.fileName} className="img-thumbnail" alt={this.props.image.origName}/>
                </a>
                <button type="button" className="btn btn-danger btn-block" onClick={this.clickDelete}>Delete</button>
		    </div>
        );
    }
}


export default Home;
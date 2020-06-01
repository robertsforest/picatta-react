import React, { Component } from 'react';
import './Home.css';
import axios from 'axios';

class Home extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            imageList: [],
            isLoading: false,
        }
        this.imageList = []
        this.listHandler = this.listHandler.bind(this)
        
    }

    listHandler() {
        this.setState({ isLoading: true });
    
        axios.get('http://localhost:8080/listImages', {
            params: {
                email: this.props.currentUser.email
            }
        })
            .then(response => {
                this.setState(prevState => ({ imageList: response.data, isLoading: false }));
                this.imageList = response.data; 
            })
            .catch(err => { console.log('Something bad has happened:', err) })
    }

    componentDidMount(){
        this.listHandler()
    }
    
    
    render() {
        return (
            <div className="home-container">
                <div className="container">
                    <div>
                        <ImageList currentUser={this.props.currentUser} imageList={this.imageList} listHandler={this.listHandler}/>
                    </div>
                    <div>
                        <BootstrapUpload currentUser={this.props.currentUser} listHandler={this.listHandler}/>
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
            isLoading: false
        }
        console.log(props);
    }

    onChangeHandler= event => {
        this.setState({
            selectedFile: event.target.files[0],
            isLoading: true
            
        })
        this.props.listHandler()
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
        this.setState({
            isLoading: true
        })
        this.props.listHandler()
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

class ImageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
        console.log(props);
    }

    componentDidMount(){
        this.setState({
            isLoading: true
        })
        this.props.listHandler()
    }

    render() {
        return (
            <div className="container">
                <div className="col-12 col-sm-8 col-lg-5">
                <div className="container-fluid">
                    <div className="row">
                        {this.props.imageList.map((image, index) => (
                        <Image key={index} image={image} />
                        ))}
                    </div>
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
        console.log(props);
    }

    render() {
        return (
            <div className="col-md-3 col-sm-4 col-xs-6">
                <a href={"https://picatta-images.s3.us-east-2.amazonaws.com/" + this.props.image.fileName}>
                <img src={"https://picatta-images.s3.us-east-2.amazonaws.com/" + this.props.image.fileName} className="img-thumbnail" alt={this.props.image.origName}/>
                </a>
		    </div>
        );
    }
}


export default Home;
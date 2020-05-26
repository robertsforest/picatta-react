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
            selectedFile: null
        }
        console.log(props);
    }

    onChangeHandler= event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
            
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
        this.props.listHandler()
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

class ImageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        console.log(props);
    }

    componentDidMount(){
        this.props.listHandler()
    }

    render() {
        return (
            <div className="container">
            <div className="row">
                <div className="col-12 col-sm-8 col-lg-5">
                <h6 className="text-muted">List Group with Images</h6>
                <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                    Don Quixote
                    <div className="image-parent">
                        <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/don_quixote.jpg" className="img-fluid" alt="quixote"/>
                    </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                    As I Lay Dying
                    <div className="image-parent">
                        <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/as_I_lay.jpg" className="img-fluid" alt="lay"/>
                    </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                    Things Fall Apart
                    <div className="image-parent">
                        <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/things_fall_apart.jpg" className="img-fluid" alt="things"/>
                    </div>
                    </li>
                </ul>
                </div>
                <div>
                    {this.props.imageList.map((image, index) => (
                        <Image key={index} image={image} />
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
        console.log(props);
    }

    render() {
        return (
            <div className="image">
              <h3>Image {this.props.key + 1}</h3>
              <h2>{this.props.image.fileName}</h2>
            </div>
        );
    }
}


export default Home;
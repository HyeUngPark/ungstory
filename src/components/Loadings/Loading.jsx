import React from 'react';
import { 
      Modal,
      ModalBody,
      Spinner } from 'reactstrap';
import { withRouter } from 'react-router-dom';

// var loadYn = false;

class Loading extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      load : false
    };

  }

  toggle=()=>{
    console.log("Loading's toggle() >> ");
    // this.setState(prevState => ({
    //   load: !prevState.load
    // }));
    // loadYn ? loadYn = false : loadYn =true;
  }


  render() {
    Loading.defaultProps = {
      toggle: () =>{
        // console.log("Loading's toggle() >> ",this.state.load);
        this.setState(prevState => ({
          load: !prevState.load
        }));
        // loadYn ? loadYn = false : loadYn =true;
      }
    };
    return (
    <>
      <Modal 
        // isOpen={loadYn} 
        isOpen={this.state.load} 
        backdrop={false}
        zIndex = "1"
        size ="lg"
      >
        <ModalBody>
          Loading... <Spinner color="primary" />
        </ModalBody>
      </Modal>
    </>
    );
    
  }
}

export default withRouter(Loading);

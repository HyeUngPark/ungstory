import React from 'react';
import { Spinner } from 'reactstrap';

class Loading extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
    <>
      <div>
          Loading... <Spinner color="primary" />
      </div>
    </>
    );
  }
}

export default Loading

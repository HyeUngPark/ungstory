import React from 'react';
import { SyncLoader } from "react-spinners";

const override = `
  display: block;
  margin: 2 auto;
  border-color: red;
  `;

class Loading extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
    <>
      <div className="text-center"> 
          <SyncLoader
            css={override}
            size={12}
            color={"#123abc"}
            loading={true}
          />
      </div>
    </>
    );
  }
}

export default Loading

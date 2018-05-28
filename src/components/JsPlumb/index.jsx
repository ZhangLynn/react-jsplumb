import React from 'react';
import {jsPlumb} from 'jsplumb';
import LeftArea from './leftArea';
import RightArea from './rightArea';
import BottomArea from './bottomArea';


export default class JsPlumb extends React.Component {
  state = {
    pos: [0,0],
    datas: {}
  }

  jsp=jsPlumb.getInstance();

  updatePositon = (pos) => {
    this.setState({pos});
  }

  saveDatas = (datas) => {
    this.setState({datas});
  }
  
  render() {
    const { pos, datas } = this.state;
    return (
      <div className="jsplumb-page">
        <div>
          {/*<LeftArea  />*/}
          <RightArea />
        </div>
        <BottomArea  datas={datas}/>
      </div>
    );
  }
}


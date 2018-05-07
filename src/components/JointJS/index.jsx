import React from 'react';
import joint from 'jointjs';

class AppComponent extends React.Component {
  componentDidMount() {
    console.log(joint);
    let graph = new joint.dia.Graph();
    new joint.dia.Paper({
        el: this.myholder,
        width: 600,
        height: 400,
        gridSize: 1,
        model: graph
    });

    let rect = new joint.shapes.basic.Rect({
        position: { x: 50, y: 70 },
        size: { width: 100, height: 40 }
    });

    let rect2 = rect.clone();
    rect2.translate(300);

    var link = new joint.dia.Link({
      source: {
        id: rect.id
      },
      target: {
        id: rect2.id
      }
    });

    link.attr({
      '.connection': { stroke: 'blue' },
      '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
      '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
    });
    link.set('smooth', true)

    graph.addCell([rect, rect2, link]);

    graph.on('all', function(eventName, cell) {
      // console.log(arguments,"------------");
    });
    rect.on('change:position', function(element) {
      // console.log(element.id, ':', element.get('position'),);
    });
    
  }
  render() {
    return (
      <div className="jointjs-page">
        <div id="myholder" ref={myholder=>this.myholder=myholder}> </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

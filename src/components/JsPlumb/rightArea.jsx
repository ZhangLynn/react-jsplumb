import React from 'react';
import {Modal,Input,Button,Icon} from 'antd';
import { jsPlumb } from 'jsplumb';
import uuidv1 from 'uuid/v1';
import $ from 'jquery'


const DynamicAnchors = ['Left', 'Right', 'Top', 'Bottom']
const connectorStyle = { stroke: '#7AB02C', strokeWidth: 2, joinstyle: 'round' }
const connectorHoverStyle = { stroke: '#5c96bc', strokeWidth: 3 }
const endpointStyle = { fill: 'transparent', stroke: '#7AB02C', radius: 7, strokeWidth: 1 }
const endpointHoverStyle = { fill: '#5c96bc', stroke: '#5c96bc', radius: 7, strokeWidth: 1 }
const anEndpoint = {
  connector: 'Flowchart',
  endpoint: 'Dot',
  isSource: true,
  isTarget: true,
  paintStyle: endpointStyle,
  hoverPaintStyle: endpointHoverStyle,
  connectorStyle: connectorStyle,
  connectorHoverStyle: connectorHoverStyle
}
const Common = {
  anchor: 'AutoDefault',
  connector: 'Flowchart',
  endpoint: 'Dot',
  paintStyle: connectorStyle,
  hoverPaintStyle: connectorHoverStyle,
  endpointStyle,
  endpointHoverStyle,
  // overlays:[
  //     ["Custom", {
  //         create:function(component) {
  //             return $("<button id='overlaybtn'>hhh</button>");
  //         },
  //         location:0.7,
  //         id:"customOverlay",
  //         // visible:false,
  //     }]
  // ]
}
export default class RightArea extends React.Component {
  state = {
    initialized: false,
    dialogVisible: false,
    datas: null,
    dialogTitle: '',
    labelText: '',
    nodes: [],
    edges: [],
    info: null,
  }

  componentDidMount() {
    this.init();
    this.refs.nodes = [];
    
  }
  componentWillMount = () => {

  }
  hideModal = () => {
    this.setState({dialogVisible:false});
  }

  init = () => {
    this.rjsp = jsPlumb.getInstance({
      ConnectionOverlays: [
        ['Arrow', { location: 1, id: 'arrow', width: 11, length: 11 }],
          ["Label", {  //标签参数设置
              location: 0.1,
              cssClass: "aLabel", //hover时label的样式名
              events: {
                  click:info=>{
                      console.log(info);
                  }
              },
              id:"foo",
              visible: true
          }],
          ["Custom", {
              create:component=> {
                  // console.log(component);
                  function editConnector(component){
                      console.log(component);
                  }
                  return $("<div id='overlaybtn'><i class='icon' onclick=function(component){console.log(component);}>编辑 </i><i class='icon'> 删除</i></div>");
              },
              location:0.7,
              id:"customOverlay",
              // visible:false,
              events:{
                click:info=>{
                    console.log(info);
                }
              }
          }]
      ],
    })
    this.props.jsp.droppable(this.refs.right, { drop: this.jspDrop })
    this.rjsp.bind('beforeDrop', this.jspBeforeDrop);
    // this.rjsp.bind("click",this.showEditConnectionBtn);
    this.fetchData()
  }

  fetchData () {
    var jsonString = '{"nodes":[{"className":"square","id":"64d442f0-3d3a-11e8-bf11-4737b922d1c3","text":"11开始","style":{"left":"172px","top":"29px"}},{"className":"circle","id":"6575b310-3d3a-11e8-bf11-4737b922d1c3","text":"过程","style":{"left":"157.515625px","top":"175px"}},{"className":"rect","id":"660cea00-3d3a-11e8-bf11-4737b922d1c3","text":"结束","style":{"left":"188.515625px","top":"350px"}}],"edges":[{"source":"64d442f0-3d3a-11e8-bf11-4737b922d1c3","target":"6575b310-3d3a-11e8-bf11-4737b922d1c3","labelText":"sdd"},{"source":"6575b310-3d3a-11e8-bf11-4737b922d1c3","target":"660cea00-3d3a-11e8-bf11-4737b922d1c3","labelText":"sdssd"}]}';
    var nodeData = JSON.parse( jsonString );
    this.setState({datas:nodeData, nodes: nodeData.nodes, edges: nodeData.edges},() => {
      this.initNodes(this.refs.nodes);
      this.initEdges(nodeData.edges);
    });
  }


  jspBeforeDrop = (info) => {
    info.targetId = info.dropEndpoint.elementId
    let connections = this.rjsp.getConnections({ source: info.sourceId, target: info.targetId })
    if (info.targetId === info.sourceId) {
      Modal.warning({
        title: '不可以自己连接自己'
      });
    } else {
      if (connections.length === 0) {  // 检察是否已经建立过连接
        this.setState({info});
        this.addEdge(info);
      } else {
        Modal.warning({
          title: '两个节点之间只能有一条连接'
        })
      }
    }
  }

  jspDrop = (info) =>{
    this.setState({info});
    let nodes = JSON.parse(JSON.stringify(this.state.nodes));
    nodes.push(this.createNode(info.drag.el, info.drop.el));
    this.setState({nodes},()=>{
      this.initNodes(this.refs.nodes[this.state.nodes.length-1]);
    });
  }

  createNode = (dragEl, dropEl) => {
    let rect = dropEl.getBoundingClientRect()
    return {
      className: dragEl.classList[0],
      id: uuidv1(),
      text: dragEl.innerText,
      style: {
        left: this.props.pos[0] - rect.left - dropEl.clientLeft + 'px',
        top: this.props.pos[1] - rect.top - dropEl.clientTop + 'px'
        // lineHeight: dragEl.clientHeight + 'px'
      }
    }
  }

  initNodes = (node) => {
    this.rjsp.draggable(node, {constrain:true});
    this.rjsp.setSuspendDrawing(true);
    DynamicAnchors.map(anchor => this.rjsp.addEndpoint(node, anEndpoint, { anchor }));
    this.rjsp.setSuspendDrawing(false,true);
  }

  initEdges = (edges) => {
    this.rjsp.setSuspendDrawing(true);

    let connectors=edges.map(edge => this.rjsp.connect(edge, Common))
      connectors.map(connector=>{
          console.log(connector);
          connector.bind("click",function(){
          let overlay=connector.getOverlay("customOverlay");
              console.log(overlay);
              overlay.hide()
        })
      })
      // console.log(edges);
      // edges.map(edge => this.rjsp.connect(edge, Common).getOverlay('foo').setLabel(edge.labelText))
    this.rjsp.setSuspendDrawing(false,true);
  }

  showEditConnectionBtn=(info)=>{
      console.log(info);
      let connect=info.connector;
      let id=connect.getId();
      console.log(id);
      info.hideOverlay('Custom');

  }
  //   deleteEdge=(info)=>{
  //
  //     Modal.confirm({
  //         title:"删除连线",
  //         content:"确认删除这个连接关系吗?",
  //         onOk(){
  //             if(mapSourceId){
  //                 _this.rjsp.deleteConnectionsForElement(info.source.id)//删除指定连线
  //                 _this.setState({
  //                     connect_edges:_this.state.connect_edges.filter(edge=>{
  //                         if(edge.source===sourceId&&edge.target===targetId){
  //                             return false
  //                         }else{
  //                             return true
  //                         }
  //                     })
  //                 });
  //                 _this.props.removeMapModel({"access_token":"311",'id':mapSourceId});
  //
  //             }else {
  //                 console.log("删除连线失败 没有mapSourceId");
  //             }
  //
  //         },
  //         onCancel() {},
  //     })
  // }

  editLabelText = (info) => {
      console.log(info);
      this.setState({dialogVisible:true, info: info.component, labelText:info.labelText});
  }

  activeElem = () => {
    console.log('activeElem');
  }

  deleteNode = (event,node) => {
    event.stopPropagation();
    this.rjsp.deleteConnectionsForElement(node.id);
    let edges = this.rjsp.getAllConnections().map(connection => {
      return {
        source: connection.sourceId,
        target: connection.targetId,
        labelText: connection.getOverlay('label').labelText
      }
    });
    let nodes = Object.assign([],this.state.nodes);
    nodes.splice(nodes.findIndex(n=>n.id===node.id),1);
    this.setState({datas:{nodes,edges},nodes,edges}, ()=>{
      this.reload();
    });
  }
  
  addEdge = (info) => {
    this.rjsp.connect({ source: info.sourceId, target: info.targetId }, Common);
  }

  reload = () => {
    this.clearAll();
    this.setState({
      nodes: this.state.datas.nodes,
      edges: this.state.datas.edges
    })
    this.rjsp.bind('beforeDrop', this.jspBeforeDrop);
    this.initNodes(this.refs.nodes.filter(refNode=>refNode));  // 删除一个节点后，它对应的ref为null，要去掉
    this.initEdges(this.state.edges);
  }

  clearAll = () => {
    this.rjsp.reset();
    this.setState({nodes:[]});
  }

  changeLabel = (e) => {
    let value = e.target.value;
    this.setState({labelText:value});
  }

  saveLabel = () => {
    this.state.info.getOverlay('label').setLabel(this.state.labelText);
    this.hideModal();
  }

  saveDatas = () => {
    let datas = {
      nodes: this.state.nodes.map((node, index) => {
        node.style = this.getStyle(this.refs.nodes[index])
        return node
      }),
      edges: this.rjsp.getAllConnections().map(connection => {
        return {
          source: connection.sourceId,
          target: connection.targetId,
          labelText: connection.getOverlay('label').labelText
        }
      })
    }
    this.setState({datas});
    this.props.saveDatas(datas);
  }

  getStyle (node) {
    let container = this.refs.right.getBoundingClientRect()
    let rect = node.getBoundingClientRect()
    return {
      left: rect.left - container.left - this.refs.right.clientLeft + 'px',
      top: rect.top - container.top + - this.refs.right.clientTop + 'px'
    }
  }

  render(){
    return (
      <div className="right-area" ref="right">
        <div  className="demo">
          <Button type="primary" onClick={this.saveDatas}>保存</Button>
          <Button type="primary" onClick={this.clearAll}>清除</Button>
        </div>
        <Modal
          title="编辑连接的文本"
          visible={this.state.dialogVisible}
          onCancel={this.hideModal}
          footer={[
            <Button key="back" onClick={this.hideModal}>取消</Button>,
            <Button key="submit" type="primary" onClick={this.saveLabel}>
              确定
            </Button>
          ]}>
          <Input placeholder="Basic usage" value={this.state.labelText} onChange={this.changeLabel}/>
        </Modal>
        {this.state.nodes.map((node,index)=>{
         return(
          <div
            key={index}
            className={'node '+node.className}
            id={node.id}
            ref={nodes=>this.refs.nodes[index]=nodes}
            style={node.style}
            onClick={this.activeElem}
          >
            {node.text}
            <div className="delete-btn" onClick={event=>this.deleteNode(event,node)}>X</div>
          </div>
          )
        })}
      </div>
    );
  }
}

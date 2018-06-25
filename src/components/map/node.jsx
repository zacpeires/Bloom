import React, { Component } from 'react'
import './node.css'
import { NodeObject } from './'

class Node extends Component {
    constructor(props) {
      super(props)
      this.dragger = React.createRef()
      this.state = {
          text: 'Node Name',
          isEdit: false,
          pos1: 0,
          pos2: 0,
          pos3: 0,
          pos4: 0,
          left: this.props.left || '50',
          top: this.props.top || '50',
          children: [],
          shouldEdit: true
      }
    }

    handleChange = (ev) => {
        this.setState({
            ...this.state,
            [ev.target.name]: ev.target.value
        })
    }

    drag = (ev) => {
        //the should edit for child nodes is being attached to the root node
        ev.stopPropagation()
        this.setState({
            ...this.state,
            pos1: this.state.pos3 - ev.clientX,
            pos2: this.state.pos4 - ev.clientY,
            pos3: ev.clientX,
            pos4: ev.clientY,
            top: (this.dragger.current.offsetTop - this.state.pos2),
            left: (this.dragger.current.offsetLeft - this.state.pos1),
            shouldEdit: false,
        })
    }

    startDrag = (ev) => {
        ev.stopPropagation()
        this.setState({
            ...this.state,
            pos3: ev.clientX,
            pos4: ev.clientY,
        })
        document.onmousemove = this.drag
        document.onmouseup = this.stopDrag
    }

    stopDrag = (ev) => {
        ev.stopPropagation()
        document.onmousemove = null
    }

    addNode = (ev) => {
        ev.stopPropagation()
        this.setState({
            ...this.state,
            children: [...this.state.children, {left: '200', top: `${this.state.children.length * 100 - 100}`}]
        })
    }


  render() {
    return (
        <div className="nodeWrap">
            <svg className="line" height={Math.abs(this.state.top) + 2 + 'px'} width={Math.abs(this.state.left) + 2 + 'px'}>
                <line x1="0" y1="0" x2={this.state.left + 'px'} y2={this.state.top + 'px'} style={{stroke:'rgb(255,0,0)', strokeWidth:2}} />
            </svg>
            <div className="dragger" onMouseDown={this.startDrag} ref={this.dragger} style={{left: this.state.left + 'px', top: this.state.top + 'px'}}>
                <NodeObject addNode={this.addNode} handleChange={this.handleChange} text={this.state.text} />
                {this.state.children.map(node => {
                        return <Node left={node.left} top={node.top}/>
                    })
                }
            </div>
        </div>
    );
  }
}

export default Node
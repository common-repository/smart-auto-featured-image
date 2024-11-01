const { Component } = wp.element;

class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTool: props.activeTool || 'select'
        };

        this.selectTool = this.selectTool.bind(this);
    }

    componentDidUpdate(prevProps) {
        if ( prevProps.activeTool !== this.props.activeTool){
            this.setState({selectedTool: this.props.activeTool});
        }
    }

    selectTool(e) {
        // console.log(e.target);
        const clickedTool = e.target.closest('.safi-tool');

        if ( clickedTool ){

            const toolId = clickedTool.dataset.tool
            this.setState({
                selectedTool: toolId
            })

            this.props.toolChanged(toolId);
        }
        
    }


    render() {

        return (
            <div class="safi-toolbar">
                {this.props.tools.map((item) => {
                    return (
                        <div
                            className={'safi-tool safi-icon-container' + (this.state.selectedTool === item.id ? ' --active' : '')}
                            data-tool={item.id}
                            data-tooltip={item.label}
                            title={item.label}
                            onClick={this.selectTool}
                        >
                            <svg className="svg" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                <path d={item.iconSvgPath} fillRule="nonzero" fillOpacity="1" fill="#000" stroke="none"></path>
                            </svg>
                        </div>
                    );

                })}

            </div>
        );
    }
};

export default Toolbar;
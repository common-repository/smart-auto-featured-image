const { Component } = wp.element;

class Icon extends Component {

    render() {

        return (
            <span class="material-icons safi" onClick={this.props.onIconClick}>{this.props.icon}</span>
        );
    }
};

export default Icon;
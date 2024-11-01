const { Component } = wp.element;
// import React from 'react';
import Icon from '../Icon';

class SegmentedButtons extends Component {


    constructor(props) {
        super(props);
        this.state = {
            selectedSegment: props.selectedSegment || -1,
        };
        this.renderSegments = this.renderSegments.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    // componentDidMount() {
    //     // let selected = -1;

    //     // this.props.segments.findIndex(function (element) {
    //     //     return element.hasOwnProperty('isSelected') && element.isSelected === true;
    //     // });

    //     // this.setState({ selectedSegment: selected });
    // }

    componentDidUpdate(prevProps) {

        if (prevProps.selectedSegment !== this.props.selectedSegment) {
            this.setState({ selectedSegment: this.props.selectedSegment });
        }

    }


    onChange(selectedSegment) {
        // this.setState({ selectedSegment });

        const value = this.props.segments[selectedSegment].value;

        if (this.props.onChangeSegment) {
            this.props.onChangeSegment(value);
        }
    };


    renderSegments = () => {
        const {type} = this.props;
        return (
            this.props.segments.map((segment, i) => {
                const segmentId = segment.id ? segment.id : segment.value;
                const content = type && type == 'text' ? <span>{segment.label}</span> : <Icon icon={segment.icon} />;
                return (
                    <div
                        key={i}
                        id={`segmented-button-` + segmentId}
                        className={`segmented-button${this.state.selectedSegment === segment.value ? ' --selected' : ''}`}
                        aria-disabled={segment.isDisabled ? true : false}
                        data-value={segment.value}
                        onClick={() => this.onChange(i)}
                    >
                        {content}
                    </div>
                );
            })
        )
    }


    render() {
        return (
            <div className="safi-input">
                <div className="safi-segmented-buttons--container">
                    {this.renderSegments()}
                </div>
            </div>
        );
    }
};

export default SegmentedButtons;
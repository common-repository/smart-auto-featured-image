const { Component } = wp.element;
import Icon from '../Icon';
// import SvgIcon from '../SvgIcon';
import SvgIcons from '../../SvgIcons';

class IconButtons extends Component {


    constructor( props ) {
        super( props );
        this.renderSegments = this.renderSegments.bind( this );
        this.onChange = this.onChange.bind( this );
        this.isSVG = this.props.svg === true;

    }

    componentDidUpdate( prevProps ) {

        if ( prevProps.selectedSegment !== this.props.selectedSegment ) {
            this.setState( { selectedSegment: this.props.selectedSegment } );
        }

    }

    onChange( selectedSegment ) {
        // this.setState({ selectedSegment });

        const value = this.props.segments[selectedSegment].value;
        // console.log(selectedSegment, value);

        if ( this.props.onButtonClick ) {
            // console.log("this.props.onButtonClick");
            this.props.onButtonClick( value );
        }

        if ( this.props.onChangeSegment && this.props.buttonType === "radio" ) {
            this.props.onChangeSegment( value );
        }
    };


    renderSegments = () => {
        return (
            this.props.segments.map( ( segment, i ) => {
                const segmentId = segment.id ? segment.id : segment.value;
                return (
                    <div
                        key={i}
                        id={`segmented-button-` + segmentId}
                        className={`segmented-button`}
                        aria-disabled={segment.isDisabled ? true : false}
                        data-value={segment.value}
                        title={segment.title}
                        onClick={() => this.onChange( i )}
                    >
                        {this.isSVG &&
                            SvgIcons[segment.icon]
                        }
                        {!this.isSVG &&
                            <Icon icon={segment.icon} />
                        }
                    </div>
                );
            } )
        )
    }


    render() {
        // console.log(this.props);
        return (
            <div className="safi-input">
                <div className="safi-segmented-buttons--container">
                    {this.renderSegments()}
                </div>
            </div>
        );
    }
};

export default IconButtons;
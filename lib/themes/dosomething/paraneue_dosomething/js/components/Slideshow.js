import SlideshowController from './SlideshowController';

const React = require('react');
const { analyze } = require('@dosomething/analytics');

/**
 * Slideshow Component
 * <Slideshow />
 */
class Slideshow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSlide: 0,
      animationDirection: 'left'
    };

    this.moveBackward = this.moveBackward.bind(this);
    this.moveForward = this.moveForward.bind(this);
  }

  getCurrentSlideName() {
    return this.props.slides[this.state.currentSlide].analyticsIdentifier;
  }

  move(direction) {
    analyze('onboarding-v2', direction === 1 ? 'next' : 'prev' , this.getCurrentSlideName());

    this.setState({
      currentSlide: this.state.currentSlide + direction,
    });

    this.props.realign();
  }

  moveBackward() {
    this.move(-1);
  }

  moveForward() {
    this.move(1);
  }

  componentDidMount() {
    analyze('onboarding-v2', 'started on', this.getCurrentSlideName());
    this.props.realign();
  }

  componentWillUnmount() {
    analyze('onboarding-v2', 'closed' , this.getCurrentSlideName());
  }

  render() {
    const user = this.props.user;
    const campaign = this.props.campaign;

    const slides = this.props.slides.map((slide, index) => {
      const isActive = this.state.currentSlide == index;
      return React.createElement(slide, {key: index, campaign: campaign, user: user, isActive: isActive});
    });

    return (
      <div className="slideshow">
        {slides}

        <SlideshowController currentSlide={this.state.currentSlide} currentSlideName={this.getCurrentSlideName()} totalSlides={this.props.slides.length} moveBackward={this.moveBackward} moveForward={this.moveForward} close={this.props.close} />
      </div>
    );
  }
}

export default Slideshow;

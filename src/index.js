import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowEquals from './util/shallowEquals';
import { isNumber, isValidButton } from './util/validate';
import { sliderWrapper, selectable, sliderPath, sliderShadow, thumb } from './style';


export default class Slider extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onDone: PropTypes.func,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    displayThumb: PropTypes.bool,
    thumbColor: PropTypes.string,
    shadowColor: PropTypes.string,
    sliderPathColor: PropTypes.string,
    rounded: PropTypes.bool,
    style: PropTypes.object,
  };
  static defaultProps = {
    onDone: () => {},
    onChange: () => {},
    value: null,
    defaultValue: 0,
    displayThumb: true,
    thumbColor: '',
    shadowColor: '',
    sliderPathColor: '',
    rounded: true,
    style: {},
  };


  state = {
    percent: this.props.defaultValue,
    hover: false,
    isActive: false,
  };


  getPercent = () => {
    const percent = this._isControlled ? this.props.value : this.state.percent;

    if (percent > 100) {
      return 100;
    }
    if (percent < 0) {
      return 0;
    }
    return percent;
  };


  shouldUpdateState = (ns, cs) => shallowEquals(ns, cs);

  shouldUpdateProps = (np, cp) => shallowEquals(np, cp);


  componentDidMount() {
    this._isControlled = this.props.value !== null;
    this._sliderWidth = this._sliderRef.clientWidth;
    this._document = this._sliderRef.ownerDocument;

    window.addEventListener('resize', this.onWindowResize);

    const { value, defaultValue } = this.props;
    if (value > 0 || defaultValue > 0) {
      this.forceUpdate();
    }
  }


  shouldComponentUpdate = (np, ns) =>
    this.shouldUpdateState(ns, this.state) ||
    this.shouldUpdateProps(np, this.props);


  compontWillUnmount() {
    this.removeDocumentMouseEventListeners();
    this.removeWindowListeners();
  }


  removeWindowListeners() {
    this._sliderRef.addEventListener('resize', this.onWindowResize);
  }


  addDocumentMouseEventListeners() {
    this._document.addEventListener('mousemove', this.onMouseMove);
    this._document.addEventListener('mouseup', this.onMouseUp);
  }


  removeDocumentMouseEventListeners() {
    this._document.removeEventListener('mousemove', this.onMouseMove);
    this._document.removeEventListener('mouseup', this.onMouseUp);
  }


  onWindowResize = () => {
    this._sliderWidth = this._sliderRef.clientWidth;
    this.forceUpdate();
  };


  done = () => {
    this.props.onDone(this.getPercent());
  };


  update = (data) => {
    if (isNumber(data.percent) && data.percent !== this.getPercent()) {
      this.props.onChange(data.percent);

      if (!this._isControlled) {
        this.setState(data);
      } else {
        const { percent, ...nState } = data;
        this.setState(nState);
      }
    }
  };


  onMouseUp = () => {
    this.setState({ isActive: false });
    this.done();
    this.removeDocumentMouseEventListeners();
  };


  onMouseMove = (e) => {
    e.preventDefault();

    const newSliderOffset = this.calcNewSliderOffset(e.clientX, this.sliderStartPos);
    const percent = this.calcPercent(newSliderOffset);

    this.update({ percent });
  };


  onGrab = (e) => {
    if (!isValidButton(e.button)) return;

    const currentSliderOffset = this.getCurrentSliderOffset();
    this.sliderStartPos = this.calcSliderStartPos(e.nativeEvent.clientX, currentSliderOffset);

    this.setState({ isActive: true });

    this.removeDocumentMouseEventListeners();
    this.addDocumentMouseEventListeners();
  };


  onMouseDown = (e) => {
    if (!isValidButton(e.button)) return;

    this.sliderStartPos = this.calcSliderStartPos(e.nativeEvent.clientX, e.nativeEvent.offsetX);
    const newSliderOffset = this.calcNewSliderOffset(e.clientX, this.sliderStartPos);
    const percent = this.calcPercent(newSliderOffset);

    this.update({ percent, isActive: true });

    this.removeDocumentMouseEventListeners();
    this.addDocumentMouseEventListeners();
  };


  calcNewSliderOffset(clientOffsetX, sliderStartPos) {
    const offsetFromStart = clientOffsetX - sliderStartPos;
    if (offsetFromStart < 0) {
      return 0;
    } else if (offsetFromStart > this._sliderWidth) {
      return this._sliderWidth;
    }
    return offsetFromStart;
  }


  calcSliderStartPos = (clientOffsetX, offsetX) => clientOffsetX - offsetX;

  calcPercent = sliderOffset => (sliderOffset / this._sliderWidth) * 100;

  getCurrentSliderOffset = () => (this.getPercent() / 100) * this._sliderWidth;


  onMouseEnter = () => {
    this.setState({ hover: true });
  };

  onMouseLeave = () => {
    this.setState({ hover: false });
  };


  render() {
    const {
      onChange,
      onDone,
      displayThumb,
      thumbColor,
      shadowColor,
      sliderPathColor,
      rounded,
      style,
      ...restOfProps
    } = this.props;


    const {
      hover,
      isActive,
    } = this.state;


    const translateThumb = () => `translateX(${((this.getPercent() / 100) * this._sliderWidth)}px)`;

    const scaleShadow = () => `scaleX(${(this.getPercent() / 100)})`;

    const showThumb = () => ((hover || isActive || displayThumb) ? 'inline' : 'none');

    const getRoundness = () => (rounded ? '9999px' : '0px');


    const colors = {
      path: sliderPathColor || 'rgb(245, 245, 245)',
      shadow: shadowColor || 'rgb(131, 213, 252)',
      thumb: thumbColor || 'rgb(102, 202, 249)',
    };


    const sliderStyle = {
      sliderWrapperStyle: {
        ...sliderWrapper,
        ...style,
      },
      pathStyle: {
        ...sliderPath,
        backgroundColor: colors.path,
        borderRadius: getRoundness(),
      },
      shadowStyle: {
        ...sliderShadow,
        transform: scaleShadow(),
        backgroundColor: colors.shadow,
        borderRadius: getRoundness(),
      },
      thumbStyle: {
        ...thumb,
        transform: translateThumb(),
        backgroundColor: colors.thumb,
        display: showThumb(),
      },
    };


    return (
      <div
        style={sliderStyle.sliderWrapperStyle}
        {...restOfProps}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div
          style={selectable}
          onMouseDown={this.onMouseDown}
        >
          <div style={sliderStyle.pathStyle}>
            <div
              style={sliderStyle.shadowStyle}
              ref={(ref) => { this._sliderRef = ref; }}
            />
          </div>
        </div>
        <div
          style={sliderStyle.thumbStyle}
          onMouseDown={this.onGrab}
        />
      </div>
    );
  }
}

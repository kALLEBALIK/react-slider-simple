# react-slider-simple

**Install:**
```
yarn add react-slider-simple
```
or
```
npm install --save react-slider-simple
```
\
**Usage:**
```javascript
class App extends Component {
  render() {
    return (
        <Slider
          rounded={false}
        />
    );
  }
}
```
![sliding](https://i.gyazo.com/1808c35bcb125d62dd77cd0d5e7fa56a.gif)

```javascript
import React, { Component } from 'react';
import Slider from 'react-slider-simple';

export default class SliderComp extends Component {
  state  = {
    percent: 30,
  }

  onChange = (percent) => {
    console.log(percent);
    this.setState({ percent });
  }
  onDone = (percent) => {
    console.log(`I'm done. here's the percent: ${percent}%`);
  };

  render() {
    const { percent } = this.state;
    return (
        <Slider
          value={percent}
          onChange={this.onChange}
          onDone={this.onDone}
          thumbColor="rgb(219, 112, 147)"
          shadowColor="rgb(219, 112, 100)"
          sliderPathColor="rgb(119, 12, 47)"
        />
    );
  }
}
```
![sliding](https://i.gyazo.com/0edbf0af63fe27dc0c3bec324ba738ff.gif)

**Properties:**

| Property        | Description                      | Type       | Defaults     |
| -------------   | ---------------------------------|------------|--------------|
| onDone          | returns % of slider position     | function   | -            |
| onChange        | returns % of slider position     | function   | -            |
| value           | value of slider                  | number     | 0            |
| defaultValue    | default value of slider          | number     | 0            |
| displayThumb    | Always show thumb                | boolean    | true         |
| rounded         | rounded corners                  | boolean    | true         |
| thumbColor      | The color of thumb               | string     | -            |
| shadowColor     | The color of shadow              | string     | -            |
| sliderPathColor | The color of path                | string     | -            |

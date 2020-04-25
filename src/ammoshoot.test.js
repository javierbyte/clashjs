import React from 'react';
import {expect} from 'chai';
import {shallow, mount, render} from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Clash from './components/Clash';
import Ammos from './components/Ammos';
import Shoots from './components/Shoots';

configure({ adapter: new Adapter() });

describe('Enzyme Render', function () {
     
  it('Ammo amount should increase after time passes', function () {
    let app = render(<Clash/>);
    setTimeout(function() {
      expect(app.find('.clash-ammo').length).to.greaterThan(1);
    }, (10*1000));
  });

  it('Ammo amount should not exceed grid size', function() {
    let app = render(<Clash/>);
    expect(app.find('.clash-ammo').length).to.lessThan(13*13);
  });
  
  it('Shoot amount should increase after time passes', function () {
    let app = render(<Clash/>);
    setTimeout(function() {
      expect(app.find('.clash-shoot').length).to.greaterThan(1);
    }, (10*1000));
  });

  it('Shoot should make number of killed players increase', function () {
    let app = render(<Clash/>);
    setTimeout(function() {
      expect(app.find('.clash-kills').length).to.greaterThan(1);
    }, (10*1000));
  });

});

describe('Enzyme Shallow', function () {
  it('Ammos className should be `clash-layer animation-glow`', function () {
    let app = shallow(<Ammos/>);
	  expect(app.find('div').at(0).hasClass('clash-layer animation-glow')).to.equal(true);
  });

  it('Ammo should render after time passes', function () {
    let app = shallow(<Ammos/>);
    setTimeout(function() {
      expect(app.find(Ammos));
    }, (10*1000));
  });

  it('Shoots className should be `clash-layer`', function () {
    let app = shallow(<Shoots/>);
    expect(app.find('div').at(0).hasClass('clash-layer')).to.equal(true);
  })

  it('Shoots should render after time passes', function () {
    let app = shallow(<Shoots/>);
    setTimeout(function() {
      expect(app.find(Shoots));
    }, (10*1000));
  });

});

